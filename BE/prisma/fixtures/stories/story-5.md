## 문제 상황

컨테이너에서 돌아가고 있는 젠킨스에서 docker-compose 명령을 수행하면 다음과 같이 Permission denied 가 뜨는 상황  
호스트 서버 OS는 CentOS 이다.

```
+ docker-compose build backend_flask_server
/var/jenkins_home/workspace/connect-gnu-flask@tmp/durable-af0a7acc/script.sh.copy: 1: docker-compose: Permission denied
```

- Jenkinsfile
- `stage('Build') { sh(script: 'docker-compose build backend_flask_server') }`
- docker-compose.yml
- `version: "3.8" services: jenkins: image: jenkins/jenkins:latest container_name: jenkins ports: - "8080:8080" - "50000:50000" environment: - TZ=Asia/Seoul user: root privileged: true volumes: - /jenkins:/var/jenkins_home - /var/run/docker.sock:/var/run/docker.sock - /usr/bin/docker:/usr/bin/docker - /usr/local/bin/docker-compose:/usr/local/bin/docker-compose restart: unless-stopped`

## 해결 방법

Docker-Compose 플러그인을 직접 호스트 서버에 설치하여 도커와 마운트 해주니 해결되었다.

### 설치하기

```
# Compose Plugin
sudo mkdir -p /usr/local/lib/docker/cli-plugins/
sudo curl -SL "https://github.com/docker/compose/releases/latest/download/docker-compose-linux-$(uname -m)" -o /usr/local/lib/docker/cli-plugins/docker-compose
sudo chmod +x /usr/local/lib/docker/cli-plugins/docker-compose

docker compose version
```

### Compose 플러그인을 docker-compose 명령어로 사용하기

```
alias docker-compose='docker compose --compatibility "$@"'

docker-compose version
```

### docker-compose.yml 수정

```
volumes:
   - /jenkins:/var/jenkins_home
   - /var/run/docker.sock:/var/run/docker.sock
   - /usr/bin/docker:/usr/bin/docker
   - /usr/local/lib/docker/cli-plugins/docker-compose:/usr/local/bin/docker-compose
```

## 참고 문헌

[How to solve docker-compose: Permission denied inside Jenkins's container](https://stackoverflow.com/questions/77591510/how-to-solve-docker-compose-permission-denied-inside-jenkinss-container)

[using docker-compose without sudo doesn't work](https://stackoverflow.com/questions/68653051/using-docker-compose-without-sudo-doesnt-work)

[Amazon Linux 2023 Docker Compose 플러그인 설치](https://kdev.ing/install-docker-compose-in-amazon-linux-2023/)

[docker.sock 권한 거부 에러](https://younsl.github.io/blog/var-run-docker-sock-permission-denied/)

[\[Docker/Linux\] Docker상의 Volume에서 permission denied 에러가 발생할 때 해결법](https://engineer-mole.tistory.com/264)
