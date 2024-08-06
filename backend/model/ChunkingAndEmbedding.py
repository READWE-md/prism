import json
import os
import subprocess
from pathlib import Path
import http.client
from tqdm import tqdm
from langchain_community.document_loaders import UnstructuredHTMLLoader
from pymilvus import connections, FieldSchema, CollectionSchema, DataType, Collection, utility

#####chunking######
#Clova Studio 분할 서비스에 api요청을 처리하기 위해 사용
class SegmentationExecutor:
    def __init__(self, host, api_key, api_key_primary_val, request_id):
        self._host = host #api 호스트 url
        self._api_key = api_key 
        self._api_key_primary_val = api_key_primary_val
        self._request_id = request_id

    #api요청을 전송하고 응답을 받아오는 내부 메소드
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
            "/serviceapp/v1/api-tools/segmentation/837c69a2192845aabd8c89c80363afe0", # If using Service App, change 'testapp' to 'serviceapp', and corresponding app id.
            json.dumps(completion_request),
            headers
        )
        response = conn.getresponse()
        result = json.loads(response.read().decode(encoding="utf-8"))
        conn.close()
        return result

    #분할 api를 실행하고 결과를 반환
    def execute(self, completion_request):
        res = self._send_request(completion_request)
        if res["status"]["code"] == "20000":
            return res["result"]["topicSeg"]
        else:
            raise ValueError(f"{res}")

##### html 파일 처리 #####
def download_html_files(urls, folder_path):
    url_to_filename_map = {}
    
    if not os.path.exists(folder_path):
        os.makedirs(folder_path)
    
    for url in urls:
        filename = url.split("/")[-1] + ".html"
        file_path = os.path.join(folder_path, filename)
        subprocess.run(["curl", "-A", "Mozilla/5.0", "-o", file_path, url], check=True)
        url_to_filename_map[url] = filename
    
    with open("url_to_filename_map.json", "w") as map_file:
        json.dump(url_to_filename_map, map_file)

def load_html_files(html_files_dir):
    html_files = list(html_files_dir.glob("*.html"))
    htmlDatas = []
    
    for html_file in html_files:
        loader = UnstructuredHTMLLoader(str(html_file))
        document_data = loader.load()
        htmlDatas.append(document_data)
        print(f"Processed {html_file}")
    
    return htmlDatas

def update_document_sources(htmlDatas):
    with open("url_to_filename_map.json", "r") as map_file:
        url_to_filename_map = json.load(map_file)
    
    filename_to_url_map = {v: k for k, v in url_to_filename_map.items()}
    print(filename_to_url_map)
    print(htmlDatas)
    
    for doc_list in htmlDatas:
        for doc in doc_list:
            extracted_filename = doc.metadata["source"].split("\\")[-1]
            print(extracted_filename)
            if extracted_filename in filename_to_url_map:
                doc.metadata["source"] = filename_to_url_map[extracted_filename]
            else:
                print(f"Warning: {extracted_filename}에 해당하는 URL을 찾을 수 없습니다.")
    
    return [item for sublist in htmlDatas for item in sublist]

#####main 코드: 텍스트 데이터를 분할 api에 보내고 결과를 처리#####
def main():
    with open("sourceURL.txt", "r") as file:
        urls = [url.strip() for url in file.readlines()]
    
    folder_path = "htmlFolder"
    download_html_files(urls, folder_path)
    
    html_files_dir = Path(folder_path)
    htmlDatas = load_html_files(html_files_dir)
    htmlDatas_flattened = update_document_sources(htmlDatas)

    segmentation_executor = SegmentationExecutor(
        host="clovastudio.stream.ntruss.com",
        api_key='-',
        api_key_primary_val='-',
        request_id='-'
    )

    chunked_html = []

    for htmldata in tqdm(htmlDatas_flattened):
        try:
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
            
            response_data = segmentation_executor.execute(request_data)
            result_data = [' '.join(segment) for segment in response_data]
 
        except json.JSONDecodeError as e:
            print(f"JSON decoding failed: {e}")
        except Exception as e:
            print(f"An error occurred: {e}")

        for paragraph in result_data:
            chunked_document = {
                "source": htmldata.metadata["source"],
                "text": paragraph
            }
            chunked_html.append(chunked_document)

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

    #임베딩 벡터의 차원을 저장할 빈 집합을 초기화
    dimension_set = set()

    for item in chunked_html:
        if "embedding" in item:
            dimension = len(item["embedding"]) #embedding키의 값을 가져와 길이를 측정. 해당 길이는 임베딩 벡터의 차원을 의미
            dimension_set.add(dimension) #측정된 차원을 집합에 추가. 집합이므로 이미 존재하는 차원은 추가하지 않음
    
    print("임베딩된 벡터들의 차원:", dimension_set)

    ###########Milvus에 데이터 삽입 및 인덱스 생성##########
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

    collection.create_index(field_name="embedding", index_params=index_params)
    utility.index_building_progress("html_rag_test")
    
    print([index.params for index in collection.indexes])

if __name__ == "__main__":
    main()
