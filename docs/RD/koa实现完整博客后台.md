### 项目框架搭建

### 分成设计
```
└── server
    ├── controllers # 操作层 执行服务端模板渲染，json接口返回数据，页面跳转
    │   ├── admin.js
    │   ├── index.js
    │   ├── user-info.js
    │   └── work.js
    ├── models # 数据模型层 执行数据操作
    │   └── user-Info.js
    ├── routers # 路由层 控制路由
    │   ├── admin.js
    │   ├── api.js
    │   ├── error.js
    │   ├── home.js
    │   ├── index.js
    │   └── work.js
    ├── services # 业务层 实现数据层model到操作层controller的耦合封装
    │   └── user-info.js
    └── views # 服务端模板代码
        ├── admin.ejs
        ├── error.ejs
        ├── index.ejs
        └── work.ejs
```

### 路由

### 数据请求部分

### 图片上传部分

### 日志文件

### 手写中间件

### 静态资源服务器

### cookie session redis

### mysql

### mysql初始化建表操作
通常初始化数据库要建立很多表，特别在项目开发的时候表的格式可能会有些变动，这时候就需要封装对数据库建表初始化的方法，保留项目的sql脚本文件，然后每次需要重新建表，则执行建表初始化程序就行

#### 流程
1. 遍历 db init下面sql文件
2. 解析所有sql文件脚本内容
3. 执行sql脚本

#### 目录结构
```
├── db   # sql脚本文件目录
    ├── mysql.js # 封装的mysql模块方法
    └── init # sql脚本文件目录
        ├── data.sql
        └── user.sql
└── util    
    ├── get-sql-content-map.js # 获取sql脚本文件内容
    ├── get-sql-map.js # 获取所有sql脚本文件
    └── walk-file.js # 遍历sql脚本文件
```

### debugger

### 单元测试

### JSONP

koa-jsonp

### nginx
