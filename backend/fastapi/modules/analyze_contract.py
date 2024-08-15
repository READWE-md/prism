import os
import requests
import re
from openai import OpenAI
import json
from modules.store_contract_document import store_contract_document
from modules.store_contract_meta import store_contract_meta
from modules.update_contract_state import update_contract_state
import subprocess
from langchain_community.document_loaders import UnstructuredHTMLLoader
from pathlib import Path
import base64
import http.client
from tqdm import tqdm
import time
from pymilvus import connections, FieldSchema, CollectionSchema, DataType, Collection, utility
from typing_extensions import Annotated, NotRequired, TypedDict, List, Any
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
    type:  str  # 문단의 위험도 타입 (safe, caution, danger)
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


def fileLogger(file_name: str, content: str) -> None:
    f = open("./" + file_name, 'w')
    f.write(content)


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
    try:
        f = open("./status.json", 'w')
        f.write("")
        update_contract_state(contract_id, "ANALYZE_INIT")
        # MongoDB에 저장될 document
        contract_document: ContractDocument = {
            '_id': contract_id, 'clauses': []}

        # 계약서 이미지들을 토큰화
        # *Clova OCR은 한번에 1장만 받음
        update_contract_state(contract_id, "ANALYZE_OCR_START")
        image_token_list = []
        for image in contract_raw.images:
            image_token_list.append(convert_images_to_token(image))
        update_contract_state(contract_id, "ANALYZE_OCR_DONE")
        # Clova 로컬 테스트 코드
        # f = open("clova-test3.json", 'r')
        # image_token_list = json.load(f)['images']

        # 토큰 라인화
        update_contract_state(contract_id, "ANALYZE_TOKENIZE_START")
        line_list: list[Line] = convert_token_to_line(image_token_list)
        update_contract_state(contract_id, "ANALYZE_TOKENIZE_DONE")

        # 라인 문단화
        update_contract_state(contract_id, "ANALYZE_LINE_TO_TOPIC_START")
        topic_list: list[Topic] = convert_line_to_topic(line_list)
        update_contract_state(contract_id, "ANALYZE_LINE_TO_TOPIC_END")

        # 문단 오인식 보정
        # update_contract_state(contract_id, "ANALYZE_CORRECTION_START")
        # for topic_idx in range(0, len(topic_list)):
        #     topic_list[topic_idx]["content"] = correct_text(
        #         topic_list[topic_idx]["content"])
        #     print(topic_list[topic_idx]["content"])
        # update_contract_state(contract_id, "ANALYZE_CORRECTION_END")

        # 문단 단위 조항 탐지
        update_contract_state(contract_id, "ANALYZE_CHECK_START")
        analyze_result_list: list[Topic] = check_toxic(topic_list)
        # for check_idx in range(0, len(topic_list)):
        #     analyze_result_list.append(check_toxic(topic_list[check_idx]))
        contract_document["clauses"].extend(analyze_result_list)
        update_contract_state(contract_id, "ANALYZE_CHECK_END")

        store_contract_document(contract_document)
        full_contract_text = ""

        update_contract_state(contract_id, "TAG_GEN_START")
        for topic in contract_document["clauses"]:
            full_contract_text = full_contract_text + " " + topic["content"]
        tag_list = generate_tag_list(full_contract_text)
        store_contract_meta(contract_id, tag_list)
        update_contract_state(contract_id, "TAG_GEN_END")
        update_contract_state(contract_id, "DONE")
    except:
        import traceback
        f = open("./error.json", 'w')
        f.write(json.dumps(traceback.format_exc()))
        update_contract_state(contract_id, "FAIL")


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
            "format": 'jpeg',
            "data": image,
            "name": "ocr-sample",
            "url": None
        }],
        "enableTableDetection": False
    }

    response = requests.post(
        CLOVA_API_URL, headers=request_headers, data=json.dumps(request_data))
    try:
        fileLogger("ocr-result.json",
                   json.dumps(response.json(), ensure_ascii=False))
    except:
        print("OCR")
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

    for page_idx in range(0, len(data)):
        token_list = data[page_idx]['fields']

        # 토큰들을 묶어 생성된 1개의 라인
        line: Line = {'content': "",
                      'box': {
                          'ltx': float('inf'), 'lty': float('inf'), 'rbx': float('-inf'), 'rby': float('-inf'), 'page': page_idx + 1
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
                                  'ltx': float('inf'), 'lty': float('inf'), 'rbx': float('-inf'), 'rby': float('-inf'), 'page': page_idx + 1
                              }
                              }

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

    # 조항 시작과 주요 정보를 나타내는 정규 표현식 패턴
    regex = re.compile(r'''
        (
            ^\s*제\s*\d+\s*조[\s\n]*             # "제"로 시작하고 숫자와 "조"로 끝나는 패턴 (예: "제 1 조")
            | ^\s*\d+\.\s*[\s\n]*               # 숫자로 시작하고 점 뒤에 공백/개행이 있거나 없는 패턴 (예: "1." 또는 "1. ")
            | ^\s*\d+\)\s*[\s\n]*               # 숫자로 시작하고 괄호 뒤에 공백/개행이 있거나 없는 패턴 (예: "1)" 또는 "1) ")
            | ^\s*\d+\.\d+\.\s*[\s\n]*          # 숫자.숫자. 형식으로 시작하고 점 뒤에 공백/개행이 있거나 없는 패턴 (예: "1. 1." 또는 "1.1. ")
            | ^\s*제\s*\d+\s*항[\s\n]*          # "제"로 시작하고 숫자와 "항"으로 끝나는 패턴 (예: "제 1 항")
            | ^\s*\(\s*\d+\s*\)\s*[\s\n]*       # 괄호 안에 숫자가 있으며, 뒤에 공백/개행이 있거나 없는 패턴 (예: "( 1 )" 또는 "(1)")
            | ^[\s\n]*-\s*[^\n]*[\s\n]*         # 공백/개행으로 시작하고 '-'로 시작하는 줄 (예: " - 내용")
            | ^\s*특약사항[\s\n]*              # "특약사항" 문자로 시작하는 패턴
            | \s*성명\s*:\s*                   # "성명 :" 문자열
            | \s*주민등록번호\s*:\s*           # "주민등록번호 :" 문자열
            | \s*주소\s*:\s*                   # "주소 :" 문자열
            | \s*전화번호\s*:\s*               # "전화번호 :" 문자열
            | ^\s*[가-하]\.\s*[\s\n]*          # 한글로 시작하고 점 뒤에 공백/개행이 있거나 없는 패턴 (예: "가. " 또는 "가 . ")
            | ^\s*[①-⑳]\s*[\s\n]*             # 동그라미로 숫자를 감싼 특수문자 (예: "①", "②" ... "⑳")
            | ^\s*[➀-➊]\s*[\s\n]*             # 동그라미로 숫자를 감싼 다른 특수문자 (예: "➀", "➁" ... "➊")
            | ^\s*[⒈-⒛]\s*[\s\n]*             # 원으로 숫자를 감싼 특수문자 (예: "⒈", "⒉" ... "⒛")
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

    # 3자 미만의 무의미한 구문 삭제
    filtered_topic_list = []
    for topic in topic_list:
        if len(topic["content"]) <= 3:
            continue
        filtered_topic_list.append(topic)

    return filtered_topic_list


# def convert_line_to_topic(line_list):
#     """
#     라인 단위를 조항 단위로 조합 (OpenAI API)

#     Args:
#         data (list): 라인 리스트

#     Returns:
#         list: 문단별로 조합한 결과의 리스트
#             content: 라인 내의 텍스트 내용
#             box: 해당 라인을 구성하는 박스
#         example: [{
#             "content": "",
#             "boxes ": [{
#                 "ltx": int,
#                 "lty": int,
#                 "rbx": int,
#                 "rby": int,
#                 "page": int
#             }]
#         }]
#     """
#     OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')

#     client = OpenAI(api_key=OPENAI_API_KEY)

#     chat_completion = client.chat.completions.create(
#         messages=[
#         {"role": "system",
#             "content": """내가 너에게 list 형식의 데이터를 줄꺼야. list의 각 데이터는 계약서 내 하나의 라인을 의미해. content는 해당 라인의 텍스트이고 box는 해당 라인이 존재하는 페이지와 위치 정보야. 너가 할 일은 해당 데이터를 너가 판단했을때 하나의 조항이나 문장과 같이 나누는 단위라고 판단되는 애들끼리 텍스트를 붙여서 하나의 문자열로 만들어줘. 전체적인 문맥은 맞춰서 잘라줘. 예를 들면, 어떤 문장에 붙어있는 정보들은 하나로 모아야해. 이때, box는 같은 문단끼리 boxes라는 box의 집합으로 묶여야해. 반환값은 [{
#             "content": "",
#             "boxes ": [{
#                 "ltx": int,
#                 "lty": int,
#                 "rbx": int,
#                 "rby": int,
#                 "page": int
#             }]
#         }]과 같은 형식이고  ```json과 같은 쓸모없는 문자들은 생략하고 순수하게 json 문자열만 출력해줘"""},
#         {"role": "user", "content": json.dumps(line_list)}],
#         model="gpt-4o",
#     )
#     print(chat_completion.choices[0].message.content)
#     temp_topic_list = json.loads(chat_completion.choices[0].message.content)

#     # 10자 미만의 무의미한 구문 삭제
#     topic_list = []
#     for topic in temp_topic_list:
#         if len(topic["content"]) <= 10:
#             continue
#         topic_list.append(topic)

#     return topic_list

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
            {"role": "system", "content": "내가 너에게 특정 텍스트를 줄꺼야. 해당 텍스트는 계약서 내용의 일부인데 기존 종이로 작성된 계약서를 OCR한 결과라 오타가 부분적으로 있어. 너가 오타라고 생각되는 부분을 최대한 수정해서 나에게 반환해줘. 다른 정보는 절대 말하지 말고 수정본만 딱 말해서 나에게 주면 되. 오타가 없거나 내용이 없으면 내가 준 내용을 그대로 반환해줘."},
            {"role": "user", "content": content}],
        model="gpt-4o",
    )
    return chat_completion.choices[0].message.content


def generate_tag_list(text) -> list[str]:
    """
    계약서 내 태그 생성 (OpenAI API 사용)

    Args:
        text (str): 태그를 가져올 계약서 텍스트

    Returns:
        list[str]: 태그의 list
    """
    tag_list = []
    OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')

    client = OpenAI(api_key=OPENAI_API_KEY)

    chat_completion = client.chat.completions.create(
        messages=[
            {"role": "system",
                "content": '내가 지금 계약서 내용의 일부를 줄꺼야. 너는 여기서 계약서의 종류, 계약서 산업군, 계약하는 당사자에 대해서 추출해주면 되. 만약 해당하는 내용이 계약서 상에서 언급되지 않거나 샘플처럼 처리되어 있으면 억지로 넣지 말고 "-"이라는 문자열로 던져줘. 반환 형식은 {"tags": ["계약서의 종류", "계약의 산업군", "계약 당사자1", "계약 당사자2", "계약 시작일", "계약 종료일"]}의 순수한 문자열 "```json"와 같은 것들은 모두 빼고 형식으로 줘. 계약 시작일과 종료일은 (yyyy-mm-dd)의 형식으로 주면 좋겠어. 계약서의 종류, 산업군, 당사자들은 각각 10자 정도로 제한해서 알려줘.'},
            {"role": "user", "content": text}],
        model="gpt-4o",
    )
    print(chat_completion.choices[0].message.content)
    tag_list = json.loads(chat_completion.choices[0].message.content)["tags"]
    return tag_list


def check_toxic_test(topic):
    '''
    TODO: 계약 내용 내 위험 조항 분석
    '''
    topic["result"] = "분석 결과 텍스트"
    topic["type"] = TopicType.DANGER.value
    return topic


# 계약 내용 내 위험 조항 분석
# 사용자의 질문에 대응하는 VectorDB에 저장된 데이터를 검색하는 로직
class CompletionExecutor:
    def __init__(self, api_key, model="gpt-4o"):
        self.api_key = api_key
        self.model = model

    def execute(self, completion_request):

        client = OpenAI(api_key=self.api_key)
        chat_completion = client.chat.completions.create(
            messages=completion_request["messages"],
            model=self.model
        )
        return chat_completion.choices[0].message.content


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
            "/serviceapp/v1/api-tools/embedding/clir-emb-dolphin/c48616449e904651b81ae95c005ad910",
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
    EMB_API_KEY = os.getenv('EMB_API_KEY')
    EMB_PRI_VAL = os.getenv('EMB_PRI_VAL')
    EMB_REQ_ID = os.getenv('EMB_REQ_ID')

    embedding_executor = EmbeddingExecutor(
        host="clovastudio.apigw.ntruss.com",
        api_key=EMB_API_KEY,
        api_key_primary_val=EMB_PRI_VAL,
        request_id=EMB_REQ_ID
    )
    request_data = {"text": text}
    response_data = None
    try:
        response_data = embedding_executor.execute(request_data)
    except ValueError as e:
        pass
    return response_data


# 답변 생성 함수
def html_chat(realquery: str, context: str) -> str:
    # 사용자 쿼리 벡터화
    query_vector = query_embed("\n".join([context, realquery]))

    if query_vector is None:
        return ""

    # Milvus의 collection 로딩하기
    connections.connect("default", host="172.20.0.5", port="19530")
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

    COM_API_KEY = os.getenv('OPEN_API_KEY')

    completion_executor = CompletionExecutor(
        api_key=COM_API_KEY
    )

    preset_texts = [
        {
            "role": "system",
            "content": "- 첫째, 사용자가 제시한 텍스트는 계약서 내용의 일부라는 점에 유의해서 오타라고 판단되는 단어나 문장을 수정해라. \n- 둘째, 사용자가 제시한 텍스트에 reference를 바탕으로 답변해. 너가 가지고 있는 지식은 모두 배제하고, 주어진 reference의 내용을 기반으로 답변해. \n- 셋째, 답변은 반드시 '답변규칙1'과 '답변규칙2'를 지켜서 답변해야 해. 넷째, 사용자가 제시한 텍스트에 주어진 context를 기반으로 문맥을 파악해서 답변해. \n 다섯번째, 계약서 문서상 너는 갑과 을이 있다면 을의 입장에서 의견을 작성해야해. 예를 들면, 집주인과 세입자면 세입자고 보험사와 피보험자가 있다면 피보험자고 본인이라는 단어가 나오면 그 '본인'의 입장에서 생각해야해. \n- 답변규칙1: 첫번째 줄에는 사용자가 준 계약서의 조항을 '위험', '주의', '안전'으로 분류해서 'safe', 'caution', 'danger'이라는 단어 중 하나만 적어.\n- 답변규칙2: 두번째 줄에는 그렇게 분류한 이유를 반드시 50자 이하로 작성해. 만약 '위험'조항이라면 계약서의 조항으로 인해 발생할 수 있는 피해 사례 예시를 함께 들어줘."
        }
    ]

    for ref in reference:
        preset_texts.append(
            {
                "role": "system",
                "content": f"reference: {ref['text']}, url: {ref['source']}, context: {context}"
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


def check_toxic(topic: List[Topic]) -> List[Any]:
    result: List[Any] = []
    window: List[Topic] = []
    context_size: int = 5

    for idx in range(0, len(topic)):
        if not topic[idx].get("content") or topic[idx]["content"].strip() == "":
            result.append({
                "type": "topic error",
                "content": topic[idx]["content"],
                "result": "topic error",
                "boxes": topic[idx]["boxes"],
                "confidence_score": 0.9
            })
            continue
        
        if (idx >= context_size):
            window.pop(0)
        
        # topic["content"]가 빈칸이면 예외 처리

        context = "\n".join([t for t in window])

        print(topic[idx]["content"])
        response = html_chat(topic[idx]["content"], context)
        print("llm응답 response: " + response)

        window.append(topic[idx]["content"])

        # 응답이 null이거나 빈 문자열이거나 줄바꿈만 있는 경우 예외 처리
        if not response or response.strip() == "":
            result.append({
                "type": "request error",
                "content": topic[idx]["content"],
                "result": "분석에 실패하였습니다1",
                "boxes": topic[idx]["boxes"],
                "confidence_score": 0.9
            })
            continue

        lines = response.splitlines()
        print(lines)

        if not lines:
            result.append({
                "type": "request error",
                "content": topic[idx]["content"],
                "result": "분석에 실패하였습니다2",
                "boxes": topic[idx]["boxes"],
                "confidence_score": 0.9
            })
            continue

        clauses_type = lines[0].strip()
        explanation = '\n'.join(lines[1:]).strip()

        # clauses_type에 '안전', '주의', '위험'이 들어오면 안전, 주의, 위험으로 바꾸기
        if clauses_type == "'safe'":
            clauses_type = "safe"
        elif clauses_type == "'caution'":
            clauses_type = "caution"
        elif clauses_type == "'danger'":
            clauses_type = "danger"

        # clauses_type에 안전, 주의, 위험 중 하나가 아닌 다른 string이 있는 경우,
        if clauses_type not in ["safe", "caution", "danger"]:
            clauses_type = "safe"

        result.append({
            "type": clauses_type,
            "content": topic[idx]["content"],
            "result": explanation,
            "boxes": topic[idx]["boxes"],
            "confidence_score": 0.9
        })

    return result
