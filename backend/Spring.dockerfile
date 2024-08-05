# 베이스 이미지로 OpenJDK 21 사용
FROM openjdk:21-jdk

#컨테이너가 외부와 통신할 때 사용할 포트로 8080 지정
EXPOSE 8080

# 작업 디렉토리 설정
WORKDIR /gimisangung

# 전체 소스 코드 복사
COPY /backend/gimisangung /gimisangung

# 컨테이너가 시작될 때, 실행할 명령어 설정
ENTRYPOINT ["java", "-jar", "/gimisangung/app.jar"]
