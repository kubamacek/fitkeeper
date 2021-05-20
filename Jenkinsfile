def cleanupDocker(){
    sh """
        docker stop \$(docker ps -a -q) && docker rm \$(docker ps -a -q) && docker rmi \$(docker images -q -f dangling=true)
    """
}

pipeline {
    agent any
    stages {
        stage('parallel CI') {
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
        stage ('deploy backend to heroku') {
            when {
                environment name: 'GIT_BRANCH', value: 'origin/main'
            }
            steps {
                sh """
                echo "data" > .dockerignore
                docker build -f Dockerfile-backend-deploy --build-arg HEROKU_API_KEY=${HEROKU_API_KEY} .
                """
            }
        }
        stage ('deploy frontend to netlify') {
            when {
                environment name: 'GIT_BRANCH', value: 'origin/main'
            }
            steps {
                sh """
                docker build -f Dockerfile-frontend-deploy --build-arg NETLIFY_AUTH_TOKEN=${NETLIFY_AUTH_TOKEN} --build-arg NETLIFY_SITE_ID=${NETLIFY_SITE_ID} .
                """
            }
        }
    }
    post {
        always {
            cleanWs()
            cleanupDocker()
        }
    }
}
