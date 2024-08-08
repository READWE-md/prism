import json
import os
import subprocess
from langchain_community.document_loaders import UnstructuredHTMLLoader
from pathlib import Path
import base64
import http.client
from tqdm import tqdm
import requests
import time
from pymilvus import connections, FieldSchema, CollectionSchema, DataType, Collection, utility

# url과 파일명을 매핑할 딕셔너리 생성
url_to_filename_map = {}

# 읽기모드로 sourceURL.txt 파일 열고, 파일을 읽어와 url 리스트를 생성
with open("sourceURL.txt", "r") as file:
    urls = [url.strip() for url in file.readlines()]

# 다운로드한 html파일을 저장할 폴더 경로 설정
folder_path = "htmlFolder"

# html파일을 저장할 폴더 경로가 없다면 경로에 폴더 생성
if not os.path.exists(folder_path):
    os.makedirs(folder_path)

# url목록을 순회하며 다음의 작업 수행
for url in urls:
    filename = url.split("/")[-1] + ".html" # 파일명 생성
    file_path = os.path.join(folder_path, filename) # 폴더 경로와 파일명을 결합해 전체 경로 생성
    subprocess.run(["curl", "-A", "Mozilla/5.0", "-o", file_path, url], check=True) # curl명령어로 url에서 html파일 다운로드 후 지정경로에 저장
    url_to_filename_map[url] = filename # url과 파일명을 딕셔너리에 저장

# 'url_to_filename_map.json'파일을 쓰기 모드로 열어서 json형태로 딕셔너리를 저장
with open("url_to_filename_map.json", "w") as map_file:
    json.dump(url_to_filename_map, map_file)


# html파일들을 저장해두는 폴더의 경로를 html_files_dir변수에 할당
html_files_dir = Path('htmlFolder')

# html_files_dir 디렉토리 내에 있는 모든 '*.html' 파일을 검색하여 리스트로 저장
html_files = list(html_files_dir.glob("*.html"))

# html파일들의 데이터를 저장할 리스트 초기화
htmlDatas = []

# 검색된 각 html파일에 다음의 작업 수행
for html_file in html_files:
    loader = UnstructuredHTMLLoader(str(html_file)) # UnstructuredHTMLLoader 인스턴스 생성 후 현재 html파일 경로를 문자열 형태로 전달
    document_data = loader.load() # loader인스턴스를 이용해 html파일 내용 로드 후 해당 데이터를 저장
    htmlDatas.append(document_data) # 로드된 html파일의 데이터를 htmlDatas 리스트에 추가
    print(f"Processed {html_file}") # 현재 처리된 html파일의 경로를 출력하여 사용자에게 어떤 파일이 처리되었는지 알림

# utl_to_filename_map.json 파일을 읽기모드로 열고, 파일의 내용을 url_to_filename_map 딕셔너리에 저장
with open("url_to_filename_map.json", "r") as map_file:
    url_to_filename_map = json.load(map_file)

# 딕셔너리의 파일명을 key로, url을 value로 하는 새로운 딕셔너리 filename_to_url_map 생성
filename_to_url_map = {v: k for k, v in url_to_filename_map.items()}
print(filename_to_url_map)
print(htmlDatas)

# htmlDatas 리스트의 각 Document 객체의 'source' 수정
for doc_list in htmlDatas:
    for doc in doc_list:
        extracted_filename = doc.metadata["source"].split("\\")[-1] #'source'메타데이터에서 파일명을 추출. 'source'메타데이터는 파일경로를 포함하고 있는데, 여기서 파일명만 분리
        print(extracted_filename)
        if extracted_filename in filename_to_url_map: # 추출된 파일명이 filename_to_url_map 딕셔너리에 있는지 확인
            doc.metadata["source"] = filename_to_url_map[extracted_filename] # 해당 파일명에 매핑된 url로 'source'메타데이터를 업데이트
        else:
            print(f"Warning: {extracted_filename}에 해당하는 URL을 찾을 수 없습니다.")

# 이중 리스트를 풀어서 하나의 리스트로 만드는 작업
htmlDatas_flattened = [item for sublist in htmlDatas for item in sublist]

#####chunking######
# Clova Studio 분할 서비스에 api요청을 처리하기 위해 사용
class SegmentationExecutor:
    def __init__(self, host, api_key, api_key_primary_val, request_id):
        self._host = host # api 호스트 url
        self._api_key = api_key
        self._api_key_primary_val = api_key_primary_val
        self._request_id = request_id

    # api요청을 전송하고 응답을 받아오는 내부 메소드
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
            "/serviceapp/v1/api-tools/segmentation/88eafcaff1b54df99b573460404cd7f9", # If using Service App, change 'testapp' to 'serviceapp', and corresponding app id.
            json.dumps(completion_request),
            headers
        )
        response = conn.getresponse()
        result = json.loads(response.read().decode(encoding="utf-8"))
        conn.close()
        return result

    # 분할 api를 실행하고 결과를 반환
    def execute(self, completion_request):
        res = self._send_request(completion_request)
        if res["status"]["code"] == "20000":
            return res["result"]["topicSeg"]
        else:
            raise ValueError(f"{res}")

# main코드: 텍스트 데이터를 분할 api에 보내고 결과를 처리
if __name__ == "__main__":
    # Segmentation_executor 객체를 생성
    segmentation_executor = SegmentationExecutor(
        host="clovastudio.stream.ntruss.com",
        api_key='-',
        api_key_primary_val='-',
        request_id='-'
    )

    # 분할된 텍스트 데이터를 'chunked_html'리스트에 저장
    chunked_html = []

    # clovastudiodatas_flattened 리스트에 있는 각 데이터에 대해서 반복작업 수행
    for htmldata in tqdm(htmlDatas_flattened):
        try:
            # request_data를 생성
            request_data = {
                "postProcessMaxSize": 100,
                "alpha": -100,
                "segCnt": -1,
                "postProcessMinSize": -1,
                "text": htmldata.page_content,
                "postProcess": True
            }

            request_json_string = json.dumps(request_data)
            request_data = json.loads(request_json_string, strict=False)

            # execute 메소드를 호출하여 응답을 받음
            response_data = segmentation_executor.execute(request_data)
            result_data = [' '.join(segment) for segment in response_data]

        except json.JSONDecodeError as e:
            print(f"JSON decoding failed: {e}")
        except Exception as e:
            print(f"An error occurred: {e}")

        # 분할된 텍스트 데이터를 'chunked_html'리스트에 저장
        for paragraph in result_data:
            chunked_document = {
                "source": htmldata.metadata["source"],
                "text": paragraph
            }
            chunked_html.append(chunked_document)

# 'chunked_html'리스트의 길이를 출력
print(len(chunked_html))

###########임베딩##########
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
            "/serviceapp/v1/api-tools/embedding/clir-emb-dolphin/c48616449e904651b81ae95c005ad910", # If using Service App, change 'testapp' to 'serviceapp', and corresponding app id.
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

if __name__ == "__main__":
    embedding_executor = EmbeddingExecutor(
        host="clovastudio.apigw.ntruss.com",
        api_key='-',
        api_key_primary_val='-',
        request_id='-'
    )

    cnt=0
    for i, chunked_document in enumerate(tqdm(chunked_html)):
        try:
            request_json = {
                "text": chunked_document['text']
            }
            request_json_string = json.dumps(request_json)
            request_data = json.loads(request_json_string, strict=False)
            response_data = embedding_executor.execute(request_data)
        except ValueError as e:
            print(f"Embedding API Error. {e}")
        except Exception as e:
            print(f"Unexpected error: {e}")

        chunked_document["embedding"] = response_data

# 임베딩 벡터의 차원을 저장할 빈 집합을 초기화
dimension_set = set()

for item in chunked_html:
    if "embedding" in item:
        dimension = len(item["embedding"]) # embedding키의 값을 가져와 길이를 측정. 해당 길이는 임베딩 벡터의 차원을 의미
        dimension_set.add(dimension) # 측정된 차원을 집합에 추가. 집합이므로 이미 존재하는 차원은 추가하지 않음

print("임베딩된 벡터들의 차원:", dimension_set)

connections.connect()

fields = [
    FieldSchema(name="id", dtype=DataType.INT64, is_primary=True, auto_id=True),
    FieldSchema(name="source", dtype=DataType.VARCHAR, max_length=3000),
    FieldSchema(name="text", dtype=DataType.VARCHAR, max_length=9000),
    FieldSchema(name="embedding", dtype=DataType.FLOAT_VECTOR, dim=1024)
]

schema = CollectionSchema(fields, description="html chunk collection for rag test")

collection_name = "html_rag_test"
collection = Collection(name=collection_name, schema=schema, using='default', shards_num=2)

for item in chunked_html:
    source_list = [item['source']]
    text_list = [item['text']]
    embedding_list = [item['embedding']]

    entities = [
        source_list,
        text_list,
        embedding_list
    ]

    insert_result = collection.insert(entities)
    print("데이터 Insertion이 완료된 ID:", insert_result.primary_keys)

print("데이터 Insertion이 전부 완료되었습니다")

index_params = {
    "metric_type": "IP",
    "index_type": "HNSW",
    "params": {
        "M": 8,
        "efConstruction": 200
    }
}

# 컬렉션 네임 넣기
collection = Collection("html_rag_test")
collection.create_index(field_name="embedding", index_params=index_params)
# 컬렉션 네임 넣기
utility.index_building_progress("html_rag_test")

print([index.params for index in collection.indexes])

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

# 사용자의 쿼리를 임베딩하는 함수를 먼저 정의
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

def html_chat(realquery: str) -> str:
    # 사용자 쿼리 벡터화
    query_vector = query_embed(realquery)
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

response = html_chat("제3조(보증의 효력발생 및 보증책임)\n⑦ 보증부대출이 채무자가 당해 사업의 부지매입자금용도로 조달한 차입금, 당해 사업장에 설정된 저당권 등에 의하여 담보된 차입금의 상환에 충당되어도 보증책임을 부담합니다.")
print(response)
