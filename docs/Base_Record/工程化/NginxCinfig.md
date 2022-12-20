---
sidebar_position: 2
---

# nginx 基础

nginx 是开源的轻量级 Web 服务器、反向代理服务器，以及负载均衡器和 HTTP 缓存器。其特点是高并发，高性能和低内存。

![这是图片](/img/nginx.png "Magic Gardens")

## 反向代理

客户端对代理服务器是无感知的，客户端不需要做任何配置，用户只请求反向代理服务器，反向代理服务器选择目标服务器，获取数据后再返回给客户端。反向代理服务器和目标服务器对外而言就是一个服务器，只是暴露的是代理服务器地址，而隐藏了真实服务器的 IP 地址。

![这是图片](/img/nginx_1.png "Magic Gardens")

## nginx 基础命令

```bash
nginx -v  // 查看版本

nginx    // 启动

nginx -s stop(推荐) 或 ./nginx -s quit   // 停止

nginx -s reload  // 重载

nginx -t   // 测试
```

## nginx 配置文件

- 全局块：配置影响 nginx 全局的指令。一般有运行 nginx 服务器的用户组，nginx 进程 pid 存放路径，日志存放路径，配置文件引入，允许生成 worker process 数等。

- events 块：配置影响 nginx 服务器或与用户的网络连接。有每个进程的最大连接数，选取哪种事件驱动模型处理连接请求，是否允许同时接受多个网路连接，开启多个网络连接序列化等。

- http 块：可以嵌套多个 server，配置代理，缓存，日志定义等绝大多数功能和第三方模块的配置。如文件引入，mime-type 定义，日志自定义，是否使用 sendfile 传输文件，连接超时时间，单连接请求数等。

  - server 块：配置虚拟主机的相关参数，一个 http 中可以有多个 server。

  - location 块：配置请求的路由，以及各种页面的处理情况。

## location 匹配规则

```bash
location[ = | ~ | ~* | ^~ ] url {

}
```

- =：表示精确匹配
- ~：表示区分大小写正则匹配
- ~\*：表示不区分大小写正则匹配
- ^~：表示 URI 以某个常规字符串开头
- !~：表示区分大小写正则不匹配
- !~\*：表示不区分大小写正则不匹配
- /：通用匹配，任何请求都会匹配到

## 一些小例子

1. 最简单的负载均衡

```bash
   upstream myserver {
      server 192.167.4.32:5000;
      server 192.168.4.32:8080;
    }

    server {
        listen       80;   #监听端口
        server_name  192.168.4.32;   #监听地址

        location  / {
           root html;  #html目录
           index index.html index.htm;  #设置默认页
           proxy_pass  http://myserver;  #请求转向 myserver 定义的服务器列表
        }
    }

```

2. 资源服务器动静分离

```bash
upstream static {
    server 192.167.4.31:80;
}

upstream dynamic {
    server 192.167.4.32:8080;
}

server {
    listen       80;   #监听端口
    server_name  www.abc.com; 监听地址

    # 拦截动态资源
    location ~ .*\.(php|jsp)$ {
       proxy_pass http://dynamic;
    }

    # 拦截静态资源
    location ~ .*\.(jpg|png|htm|html|css|js)$ {
       root /data/;  #html目录
       proxy_pass http://static;
       autoindex on;;  #自动打开文件列表
    }
}

```
