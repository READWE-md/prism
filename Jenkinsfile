pipeline {
    agent any
    stages {
        stage('Example') {
            steps {
<<<<<<< HEAD
                echo 'Hello World'
            }
        }
    }
    post { 
        always { 
            echo 'I will always say Hello again!'
=======
                echo 'Building...'
                sh 'chmod +x ./backend/gimisangung/gradlew'
                sh './backend/gimisangung/gradlew init'
                sh './backend/gimisangung/gradlew clean build'
            }
        }
        stage('Test') {
            steps {
                echo 'Testing...'
                sh 'chmod +x ./backend/gimisangung/gradlew'
                sh './backend/gimisangung/gradlew test'
            }
        }
    }

    post {
        always {
            echo 'Cleaning up...'
            sh './backend/gimisangung/gradlew clean'
        }
        success {
            echo 'Build succeeded!'
        }
        failure {
            echo 'Build failed!'
>>>>>>> 59a439a (feat: 젠킨스파일 업데이트)
        }
    }
}
