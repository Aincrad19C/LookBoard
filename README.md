## 简介
这是 **敏捷看板** 项目，使用React + Koa-v3制作。

## Github地址
https://github.com/Aincrad19C/LookBoard.git

## Docker镜像拉取
前端镜像：docker pull aincrad19c/frontend:v1.6
后端镜像：docker pull aincrad19c/backend:v1.6
数据库镜像：docker pull mysql:5.7

## 使用说明
请解压后在**docker-compose文件夹**中打开命令行工具，输入docker-compose up --build，随后，打开 http://localhost:3000 使用

附件添加功能中，附件上传至docker后端的uploads目录下

## 额外技术栈说明
使用mysql数据库，管理账号信息，项目信息，任务信息，评论信息