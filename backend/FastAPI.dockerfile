# 베이스 이미지로 Python 3.11 사용
FROM python:3.11.9

# 컨테이너가 외부와 통신할 때 사용할 포트로 3001 지정
EXPOSE 5501

# 작업 디렉토리 설정
WORKDIR /fastapi

# requirements.txt 파일에 지정된 모든 패키지를 설치
COPY ./fastapi/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# 전체 소스 코드 복사
COPY ./fastapi /fastapi

# FastAPI 애플리케이션 실행
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "5501"]
