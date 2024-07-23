pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
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
        }
    }
}
