* uname -a
* cat /etc/redhat-release
* systemctl stop firewalld
* free -m
* ping www.baidu.com
* cat /etc/yum.repos.d
* curl -o /etc/yum.repos.d/ http://mirrors.aliyun.com/
* yum install epel-release -y
* yum list docker --show-duplicates
* yum list docker-ce --show-duplicates
* yum install -y yum-utils
* yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo

* yum install docker-ce
* systemctl enable docker
* systemctl start docker
* mkdir /etc/docker
* vi /etc/docker/daemon.json
* systemctl restart docker

* docker info
  Docker Root Dir: /var/lib/docker
  Insecure Registries:127.0.0.0/8

  > To generate this message, Docker took the following steps:
      1. The Docker client contacted the Docker daemon.
      2. The Docker daemon pulled the "hello-world" image from the Docker Hub.
          (amd64)
      3. The Docker daemon created a new container from that image which runs the
          executable that produces the output you are currently reading.
      4. The Docker daemon streamed that output to the Docker client, which sent it
          to your terminal.

* docker login docker.io
* cat /root/.docker/config.json
* echo "eWFuZ2RheXU6a3V2TEdydUtQVEg5ZGZn"|base64 -d
> 镜像操作
* docker search alpine (dockerhub 提供的镜像)
* docker pull alpine
  (pulling from docker.io/library/alpine)
* docker pull alpine:3.10.3
* docker images
* docker image ls
* docker tag 389fef711851 docker.io/yangdayu/alpine:v3.10.3
* docker push docker.io/yangdayu/alpine:v3.10.3
* docker rmi yangdayu/alpine:latest
* docker rmi -f 389fef711851
> 容器操作
* docker ps -a
* docker run -it docker.io/yangdayu/alpine:latest /bin/sh
  docker run [OPTIONS] IMAGE [COMMAND] [ARG...]
  -i: 启动一个可交互的容器，并持续打开标准输出
  -t: 使用终端关联标准输出
  -d：将容器放置后台运行
  --rm： 退出后即删除容器
  --name：表示定义容器唯一名称
  --net=container:id(与另一个contianer公用一个网络空间) | host（使用主机的网络） |none
  IMAGE：要运行的镜像
  COMMAND：启动容器时要运行的命令
* /# ip add
  172.17.0.2/16
* /# cat /etc/issue
* /# echo hello > 1.txt
* docker run --rm docker.io/yangdayu/alpine /bin/echo hello
* docker run -d --name myalpine docker.io/yangdayu/alpine:latest /bin/sleep 300
* docker ps -a | grep alpine
* ps aux|grep sleep|grep -v grep [查看宿主机进程
* docker exec -it f3ad966e4456 /bin/sh [进入容器内
* docker stop cbd68dbc1abd
* docker start cbd68dbc1abd
* docker restart cbd68dbc1ab
* docker rm -f cbd68dbc1abd
* docker commit -p cbd68dbc1abd docker.io/yangdayu/alpine:latest_with_1.txt
* docker images|grep alpine
* docker inspect ec0050e05439
> 镜像导入导出
* docker save 0feea2a9155f > alpine:v3.10.3_with_1.txt.tar
* docker images
* docker load < alpin....tar
* docker tag 0feea2a9155f yangdayu/alpine:v3.10.3_with_1.txt
> 日志
* docker run hello-world 2>&1 >>/dev/null
* docker logs -f af79e3da0a4d
> proxy 映射端口
  docker run -p[容器外端口]:[容器内端口]
* docker run --rm --name mynginx -d -p81:80 yangdayu/nginx:v1.12.2
* netstat -lumtp|grep 81
* curl 127.0.0.1:81
> 挂载数据卷
  docker run -v[容器外目录]:[容器内目录]
* mkdir html
* wget www.baiduc.om -O index.html
* docker run -d --rm --name nginx_with_baidu -p82:80 -v/root/html:/usr/share/nginx/html yangdayu/nginx:v1.12.2 
* df -h (查看挂载情况)
* docker inspect 6b41d7616564 | grep share
> 传递环境变量
  docker run -e 环境变量key=环境变量value
* docker run --rm -e E_OPTS=abcdefg docker.io/yangdayu/alpine:latest printenv
> 容器内安装yum
* tee /etc/apt/sources.list << EOF
deb http://mirrors.163.com/debian/ jessie main non-free contrib
deb http://mirrors.163.com/debian/ jessie-updates main non-free contrib
EOF
* apt-get update && apt-get install curl -y

* docker commit -p 6b41d7616564 yangdayu/nginx:curl
* docker push yangdayu/nginx:curl
> Dockerfile
* vi Dockerfile
  v1:---
  FROM docker.io/yangdayu/nginx:curl
  USER nginx(定义所使用的用户)
  WORKDIR /usr/share/nginx/html
  v2:---
  FROM docker.io/yangdayu/nginx:curl
  ADD index.html /usr/share/nginx/html/index.html(将当前目录的index.html 放到 容器/usr/share/nginx/html/index.html)
  EXPOSE 80
  v3:---
  FROM centos
  ENV VER 9.9.4-74.e17_6.1 (定义变量)
  RUN yum install bind-$VER -y （构建镜像时执行）
  v4:----
  FROM centos:7
  RUN yum install httpd -y
  CMD ["httpd","-D","FOREGROUND"]
  v5:---
  FROM centos:7
  ADD entrypoint.sh /entrypoint.sh
  RUN yum install epel-release -q -y && yum install nginx -y
  ENTRYPOINT /entrypoint.sh (直接执行脚本)
  v6:---
  FROM yangdayu/nginx:v1.12.2
  USER root
  ENV WWW /usr/share/nginx/html
  ENV CONF /etc/nginx/conf.d
  RUN /bin/cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime &&\
      echo 'Asia/Shanghai' >/etc/timezone
  WORKDIR $WWW
  ADD index.html $WWW/index.html
  ADD demo.od.com.conf $CONF/demo.od.com.conf
  EXPOSE 80
  CMD ["nginx", "-g", "daemon off;"]
* docker build . -t docker.io/yanngdayu/nginx:curl_with_user_workdir
* netstat -luntp
* nslookup www.qq.com



#### k8s
* getenforce
  Disabled （SE Linux 模式关闭状态）
* uname -a
* systemctl stop firewalld
* yum install epel-release
* yum install wget net-tools telnet tree nmap sysstat lrzsz dos2unix bind-utils -y
* yum install bind -y (ip 域名绑定)
* rpm -qa bind
* vi /etc/named.conf
  listen-on port 53 { 192.168.10.204; };
  allow-query     { any; };
  forwarders      { 10.4.7.254;}; 网关
  dnssec-enable no;
  dnssec-validation no;
* named-checkconf
> 编辑区域配置文件
* vi /etc/named.rfc1012.zones
  zone "host.com" IN {
          type master;
          file "host.com.zone";
          allow-update { 192.168.10.204; };
  };

  zone "od.com" IN {
          type master;
          file "od.com.zone";
          allow-update { 192.168.10.204; };
  };
> 编辑区域数据文件
* vi /var/named/host.com.zone
    $ORIGIN host.com.
  $TTL 600          ; 10 minutes
  @                 IN SOA  dns.od.com. dnsadmin.od.com. (
                                  201911101  ; serial
                                  10800      ; refresh (3 hours)
                                  900        ; retry (15 minutes)
                                  604800     ; expire (1 week)
                                  86400      ; minimum (1 day)
                                  )
                                  NS dns.od.com.
  $TTL 60 ; 1 minute
  dns                  A    192.168.10.204
  mydayu101            A    192.168.10.204
  mydayu102            A    192.168.10.205
  mydayu103            A    192.168.10.208
  mydayu104            A    192.168.10.207
  mydayu100            A    192.168.10.206
> 签发证书
* cat >/opt/certs/ca-csr.json <<EOF
  {
      "CN": "zqcd",
      "hosts": [
      ],
      "key": {
          "algo": "rsa",
          "size": 2048
      },
      "names": [
          {
              "C": "CN",
              "ST": "chengdu",
              "L": "chengdu",
              "O": "zq",
              "OU": "ops"
          }
      ],
      "ca": {
          "expiry": "175200h"
      }
    }
    EOF
* cfssl gencert -initca ca-csr.json
* cfssl gencert -initca ca-csr.json | cfssljson -bare ca
* curl -fsSL https://get.docker.com | bash -s docker --mirror Aliyun
* mkdir /etc/docker/
* cat >/etc/docker/daemon.json <<EOF
{
  "graph": "/data/docker",
  "registry-mirrors": ["https://bymuz66d.mirror.aliyuncs.com"],
  "exec-opts": ["native.cgroupdriver=systemd"],
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "100m"
  },
  "storage-driver": "overlay2",
  "storage-opts": [
    "overlay2.override_kernel_check=true"
  ]
}
* mkdir -p /data/docker
* systemctl start docker
> 创建docker私有仓库harbor
* scp Download/horbor.tgz root@39.96.60.169:/opt/src
* tar xf harbor.tgz -C /opt
