---
sidebar_position: 1
---

# Docker基础


## Docker镜像基础操作

```bash
docker pull [镜像名称:版本] 拉取镜像
docker images  镜像列表
docker rmi [镜像名称:版本] 删除镜像
docker history [镜像名称] 镜像操作记录
docker tag [镜像名称:版本][新镜像名称:新版本]
docker inspect [镜像名称:版本] 查看镜像详细
docker search [关键字] 搜索镜像
docker login 镜像登陆
```

## Docker容器基础操作
```bash
docker ps -a 容器列表(所有容器)
docker ps  查看所有(运行的)容器
docker exec -ti <id> bash  以 bash 命令进入容器内
docker run -ti --name [容器名称][镜像名称:版本] bash 启动容器并进入
docker logs 查看容器日志
docker top <container_id> 查看容器最近的一个进程
docker run -ti --name [容器名称] -p 8080:80 [镜像名称:版本] bash  端口映射
docker rm <container_id> 删除容器
docker stop <container_id> 停止容器
docker start <container_id> 开启容器
docker restart <container_id> 重启容器
docker inspect <container_id> 查看容器详情
docker commit [容器名称] my_image:v1.0  容器提交为新的镜像
```

## DockerFile基础操作
```bash
FROM：FROM 是构建镜像的基础源镜像，该 Image 文件继承官方的 node image。
详细说明：Dockerfile 中 FROM 是必备的指令，并且必须是第一条指令！ 它引入一个镜像作为我们要构建镜像的基础层，就好像我们首先要安装好操作系统，才可以在操作系统上面安装软件一样。

RUN：后面跟的是在容器中要执行的命令。
详细说明：每一个 RUN 指令都会新建立一层，在其上执行这些命令，我们频繁使用 RUN 指令会创建大量镜像层，然而 Union FS 是有最大层数限制的，不能超过 127 层，而且我们应该把每一层中我用文件清除，比如一些没用的依赖，来防止镜像臃肿。

WORKDIR：容器的工作目录

COPY：拷贝文件至容器的工作目录下，.dockerignore 指定的文件不会拷贝

EXPOSE：将容器内的某个端口导出供外部访问

CMD：Dockerfile 执行写一个 CMD 否则后面的会被覆盖，CMD 后面的命令是容器每次启动执行的命令，多个命令之间可以使用 && 链接，例如 CMD git pull && npm start
详细说明:CMD 指令用来在启动容器的时候，指定默认的容器主进程的启动命令和参数。
它有两种形式
```