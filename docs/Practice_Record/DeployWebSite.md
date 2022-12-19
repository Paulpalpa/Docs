---
sidebar_position: 1
---

# 部署Docusaurus

## 前言
Docusaurus官方文档对于build生成的静态资源托管到服务器并没有很详细的介绍，网上也没有找到完整的最佳实践。
刚好我对于前端工程化的知识相对薄弱，于是打算亲手实践以下自动化部署流程并撰写相关文档。
<img
  src={require('./img/cicd.png').default}
  alt="示例横幅"
/>

## 准备工作
- 一台Cent OS 7.6云服务器
- GitHub中的Docusaurus项目

## docker安装


