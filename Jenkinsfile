pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                echo 'Building...'
                // 실제 빌드 명령어를 여기에 추가
                // sh 'make build' 같은 명령어를 사용할 수 있음
            }
        }
        stage('Test') {
            steps {
                echo 'Testing...'
                // 실제 테스트 명령어를 여기에 추가
                // sh 'make test' 같은 명령어를 사용할 수 있음
            }
        }
    }

    post {
        always {
            echo 'Cleaning up...'
            // 빌드 후 정리 작업을 여기에 추가
        }
        success {
            echo 'Build succeeded!'
        }
        failure {
            echo 'Build failed!'
        }
    }
}
