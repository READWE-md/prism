import os
import requests
import re
from openai import OpenAI
import json
from modules.store_contract_document import store_contract_document


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
    contract_document = {
        "_id": contract_id,
        "clauses": []
    }

    # 계약서 이미지들을 토큰화
    # *Clova OCR은 한번에 1장만 받음
    image_token_list = []
    for image in contract_raw.images:
        image_token_list.append(convert_images_to_token(image))

    '''
    # Clova 로컬 테스트 코드
    f = open("clova-sample.json", 'r')
    image_token_list = json.load(f)['images']
    '''
    # 토큰 라인화
    line_list = convert_token_to_line(image_token_list)

    # 라인 문단화
    topic_list = convert_line_to_topic(line_list)

    # 문단 오인식 보정
    for topic_idx in range(0, len(topic_list)):
        topic_list[topic_idx]["content"] = correct_text(
            topic_list[topic_idx]["content"])
        print(topic_list[topic_idx]["content"])

    # 문단 단위 조항 탐지
    analyze_result_list = []
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
        line = {
            "content": "",
            "box": {
                "ltx": float('inf'),
                "lty": float('inf'),
                "rbx": float('-inf'),
                "rby": float('-inf'),
                "page": page_idx + 1
            }
        }

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
                line = {
                    "content": "",
                    "box": {
                        "ltx": float('inf'),
                        "lty": float('inf'),
                        "rbx": float('-inf'),
                        "rby": float('-inf'),
                        "page": page_idx + 1
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
    # 문단을 구분하는 정규표현식(제n조, N.)
    # TODO: 정규표현식 조절
    regex = re.compile(r'.*(제\d+조|\d+\.).*')
    topic_list = []

    # 하나의 문단을 나타내는 딕셔너리
    topic = {
        "content": "",
        "boxes": [],
    }

    # 라인 별로 문단 구분
    for line in line_list:
        # 지금 라인에 표현이 있으면 topic_list에 붙이고
        # 새로운 topic 딕셔너리 생성
        if regex.match(line['content']):
            topic_list.append(topic)
            topic = {
                "content": "",
                "boxes": [],
            }
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
    return {
        "type": "caution",
        "content": topic["content"],
        "result": "RESULT",
        "boxes": topic["boxes"],
        "confidence_score": 0.9
    }
