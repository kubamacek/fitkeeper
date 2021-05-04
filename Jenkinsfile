def cleanupDocker(){
    sh """
        docker stop \$(docker ps -a -q) && docker rm \$(docker ps -a -q) && docker rmi \$(docker images -q -f dangling=true)
    """
}

pipeline {
    agent any
    stages {
        stage('static backend code analysis') {
            steps {
                sh """
                docker build -f backend/Dockerfile-static-backend-analysis backend/
                """
            }
        }
        stage('backend + postgresql test') {
            steps {
                sh """
                docker-compose -f docker-compose-backend-test.yml up --build --exit-code-from web
                """
            }
        }
        stage('static frontend code analysis') {
            steps {
                sh """
                docker build -f frontendapp/Dockerfile-static-frontend-analysis frontendapp/
                """
            }
        }
        stage('frontend test') {
            steps {
                sh """
                docker build -f frontendapp/Dockerfile-frontend-test frontendapp/
                """
            }
        }
        /*
        PARALLEL OPTION

        stage('run CI tests') {
            parallel {
                stage('static backend code analysis') {
                    steps {
                        sh """
                        docker build -f backend/Dockerfile-static-backend-analysis backend/
                        """
                    }
                }
                stage('backend + postgresql test') {
                    steps {
                        sh """
                        docker-compose -f docker-compose-backend-test.yml up --build --exit-code-from web
                        """
                    }
                }
                stage('static frontend code analysis') {
                    steps {
                        sh """
                        docker build -f frontendapp/Dockerfile-static-frontend-analysis frontendapp/
                        """
                    }
                }
                stage('frontend test') {
                    steps {
                        sh """
                        docker build -f frontendapp/Dockerfile-frontend-test frontendapp/
                        """
                    }
                }
            }
        }
        */
    }
    post {
        always {
            cleanWs()
            cleanupDocker()
        }
    }
}
