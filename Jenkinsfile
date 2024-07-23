pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                echo 'Building...'
                sh 'chmod +x ./backend/gimisangung/gradlew'
                sh './backend/gimisangung/gradlew init'
                sh './backend/gimisangung/gradlew build'
            }
        }
    }

    post {
        always {
            echo 'Cleaning up...'
        }
        success {
            echo 'Build succeeded!'
        }
        failure {
            echo 'Build failed!'
        }
    }
}
