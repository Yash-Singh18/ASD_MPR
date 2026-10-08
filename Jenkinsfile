pipeline {
  agent any

  options {
    disableConcurrentBuilds()
  }

  stages {
    stage('Test backend') {
      steps {
        sh 'docker build --target test -t quickdrop-backend:test backend'
        sh 'docker run --rm quickdrop-backend:test'
      }
    }

    stage('Build images') {
      steps {
        sh 'docker compose build backend frontend'
      }
    }

    stage('Deploy') {
      steps {
        sh 'docker compose up -d db backend frontend'
      }
    }

    stage('Smoke test') {
      steps {
        sh '''
          for i in $(seq 1 30); do
            if curl -fsS http://host.docker.internal:8000/health; then exit 0; fi
            sleep 2
          done
          echo "backend did not become healthy"; exit 1
        '''
        sh 'curl -fsS http://host.docker.internal:8000/products | head -c 200'
        sh 'curl -fsS -o /dev/null http://host.docker.internal:3000/'
      }
    }
  }

  post {
    failure { sh 'docker compose logs --tail=50 || true' }
  }
}
