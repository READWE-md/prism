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

def main():
    with open("sourceURL.txt", "r") as file:
        urls = [url.strip() for url in file.readlines()]
    
    folder_path = "htmlFolder"
    download_html_files(urls, folder_path)
    
    html_files_dir = Path(folder_path)
    htmlDatas = load_html_files(html_files_dir)
    htmlDatas_flattened = update_document_sources(htmlDatas)
    
    print(htmlDatas_flattened)

if __name__ == "__main__":
    main()
