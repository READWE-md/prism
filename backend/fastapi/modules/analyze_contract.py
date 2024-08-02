import os
import requests
import re
from openai import OpenAI
import json
from modules.store_contract_document import store_contract_document
import subprocess
from langchain_community.document_loaders import UnstructuredHTMLLoader
from pathlib import Path
import base64
import http.client
from tqdm import tqdm
import time
from pymilvus import connections, FieldSchema, CollectionSchema, DataType, Collection, utility


# 계약서 내용 총 분석


def analyze_contract(contract_raw, contract_id):

    contract_document = {
        "_id": contract_id,
        "clauses": []
    }

    for page_idx, image in enumerate(contract_raw.images):
        # 이미지 토큰화
        # print("[*] START: convert_image_to_token()")
        token_list = convert_image_to_token(image)
        # print(token_list)
        # print("[*] END: convert_image_to_token()")

        # 토큰 라인화
        # print("[*] START: convert_token_to_line()")
        line_list = convert_token_to_line(token_list)
        # print(line_list)
        # print("[*] END: convert_token_to_line()")

        # 라인 문단화
        # print("[*] START: convert_line_to_topic()")
        topic_list = convert_line_to_topic(line_list)
        # print(topic_list)
        # print("[*] END: convert_line_to_topic()")

        # 문단 오인식 보정
        # print("[*] START: correct_text()")
        for topic_idx in range(0, len(topic_list)):
            topic_list[topic_idx]["content"] = correct_text(
                topic_list[topic_idx]["content"])
            print(topic_list[topic_idx])
        # print("[*] END: correct_text()")

        # 문단 단위 조항 탐지
        check_list = []
        for check_idx in range(0, len(topic_list)):
            check_list.append(check_toxic(topic_list[check_idx]))
            print(check_list[check_idx])

        # 문단 box에 page 삽입
        for check_idx in range(0, len(check_list)):
            for box_idx in range(0, len(check_list[check_idx]["boxes"])):
                print(check_list[check_idx]["boxes"][box_idx])
                check_list[check_idx]["boxes"][box_idx]["page"] = page_idx + 1
            print(check_list[check_idx])

        contract_document["clauses"].extend(check_list)

    store_contract_document(contract_document)


# base64로 인코딩된 이미지를 OCR로 tokenize(네이버 클로바)
def convert_image_to_token(encoded_image):
    CLOVA_API_URL = os.getenv('CLOVA_OCR_API_URL')
    CLOVA_API_KEY = os.getenv('CLOVA_OCR_API_KEY')
    request_headers = {
        "X-OCR-SECRET": CLOVA_API_KEY,
        "Content-Type": "application/json"
    }
    request_data = {
        "version": "V2",
        "requestId": "string",
        "timestamp": 0,
        "lang": "ko",
        "images": [
            {
                "format": 'PNG',
                "data": encoded_image,
                "name": "ocr-sample",
                "url": None
            }
        ],
        "enableTableDetection": False
    }

    response = requests.post(
        CLOVA_API_URL, headers=request_headers, data=json.dumps(request_data))
    return response.json()

# 인식된 token들을 라인 단위로 조합
def convert_token_to_line(data):
    token_list = data['images'][0]['fields']
    result = {"lines": []}

    line = {
        "content": "",
        "boxes": {
            "ltx": float('inf'),
            "lty": float('inf'),
            "rbx": float('-inf'),
            "rby": float('-inf'),
        }
    }

    token_idx = 0

    while token_idx < len(token_list):
        token = token_list[token_idx]
        token_idx += 1
        vertices = token['boundingPoly']['vertices']

        for vertex in vertices:
            line["boxes"]['ltx'] = min(line["boxes"]['ltx'], vertex['x'])
            line["boxes"]['lty'] = min(line["boxes"]['lty'], vertex['y'])
            line["boxes"]['rbx'] = max(line["boxes"]['rbx'], vertex['x'])
            line["boxes"]['rby'] = max(line["boxes"]['rby'], vertex['y'])

        line['content'] = line['content'] + token['inferText'] + ' '

        if token.get('lineBreak'):
            line['content'] = line['content'].strip()
            result['lines'].append(line)
            line = {
                "content": "",
                "boxes": {
                    "ltx": float('inf'),
                    "lty": float('inf'),
                    "rbx": float('-inf'),
                    "rby": float('-inf'),
                }
            }

    return result

# 라인 단위를 조항 단위로 조합(현재는 정규표현식 사용)
def convert_line_to_topic(data):
    regex = re.compile(r'.*(제\d+조|\d+\.).*')
    result = []
    lines = data['lines']
    topic = {
        "content": "",
        "boxes": [],
    }

    for line in lines:
        if regex.match(line['content']):
            result.append(topic)
            topic = {
                "content": "",
                "boxes": [],
            }
        topic['content'] += line['content']
        topic['boxes'].append(line["boxes"])

    if topic['content']:
        result.append(topic)

    return result


# 오인식된 단어들 보정
def correct_text(content):
    OPEN_API_KEY = os.getenv('OPENAI_API_KEY')

    client = OpenAI(
        # This is the default and can be omitted
        api_key=OPEN_API_KEY
    )

    chat_completion = client.chat.completions.create(
        messages=[
            {"role": "system", "content": "내가 너에게 특정 텍스트를 줄꺼야. 해당 텍스트는 계약서 내용의 일부인데 기존 종이로 작성된 계약서를 OCR한 결과라 오타가 부분적으로 있어. 너가 오타라고 생각되는 부분을 최대한 수정해서 나에게 반환해줘. 다른 정보는 필요없고 수정본만 나에게 주면 되."},
            {"role": "user", "content": content}],
        model="gpt-4o",
    )
    return chat_completion.choices[0].message.content

# 계약 내용 내 위험 조항 분석
## 사용자의 질문에 대응하는 VectorDB에 저장된 데이터를 검색하는 로직
class CompletionExecutor:
    def __init__(self, host, api_key, api_key_primary_val, request_id):
        self._host = host
        self._api_key = api_key
        self._api_key_primary_val = api_key_primary_val
        self._request_id = request_id
 
    def execute(self, completion_request, response_type="stream"):
        headers = {
            "X-NCP-CLOVASTUDIO-API-KEY": self._api_key,
            "X-NCP-APIGW-API-KEY": self._api_key_primary_val,
            "X-NCP-CLOVASTUDIO-REQUEST-ID": self._request_id,
            "Content-Type": "application/json; charset=utf-8",
            "Accept": "text/event-stream"
        }
 
        final_answer = ""
 
        with requests.post(
            self._host + "/testapp/v1/chat-completions/HCX-003",
            headers=headers,
            json=completion_request,
            stream=True
        ) as r:
            if response_type == "stream":
                longest_line = ""
                for line in r.iter_lines():
                    if line:
                        decoded_line = line.decode("utf-8")
                        if decoded_line.startswith("data:"):
                            event_data = json.loads(decoded_line[len("data:"):])
                            message_content = event_data.get("message", {}).get("content", "")
                            if len(message_content) > len(longest_line):
                                longest_line = message_content
                final_answer = longest_line
            elif response_type == "single":
                final_answer = r.json()
            return final_answer

## 임베딩 API
class EmbeddingExecutor:
    def __init__(self, host, api_key, api_key_primary_val, request_id):
        self._host = host
        self._api_key = api_key
        self._api_key_primary_val = api_key_primary_val
        self._request_id = request_id
 
    def _send_request(self, completion_request):
        headers = {
            "Content-Type": "application/json; charset=utf-8",
            "X-NCP-CLOVASTUDIO-API-KEY": self._api_key,
            "X-NCP-APIGW-API-KEY": self._api_key_primary_val,
            "X-NCP-CLOVASTUDIO-REQUEST-ID": self._request_id
        }
 
        conn = http.client.HTTPSConnection(self._host)
        conn.request(
            "POST",
            "/serviceapp/v1/api-tools/embedding/clir-emb-dolphin/04a99dcfc692405a886acf158e78c7c1", # If using Service App, change 'testapp' to 'serviceapp', and corresponding app id.
            json.dumps(completion_request),
            headers
        )
        response = conn.getresponse()
        result = json.loads(response.read().decode(encoding="utf-8"))
        conn.close()
        return result
 
    def execute(self, completion_request):
        res = self._send_request(completion_request)
        if res["status"]["code"] == "20000":
            return res["result"]["embedding"]
        else:
            error_code = res["status"]["code"]
            error_message = res.get("status", {}).get("message", "Unknown error")
            raise ValueError(f"오류 발생: {error_code}: {error_message}")

## 사용자 쿼리를 임베딩
def query_embed(text: str):
    embedding_executor = EmbeddingExecutor(
        host="clovastudio.apigw.ntruss.com",
        api_key='-',
        api_key_primary_val='-',
        request_id='-'
    )
    request_data = {"text": text}
    response_data = embedding_executor.execute(request_data)
    return response_data

##답변 생성 함수
def html_chat(realquery: str) -> str:
    # 사용자 쿼리 벡터화
    query_vector = query_embed(realquery)

    #Milvus의 collection 로딩하기
    connections.connect("default", host="localhost", port="19530")
    collection = Collection("html_rag_test")
    utility.load_state("html_rag_test")

    collection.load()
 
    search_params = {"metric_type": "IP", "params": {"ef": 64}}
    results = collection.search(
        data=[query_vector],  # 검색할 벡터 데이터
        anns_field="embedding",  # 검색을 수행할 벡터 필드 지정
        param=search_params,
        limit=10,
        output_fields=["source", "text"]
    )
 
    reference = []
 
    for hit in results[0]:
        distance = hit.distance
        source = hit.entity.get("source")
        text = hit.entity.get("text")
        reference.append({"distance": distance, "source": source, "text": text})
 
    completion_executor = CompletionExecutor(
        host="https://clovastudio.stream.ntruss.com",
        api_key='-',
        api_key_primary_val='-',
        request_id='-'
    )
 
    preset_texts = [
        {
            "role": "system",
            "content": "- 너의 역할은 사용자의 질문에 reference를 바탕으로 답변하는거야. \n- 너가 가지고있는 지식은 모두 배제하고, 주어진 reference의 내용을 기반으로 답변해야해. 사용자의 질문은 어떤 계약서의 조항이야. 답변의 첫번째 줄에는 사용자가 준 계약서의 조항을 '위험', '주의', '안전'으로 분류해서 '위험', '주의', '안전'이라는 단어 중 하나만 적어줘. 두번째 줄에서부터는 그렇게 분류한 이유를 설명해줘."
        }
    ]
 
    for ref in reference:
        preset_texts.append(
            {
                "role": "system",
                "content": f"reference: {ref['text']}, url: {ref['source']}"
            }
        )
 
    preset_texts.append({"role": "user", "content": realquery})
 
    request_data = {
        "messages": preset_texts,
        "topP": 0.6,
        "topK": 0,
        "maxTokens": 1024,
        "temperature": 0.5,
        "repeatPenalty": 1.2,
        "stopBefore": [],
        "includeAiFilters": False
    }
 
    # LLM 생성 답변 반환
    response_data = completion_executor.execute(request_data)
    return response_data


def check_toxic(topic):
    response = html_chat(topic["content"])
    lines = response.splitlines()
    clauses_type=lines[0]
    explanation = '\n'.join(lines[1:])

    #todo: clauses_type에 안전, 주의, 위험 중 하나가 아닌 다른 string이 있는 경우

    return {
        "type": clauses_type,
        "content": topic["content"],
        "result": explanation,
        "boxes": topic["boxes"]
    }
