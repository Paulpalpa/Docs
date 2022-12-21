---
sidebar_position: 2
---

# Web VsCode安装与部署

## 1. 通过Code-Server安装VSCode

- 你需要一台有公网ip的linux服务器。
- 首先，在服务器上运行一键安装脚本：`curl -fsSL https://code-server.dev/install.sh | sh` 。它会自动执行，当显示以下内容时，你已经成功安装了VSCode

```
To have systemd start code-server now and restart on boot:
  sudo systemctl enable --now code-server@$USER
Or, if you don't want/need a background service you can run:
  code-server
```

## 2. 执行code-serve命令

执行code-serve命令后会看到如下信息：

```
[2021-01-08T15:53:58.789Z] info  code-server 3.8.0 c4610f7829701aadb045d450013b84491c30580d
[2021-01-08T15:53:58.794Z] info  Using user-data-dir ~/.local/share/code-server
[2021-01-08T15:53:58.817Z] info  Using config file ~/.config/code-server/config.yaml
[2021-01-08T15:53:58.818Z] info  HTTP server listening on http://0.0.0.0:你设置的端口
[2021-01-08T15:53:58.819Z] info    - Authentication is enabled
[2021-01-08T15:53:58.819Z] info      - Using password from ~/.config/code-server/config.yaml
[2021-01-08T15:53:58.820Z] info    - Not serving HTTPS
```

## 3. 编辑code-serve的config文件

执行find -name code-server找到文件安装位置，然后使用vim编辑vi ./.config/code-server/config.yaml

```
bind-addr: 0.0.0.0:端口号
auth: password
password: 设置密码
cert: false
```

## 4. 输入公网IP+端口号

![image-20220712220420669](https://s2.loli.net/2022/12/20/dSawOJKM3PjEbxl.png)

![image-20220712220956779](https://s2.loli.net/2022/12/20/vgncXO9Q5aih1wD.png)

## 4. 可能的坑

- 执行安装脚本时： curl: (35) Encountered end of file 

```
# 需要开启防火墙 systemctl start firewalld
firewall-cmd --zone=public --add-port=443/tcp --permanent # 添加 443 端口访问
firewall-cmd --reload # 重新加载让配置生效
```

- 所有设置都完成了，IP也能ping通，但就是无法访问

  记得在服务器防火墙设置中放开端口

  ![image-20220712221131506](https://s2.loli.net/2022/12/20/iQfK9Z2GP5UJYrm.png)

