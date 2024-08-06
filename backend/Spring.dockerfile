# 베이스 이미지
FROM ubuntu:20.04

# 컨테이너가 외부와 통신할 때 사용할 포트로 8080 지정
EXPOSE 5500

#필수 패키지 설치 및 자바 21 설치
RUN apt-get update && apt-get install -y findutils && apt-get install -y openjdk-21-jdk

# 작업 디렉토리 설정
WORKDIR /gimisangung

# 전체 소스 코드 복사
COPY ./gimisangung /gimisangung

# 컨테이너가 시작될 때, 실행할 명령어 설정
RUN chmod +x /gimisangung/init.sh
CMD ["./init.sh"]
