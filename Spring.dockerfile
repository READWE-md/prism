# 베이스 이미지로 OpenJDK 21 사용
FROM openjdk:21-jdk

#컨테이너가 외부와 통신할 때 사용할 포트로 8080 지정
EXPOSE 8080

# 작업 디렉토리 설정
WORKDIR /gimisangung

# 전체 소스 코드 복사
COPY /backend/gimisangung /gimisangung

# 의존성 설치 (예: Gradle 또는 Maven 빌드 도구 사용)
# Gradle 사용 시:
COPY /backend/gradlew /backend/gradle /gimisangung/
RUN ./gradlew build

# 빌드 결과물을 실행할 수 있는 디렉토리로 복사 (예: Spring Boot JAR 파일)
# Gradle 사용 시:
COPY /gimisangung/build/libs/*.jar /gimisangung/app.jar

# 컨테이너가 시작될 때, 실행할 명령어 설정
ENTRYPOINT ["java", "-jar", "/gimisangung/app.jar"]