pipeline {
    agent {
        docker {
            image 'gradle:latest'
            args '-v $PWD:/home/gradle/project -w /home/gradle/project'
        }
    }

    stages {
        stage('Build') {
            steps {
                sh 'gradle init'
                sh 'gradle build'
            }
        }
        stage('Test') {
            steps {
                sh 'gradle test'
            }
        }
    }

    post {
        always {
            sh 'gradle clean'
        }
        success {
            echo 'Build succeeded!'
        }
        failure {
            echo 'Build failed!'
        }
    }
}
