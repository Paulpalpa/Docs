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
在执行这一步时有可能会出现报错**Loaded plugins: fastestmirror**

此时需要执行如下命令并将enabled修改为0：
```bash
vim  /etc/yum/pluginconf.d/fastestmirror.conf
```
再执行这个命令将plugins修改为0：
```bash
vim /etc/yum.conf
```
之后清空yum缓存并重启：
```bash
yum clean all
rm -rf /var/cache/yum
yum makecache
```
现在可以开始安装Docker并启动Docker:
```bash
sudo yum install docker-ce docker-ce-cli containerd.io

sudo systemctl enable docker

sudo systemctl start docker
```
