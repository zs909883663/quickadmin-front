<p align="center">
	<img alt="logo" width="80" src="https://static.yxhui.top/logo.png">
</p>
<h1 align="center" style="margin: 10px 0; font-weight: bold;">QuickAdmin 低代码平台</h1>

当前为前端项目，后端项目请移步[https://gitee.com/zszone/quickadmin-back](https://gitee.com/zszone/quickadmin-back)

## 简介

QuickAdmin 是一款基于代码生成器的低代码开发平台，通用型后台管理模板，界面美观、开箱即用，拥有丰富的扩展组件和模板页面，适合各类中后台应用，无需(或少量)写代码！帮助解决 PHP 前后端分离项目 70%的重复工作，让开发更多关注业务逻辑。在线 CURD 表单配置、丰富的插件市场等等！

采用前后端分离架构：ThinkPHP 6.x，ElementUI&&Vue 2.x，AntV-G2。

## 相关文档

-   开发文档：[http://doc.quickadmin.icu](http://doc.quickadmin.icu)
-   QuickAdmin 官网：[https://www.quickadmin.icu](https://www.quickadmin.icu)
-   在线演示：[http://demo.quickadmin.icu](http://demo.quickadmin.icu)

## 源码下载

> -   最新 release 版： [码云](https://gitee.com/zszone/quickadmin-front.git)

## 安装使用

### 前端

```bash
# 进入项目目录
cd quickAdmin

# 安装依赖
npm install

# 启动服务
npm run dev
```

> 浏览器访问 http://localhost:80

#### 发布

```bash
# 构建测试环境
npm run build:stage

# 构建生产环境
npm run build:prod
```

### 后台

-   1.将下载下来的后端包放到站点目录
-   2.安装依赖 composer install
-   3.导入 db 文件下的 init.sql 数据库
-   4.复制.example.env 命名为.env 修改数据库连接信息 和前端项目名称
-   5.添加站点并绑定 public 目录为运行目录
-   6.访问项目 admin 模块，如：http://demo-api.quickadmin.icu/admin 如果出现 quickadmin api is ok,表示后台安装成功

## 内置功能模块

-   角色组管理
-   管理员管理
-   菜单管理
-   系统配置
-   日志管理
-   附件管理
-   表单案例
-   Online 代码生成
-   插件市场

## 项目目录

```
├─首页
│  ├─首页（常见图表形态展示）
├─系统管理
│  ├─角色组管理
│  ├─管理员管理
│  ├─菜单管理（支持按钮权限、数据权限）
│  ├─系统配置
│  │  ├─基础配置
│  │  ├─上传配置（本地、阿里oss,七牛oss,腾讯oss）
│  └─日志管理
├─系统工具
│  ├─附件管理
├─常用案例
│  ├─表单测试案例（打印、编辑、字段显隐）
│  ├─tab状态检索案例
│  ├─商品管理案例
│  ├─exp案例
│─Online在线编辑（控制字段禁用、隐藏、类型）
│  └─列表显示
│  └─字段备注
│  └─控件类型
│  └─控件字典
│  └─是否查询
│  └─添加显示
│  └─编辑显示
│  └─是否只读
│  └─是否必填
│  └─验证规则
│  └─关联表追加
│─插件市场
│  ├─小组件
│  └─完整应用
└─更多功能开发中。。

```

## 系统演示截图

[![O1Sv4g.png](https://s1.ax1x.com/2022/05/08/O1Sv4g.png)](https://s1.ax1x.com/2022/05/08/O1Sv4g.png)
[![O1SzCQ.png](https://s1.ax1x.com/2022/05/08/O1SzCQ.png)](https://s1.ax1x.com/2022/05/08/O1SzCQ.png)
[![O1SXE8.png](https://s1.ax1x.com/2022/05/08/O1SXE8.png)](https://s1.ax1x.com/2022/05/08/O1SXE8.png)
[![O1SjUS.png](https://s1.ax1x.com/2022/05/08/O1SjUS.png)](https://s1.ax1x.com/2022/05/08/O1SjUS.png)
[![O1SLHf.png](https://s1.ax1x.com/2022/05/08/O1SLHf.png)](https://s1.ax1x.com/2022/05/08/O1SLHf.png)

## 在线体验

> -   [http://demo.quickadmin.icu](http://demo.quickadmin.icu)
> -   user: admin
> -   pwd:123456

## 特别鸣谢

建议在开发前先学一下以下内容，提前了解和学习这些知识，会对项目理解非常有帮助:

-   [Vue2 文档](https://cn.vuejs.org/v2/guide/)
-   [Vuex 状态管理](https://vuex.vuejs.org/zh/)
-   [Vue-cli](https://cli.vuejs.org/zh/config/)
-   [Vue-router](https://next.router.vuejs.org/)
-   [Element-ui-Vue](https://element.eleme.cn/#/zh-CN/component/installation)
-   [Es6](https://es6.ruanyifeng.com/)
