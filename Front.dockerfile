# 베이스 이미지로 node.js와 Alpine 기반의 이미지 사용
FROM node:alpine

# 컨테이너가 외부와 통신할 때 사용할 포트로 3000 지정
EXPOSE 3000

#작업 디렉토리 설정. 이후의 명령어들은 해당 디렉토리 내에서 실행
WORKDIR /frontend

# 호스트 시스템에서 frontend디렉토리 안의 모든 파일과 디렉토리를 컨테이너의 현재 작업 디렉토리(/frontend)로 복사
COPY /frontend/ ./

#애플리케이션을 빌드
RUN npm run build

# npm start 스크립트 실행
CMD ["npm", "run", "dev"]