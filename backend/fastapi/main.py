from fastapi import FastAPI, Path, BackgroundTasks
# from typing import Optional
from pydantic import BaseModel
from dotenv import load_dotenv
import os, sys
import requests
import re
from openai import OpenAI
import json

load_dotenv()
app = FastAPI()

class Contract(BaseModel):
    images: list[str] 

# 계약서 내용 총 분석
def analyze_contract(contract_raw):
    contract_document = {}
    for image in contract_raw.images:
        print("[*] START: convert_image_to_token()")
        token_list = convert_image_to_token(image)
        print(token_list)
        print("[*] END: convert_image_to_token()")

        # f = open("./token_list.json", 'r')
        # line = f.read()
        # print(line)
        # f.close()
        # token_list = json.loads(line)
        print("[*] START: convert_token_to_line()")
        line_list = convert_token_to_line(token_list)
        print(line_list)
        print("[*] END: convert_token_to_line()")

        print("[*] START: convert_line_to_topic()")
        topic_list = convert_line_to_topic(line_list)
        print(topic_list)
        print("[*] END: convert_line_to_topic()")
        
        for topic_idx in range(0, len(topic_list)):
            topic = topic_list['clauses'][topic_idx]
            topic_list[topic_idx] = correct_text(topic)
            print(topic_list[topic_idx])
    
    store_data(contract_document)

# 분석이 끝난 계약 내용을 MongoDB에 저장
def store_data(contract_document):
   pass 

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

    response = requests.post(CLOVA_API_URL, headers = 
    request_headers, data = json.dumps(request_data))
    return response.json()
    
# 인식된 token들을 라인 단위로 조합
def convert_token_to_line(data):
    token_list = data['images'][0]['fields']
    result = {"lines": []}

    line = {
        "content": "",
        "box": {
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
            line['box']['ltx'] = min(line['box']['ltx'], vertex['x'])
            line['box']['lty'] = min(line['box']['lty'], vertex['y'])
            line['box']['rbx'] = max(line['box']['rbx'], vertex['x'])
            line['box']['rby'] = max(line['box']['rby'], vertex['y'])

        line['content'] = line['content'] + token['inferText'] + ' '

        if token.get('lineBreak'):
            line['content'] = line['content'].strip()
            result['lines'].append(line)
            line = {
                "content": "",
                "box": {
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
    result = {
        "contractId": 1,
        "clauses": [],
        "images": [
            {
                "page": 1,
                "url": None
            }
        ]
    }
    lines = data['lines']
    clause = {
        "content": "",
        "result": "RESULT 테스트",
        "type": "danger",
        "boxes": [],
        "confidence_score": 0.8
    }

    for line in lines:
        if regex.match(line['content']):
            result['clauses'].append(clause)
            clause = {
                "content": "",
                "result": "RESULT 테스트",
                "type": "danger",
                "boxes": [],
                "confidence_score": 0.8
            }
        clause['content'] += line['content']
        line['box']['page'] = 1
        clause['boxes'].append(line['box'])

    if clause['content']:
        result['clauses'].append(clause)

    return result


# 오인식된 단어들 보정
def correct_text(topic):
    OPEN_API_KEY = os.getenv('OPENAI_API_KEY')
    
    client = OpenAI(
        # This is the default and can be omitted
        api_key = OPEN_API_KEY
    )

    chat_completion = client.chat.completions.create(
        messages = [
            {"role": "system", "content": "내가 너에게 특정 텍스트를 줄꺼야. 해당 텍스트는 계약서 내용의 일부인데 기존 종이로 작성된 계약서를 OCR한 결과라 오타가 부분적으로 있어. 너가 오타라고 생각되는 부분을 최대한 수정해서 나에게 반환해줘. 다른 정보는 필요없고 수정본만 나에게 주면 되."},
            {"role": "user", "content": topic['content']}],
        model = "gpt-4o",
    )
    return chat_completion.choices[0].message.content

# 계약 내용 내 위험 조항 분석
def check_toxic(topic):
    pass

@app.post("/contract/{contract_id}")
def create_contract(contract_id: int, contract_raw: Contract, background_tasks: BackgroundTasks):
    analyze_contract(contract_raw)
    
    # 계약서 분석(백그라운드 처리)
    background_tasks.add_task(analyze_contract, contract_raw)
    
    # MongoDB의 ID값 반환
    return {"_id": contract_id, "message": "Pending"}
