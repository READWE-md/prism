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
from typing_extensions import Annotated, NotRequired, TypedDict
from enum import Enum


class Box(TypedDict):
    """
    문서 사진 내 텍스트가 존재하는 박스 위치
    """
    ltx: int  # 왼쪽 위 x좌표
    lty: int  # 왼쪽 위 y좌표
    rbx: int  # 오른쪽 아래 x좌표
    rby: int  # 오른쪽 아래 y좌표
    page: int  # 텍스트가 존재하는 페이지

    def __init__(self, ltx, lty, rbx, rby, page):
        self.ltx = ltx
        self.lty = lty
        self.rbx = rbx
        self.rby = rby
        self.page = page


class Line(TypedDict):
    """
    문서 내 하나의 줄(row), 문장이 아닌 순수 같은 row에 위치하는 텍스트
    """
    content: str  # 라인 내 내용
    box: Box  # 라인의 박스

    def __init__(self, content, box):
        self.content = content
        self.box = box


class TopicType(Enum):
    SAFE = "safe"
    CAUTION = "caution"
    DANGER = "danger"


class Topic(TypedDict):
    """
    문서 내 하나의 문단, 조항 단위 or 같은 주제 단위의 텍스트
    """
    content: str  # 문단 내 내용
    boxes: list[Box]  # 문단의 박스들(Box의 집합)
    type:  str  # 문단의 위험도 타입 (safe, caution, dangers)
    result: str  # 문단의 분석 결과

    def __init__(self, content, boxes):
        self.content = content
        self.boxes = boxes


class ContractDocument(TypedDict):
    """
    실제 mongodb에 올라가는 Document 클래스
    """
    _id: int  # Document ID
    clauses: list[Topic]  # 문단들의 집합(ERD 상에서는 clause, 현 코드에서는 topic)

    def __init__(self, content, clauses):
        self.content = content
        self.clauses = clauses


def analyze_contract(contract_raw: list, contract_id: int):
    """
    받은 계약서 이미지들을 분석 후 MongoDB에 저장
    1. 네이버 클로버 OCR API를 사용하여 이미지들을 OCR
    2. 각 페이지 별로 라인들을 생성
    3. 인식한 라인들을 정규표현식을 사용하여 문단으로 조합
    4. 문단 단위로 오인식된 단어들 보정
    5. 문단 단위로 조항의 위험도 탐지
    6. 생성된 document를 mongodb에 저장

    Args:
        contract_raw (list): base64로 변환된 계약서 png 파일 리스트
        contract_id (int): MongoDB에 저장할 분석 결과의 ID

    Returns:
        None
    """

    # MongoDB에 저장될 document
    contract_document: ContractDocument = {'_id': contract_id, 'clauses': []}

    # 계약서 이미지들을 토큰화
    # *Clova OCR은 한번에 1장만 받음
    # image_token_list = []
    # for image in contract_raw.images:
    #     image_token_list.append(convert_images_to_token(image))

    # Clova 로컬 테스트 코드
    f = open("clova-sample.json", 'r')
    image_token_list = json.load(f)['images']

    # 토큰 라인화
    line_list: list[Line] = convert_token_to_line(image_token_list)

    # 라인 문단화
    topic_list: list[Topic] = convert_line_to_topic(line_list)

    # 문단 오인식 보정
    for topic_idx in range(0, len(topic_list)):
        topic_list[topic_idx]["content"] = correct_text(
            topic_list[topic_idx]["content"])
        print(topic_list[topic_idx]["content"])

    # 문단 단위 조항 탐지
    analyze_result_list: list[Topic] = []
    for check_idx in range(0, len(topic_list)):
        analyze_result_list.append(check_toxic(topic_list[check_idx]))
    contract_document["clauses"].extend(analyze_result_list)
    store_contract_document(contract_document)


def convert_images_to_token(image: str):
    """
    base64로 인코딩된 이미지를 OCR로 tokenize(네이버 클로바)

    Args:
        image (str): base64로 변환된 png 파일

    Returns:
        dict: OCR 결과
        example: {
            "uid": "96c27161e02341aaa0fe6ee5dca38f75",
            "name": "ocr-sample",
            "inferResult": "SUCCESS",
            "message": "SUCCESS",
            "validationResult": {
                "result": "NO_REQUESTED"
            },
            "convertedImageInfo": {
                "width": 627,
                "height": 835,
                "pageIndex": 0,
                "longImage": false
            },
            "fields": [
                {
                    "valueType": "ALL",
                    "boundingPoly": {
                        "vertices": [
                            {
                                "x": 230.0,
                                "y": 72.0
                            },
                        ]
                    },
                    "inferText": "근로계약서",
                    "inferConfidence": 0.9998,
                    "type": "NORMAL",
                    "lineBreak": true
                }
            ]
        }
    """

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
        "images": [{
            "format": 'PNG',
            "data": image,
            "name": "ocr-sample",
            "url": None
        }],
        "enableTableDetection": False
    }

    response = requests.post(
        CLOVA_API_URL, headers=request_headers, data=json.dumps(request_data))
    return (response.json())["images"][0]


def convert_token_to_line(data):
    """
    인식된 token들을 라인 단위로 조합

    Args:
        data (list): 이미지별 OCR한 결과의 리스트

    Returns:
        list: 라인별로 자른 결과
            content: 라인 내의 텍스트 내용
            box: 해당 라인을 구성하는 박스
        example: [{
            "content": "",
            "box": {
                "ltx": int,
                "lty": int,
                "rbx": int,
                "rby": int,
                "page": int
            }
        }]
    """
    line_list = []
    f = open("./error.json", 'w')
    f.write(json.dumps(data))
    for page_idx in range(0, len(data)):
        token_list = data[page_idx]['fields']

        # 토큰들을 묶어 생성된 1개의 라인
        line: Line = {'content': "",
                      'box': {
                          'ltx': float('inf'), 'lty': float('inf'), 'rbx': float('-inf'), 'rby': float('-inf')
                      },
                      'page': page_idx + 1}

        token_idx = 0  # 현재 인식하고 있는 토큰의 idx
        while token_idx < len(token_list):

            token = token_list[token_idx]
            token_idx = token_idx + 1
            vertices = token['boundingPoly']['vertices']

            # 왼쪽 위의 점은 최소값, 오른쪽 아래 값은 최대값으로 갱신
            # 박스 크기가 토큰들 -> 라인 단위
            for vertex in vertices:
                line["box"]['ltx'] = min(line["box"]['ltx'], vertex['x'])
                line["box"]['lty'] = min(line["box"]['lty'], vertex['y'])
                line["box"]['rbx'] = max(line["box"]['rbx'], vertex['x'])
                line["box"]['rby'] = max(line["box"]['rby'], vertex['y'])

            # 토큰을 현재 라인에 추가
            line['content'] = line['content'] + token['inferText'] + ' '

            # 하나의 라인이 끝나면 result에 현재 line의 결과를 삽입 후
            # 새로운 딕셔너리를 line 삽입
            if token.get('lineBreak'):
                line['content'] = line['content'].strip()
                line_list.append(line)
                line: Line = {'content': "",
                              'box': {
                                  'ltx': float('inf'), 'lty': float('inf'), 'rbx': float('-inf'), 'rby': float('-inf')
                              },
                              'page': page_idx + 1}

    return line_list


def convert_line_to_topic(line_list):
    """
    라인 단위를 조항 단위로 조합 (현재는 정규표현식 사용)

    Args:
        data (list): 라인 리스트

    Returns:
        list: 문단별로 조합한 결과의 리스트
            content: 라인 내의 텍스트 내용
            box: 해당 라인을 구성하는 박스
        example: [{
            "content": "",
            "boxes ": {
                "ltx": int,
                "lty": int,
                "rbx": int,
                "rby": int,
                "page": int
            }
        }]
    """
    # 문단을 구분하는 정규표현식(*제n조*, *N.*)
    # TODO: 정규표현식 조절
    regex = re.compile(r'''
        (
            ^제\d+조             # "제"로 시작하고 숫자와 "조"로 끝나는 패턴 (예: "제1조")
            | ^\d+\.\s           # 숫자로 시작하고 점과 공백으로 끝나는 패턴 (예: "1. ")
            | ^\d+\)             # 숫자로 시작하고 괄호로 끝나는 패턴 (예: "1)")
            | ^\d+\.\d+\.\s      # 숫자와 숫자로 시작하고 점과 공백으로 끝나는 패턴 (예: "1.1. ")
            | ^제\d+항           # "제"로 시작하고 숫자와 "항"으로 끝나는 패턴 (예: "제1항")
        )
    ''', re.VERBOSE)
    topic_list: list[Topic] = []

    # 하나의 문단을 나타내는 딕셔너리
    topic: Topic = {'content': "", 'boxes': []}

    # 라인 별로 문단 구분
    for line in line_list:

        # 지금 라인에 표현이 있으면 topic_list에 붙이고
        # 새로운 topic 딕셔너리 생성
        if regex.match(line['content']):
            topic_list.append(topic)
            topic: Topic = {'content': "", 'boxes': []}

        # 기존 topic 딕셔너리에 문장 및 박스 추가
        topic['content'] = topic['content'] + line['content']
        topic['boxes'].append(line["box"])

    # topic에 데이터가 남아있으면 해당 데이터들을 모아서 문단으로 간주
    if topic['content']:
        topic_list.append(topic)

    return topic_list


def correct_text(content: str):
    """
    문자열에 대해 오인식된 단어들 보정 (OpenAI API 사용)

    Args:
        content (str): 보정할 문자열    

    Returns:
        str: 보정된 문자열
    """
    OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')

    client = OpenAI(api_key=OPENAI_API_KEY)

    chat_completion = client.chat.completions.create(
        messages=[
            {"role": "system", "content": "내가 너에게 특정 텍스트를 줄꺼야. 해당 텍스트는 계약서 내용의 일부인데 기존 종이로 작성된 계약서를 OCR한 결과라 오타가 부분적으로 있어. 너가 오타라고 생각되는 부분을 최대한 수정해서 나에게 반환해줘. 다른 정보는 필요없고 수정본만 나에게 주면 되."},
            {"role": "user", "content": content}],
        model="gpt-4o",
    )
    return chat_completion.choices[0].message.content


def check_toxic(topic):
    '''
    TODO: 계약 내용 내 위험 조항 분석
    '''
    topic["content"] = "분석 결과 텍스트"
    topic["type"] = TopicType.DANGER.value
    return topic


# 계약 내용 내 위험 조항 분석
# 사용자의 질문에 대응하는 VectorDB에 저장된 데이터를 검색하는 로직
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
                            event_data = json.loads(
                                decoded_line[len("data:"):])
                            message_content = event_data.get(
                                "message", {}).get("content", "")
                            if len(message_content) > len(longest_line):
                                longest_line = message_content
                final_answer = longest_line
            elif response_type == "single":
                final_answer = r.json()
            return final_answer

# 임베딩 API


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
            # If using Service App, change 'testapp' to 'serviceapp', and corresponding app id.
            "/serviceapp/v1/api-tools/embedding/clir-emb-dolphin/04a99dcfc692405a886acf158e78c7c1",
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
            error_message = res.get("status", {}).get(
                "message", "Unknown error")
            raise ValueError(f"오류 발생: {error_code}: {error_message}")

# 사용자 쿼리를 임베딩


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

# 답변 생성 함수


def html_chat(realquery: str) -> str:
    # 사용자 쿼리 벡터화
    query_vector = query_embed(realquery)

    # Milvus의 collection 로딩하기
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
        reference.append(
            {"distance": distance, "source": source, "text": text})

    completion_executor = CompletionExecutor(
        host="https://clovastudio.stream.ntruss.com",
        api_key='-',
        api_key_primary_val='-',
        request_id='-'
    )

    preset_texts = [
        {
            "role": "system",
            "content": "- 너의 역할은 사용자의 질문에 reference를 바탕으로 답변하는거야. \n- 너가 가지고있는 지식은 모두 배제하고, 주어진 reference의 내용을 기반으로 답변해야해. 사용자의 질문은 어떤 계약서의 조항이야. 답변은 반드시 다음의 규칙을 지켜서 답변해야해. 1. 첫번째 줄에는 사용자가 준 계약서의 조항을 '위험', '주의', '안전'으로 분류해서 '위험', '주의', '안전'이라는 단어 중 하나만 적어. 2. 두번째 줄에는 그렇게 분류한 이유를 반드시 50자 이하로 작성해."
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
    # pass
    response = html_chat(topic["content"])
    lines = response.splitlines()
    clauses_type = lines[0]
    explanation = '\n'.join(lines[1:])

    # todo: clauses_type에 '안전', '주의', '위험'이 들어오면 안전, 주의, 위험으로 바꾸기
    if clauses_type == "'안전'":
        clauses_type = "안전"
    elif clauses_type == "'주의'":
        clauses_type = "주의"
    elif clauses_type == "'위험'":
        clauses_type = "위험"

    # todo: clauses_type에 안전, 주의, 위험 중 하나가 아닌 다른 string이 있는 경우,
    if clauses_type not in ["안전", "주의", "위험"]:
        clauses_type = "주의"

    return {
        "type": clauses_type,
        "content": topic["content"],
        "result": explanation,
        "boxes": topic["boxes"],
        "confidence_score": 0.9
    }
