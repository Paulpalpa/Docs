---
sidebar_position: 1
---

# 部署 Docusaurus

## 前言

Docusaurus 官方文档对于 build 生成的静态资源托管到服务器并没有很详细的介绍，网上也没有找到完整的最佳实践。
刚好我对于前端工程化的知识相对薄弱，于是打算亲手实践 Docker + Jenkins + Nginx + Github WebHook 的自动化部署流程并撰写相关文档。
![这是图片](/img/cicd.png "Magic Gardens")

## 准备工作

- 一台 Cent OS 7.6 云服务器
- GitHub 中的 Docusaurus 项目

## docker 安装

首先执行以下命令安装依赖：

```bash
sudo -i
yum install -y yum-utils
```

由于国内网络限制，设置国内镜像源：

```bash
sudo yum-config-manager \ --add-repo \ https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo

sudo sed -i 's/download.docker.com/mirrors.aliyun.com\/docker-ce/g' /etc/yum.repos.d/docker-ce.repo
```

:::note
在执行这一步时有可能会出现报错**Loaded plugins: fastestmirror**
此时需要执行如下命令并将 enabled 修改为 0：

```bash
vim  /etc/yum/pluginconf.d/fastestmirror.conf
```

再执行这个命令将 plugins 修改为 0：

```bash
vim /etc/yum.conf
```

之后清空 yum 缓存并重启：

```bash
yum clean all
rm -rf /var/cache/yum
yum makecache
```

:::

现在可以开始安装并启动 Docker:

```bash
sudo yum install docker-ce docker-ce-cli containerd.io

sudo systemctl enable docker

sudo systemctl start docker
```

简单拉取一个 demo 镜像验证 Docker 是否安装成功：

```bash
docker run --rm hello-world
```

为了方便 Docker 进行多容器的管理与配置，还需要安装 docker-compose：

```bash
sudo curl -L "https://github.com/docker/compose/releases/download/1.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

sudo chmod +x /usr/local/bin/docker-compose

docker-compose -v
```

:::note
如果报错出现**sudo: docker-compose: command not found**
说明 docker-compose 没有加入到 PATH，请执行：

```bash
sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
```

再执行**docker-compose -v**即可成功看到相应的版本信息
:::
至此，Docker 的安装与准备就完成了。

## docker-compose配置 Jenkins，nginx

首先拉取 Jenkins，nginx 镜像:

```bash
docker pull nginx

docker pull jenkins/jenkins:lts
```

为了方便管理，将相关配置放在同一文件夹下，我这里放到了 root 下:

```bash
mkdir //通过mkdir 建立目录如下

root
 jenkins
   + jenkins_home
 nginxcfg
   + default.conf
 compose
   + docker-compose.yml
```
配置docker-compose.yml如下，注意volumes的含义与写法：
```bash
version: '3'
services:
  docker_jenkins:
    user: root
    restart: always
    image: jenkins/jenkins:lts                 # 指定服务所使用的镜像
    container_name: jenkins                    # 容器名称
    ports:                                     # 对外暴露的端口定义
      - 8080:8080
      - 50000:50000
    volumes:                                   # 卷挂载路径
      - /root/jenkins/jenkins_home/:/var/jenkins_home  #冒号前为刚刚创建的路径，这里要写绝对路径
      - /var/run/docker.sock:/var/run/docker.sock
      - /usr/bin/docker:/usr/bin/docker
      - /usr/local/bin/docker-compose:/usr/local/bin/docker-compose
  docker_nginx:
    user: root
    restart: always
    image: nginx
    container_name: nginx
    ports:
      - 8090:80
      - 80:80
      - 433:433
    volumes:
      - /root/nginxcfg:/etc/nginx/conf.d  #用我们创建的Nginx配置去替换容器中的默认配置，冒号前为我们创建的目录的路径
      - /root/nginxcfg/logs:/var/log/nginx  #nginx日志位置
      - /root/doc/apps/build:/usr/share/nginx/html   #这里的配置尤其需要注意，后面Jenkins的构建产物存储在服务器中的位置
```
配置default.conf如下：
```bash
error_log  /var/log/nginx/error.log notice;
server{ # 简单的监听80端口，指定index位置
  listen  80;
  root /usr/share/nginx/html;
  index index.html index.htm;
}
```
至此，docker-compose配置jenkins以及nginx完成，接着我们启动docker-compose:
```bash
docker-compose up -d //执行启动

docker-compose stop //停止
```
## jenkins配置
jenkins已经启动，我们可以使用**服务器IP:8080**即可访问jenkins管理页面
:::note
第一次进入时需要输入密码进行初始化配置, 使用如下命令即可查看密码：
```bash
cat /root/jenkins/jenkins_home/secrets/initialAdminPassword
```
:::
首先我们需要在在系统管理中的插件管理下安装如下两个插件：
- Publish Over SSH
- Generic Webhook Trigger Plugin

![这是图片](/img/jenkins_plugins.png "Magic Gardens")

并在系统配置下，进行Publish Over SSH相关配置如图，设置完成后可以使用Test Configuration验证是否配置正确：

![这是图片](/img/ssh_config.png "Magic Gardens")

![这是图片](/img/ssh_server.png "Magic Gardens")

接下来进行Node.js的安装（注意Node的版本），在全局工具配置下配置如图：

![这是图片](/img/nodejs.png "Magic Gardens")

最后一步，开始创建一个jenkins构建任务：

![这是图片](/img/build.png "Magic Gardens")

首先进行Git仓库的配置：

![这是图片](/img/git.png "Magic Gardens")

为了实现我们将代码推送到远程分支后jenkins能够进行自动构建，需要使用之前我们安装的**Generic Webhook Trigger Plugin**插件， 配置如图：

![这是图片](/img/trigger.png "Magic Gardens")

之后需要在GitHub仓库中进行WebHook的相关配置，重点在于URL: http://服务器IP:8080/generic-webhook-trigger/invoke?token=上图中的token

![这是图片](/img/webhook.png "Magic Gardens")

下一步设置构建环境为Node:

![这是图片](/img/build_node.png "Magic Gardens")

然后增加构建步骤为执行shell:

![这是图片](/img/shell.png "Magic Gardens")
```bash
node -v
npm install
npm run build
tar -zcvf build.tar ./build
```
再增加一个构建步骤为：Send files or execute commands over SSH：

![这是图片](/img/send.png "Magic Gardens")

```bash
cd /root/doc/apps  #进入文件所在目录
tar zxvf build.tar
rm -rf build.tar 
```

## 最后
在网址中输入服务器IP就能看到我们的文档网站了

![这是图片](/img/web.png "Magic Gardens")

一次前端过程的自动化部署就完成了，整个过程不算太复杂，但是对于初次接触的同学还是会有不小难度，配置过程中一些需要注意的点也都已经标明，一些可能会出现问题点以及解决方案也已经列出。由于项目本身就是静态文档网站，所以涉及到的一些配置会比较简单，配置也有很多可以优化的地方，后续也会持续的进行优化。













