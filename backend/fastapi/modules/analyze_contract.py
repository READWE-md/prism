import os
import requests
import re
from openai import OpenAI
import json
from modules.store_contract_document import store_contract_document

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

# TODO: 계약 내용 내 위험 조항 분석


def check_toxic(topic):
    return {
        "type": "caution",
        "content": topic["content"],
        "result": "RESULT",
        "boxes": topic["boxes"],
        "confidence_score": 0.9
    }
