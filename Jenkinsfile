pipeline {

    stages {
        stage('Build') {
            steps {
                sh 'gradle init'
                sh 'gradle build'
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
