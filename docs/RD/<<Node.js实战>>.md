### 本文是2019年春节期间读<<Node.js实战>> 总结部分

### 第一部分

#### 第一章

> 知识点

1. Node.js是js的一个运行平台

    特征：异步与事件驱动机制以及小巧精悍的标准库。
    优势：单线程编程模型 
2. 我们希望在读取文件或通过网络发送消息时，运行平台不阻塞业务逻辑的执行：事件 异步API 非阻塞I/O 

3. node用libuv库提供快速 跨平台非阻塞I/O的本地库
4. 事件轮询是单向的先入先出队列

**ES6 NODE V8**

1.当你考虑用const或let时，几乎都可以用let, 你的大部分代码都是用你自己的类实例，对象常量或不会变的值， const的引用是只读的，并非值只读
2. V8一个值得称道的特性：他会被JS直接便以为机器码，另外他有一些代码优化特性，所以NODE才特别快
3. node软件栈图：
     本地部件libuv负责I/O
     V8负责js代码解释和执行
     用C++绑定层可将libuv和V8结合起来
4. ES2015特性分为 shipping,staged,in progress
    shipping默认开启, 
    **node -- harmory**开启staged, 
    node --v8-options | grep "in progress"
5.  调试器 
    **node debugger app.js** 输入命令c 继续
    **node --inspect --debug-brk** chrome交互式调试  node支持chrome调试协议

6. node可以做什么：3大类
    1. WEB应用程序
        - 提供单页面应用的简单程序
        - REST微服务
        - 全栈WEB应用
    2. 命令行工具
    ```
    cli.js
    const [nodePath,scriptPath,name] = process.argv
    console.log(hello,name)
    
    node cli.js wangmeng 
    输出 hello wangmeng
    #！
    ```
    3. 后台程序、桌面应用 Electron
    4. 其他语言无法做到的：同构 因为node是基于js，复杂客服端应用可以经过改造在NODE服务器上运行，让服务器预渲染，加快页面在浏览器的渲染速度，也有利于搜索引擎进行索引


####第二章node编程基础

> 1.模块 2.事件发射器实现简单的发布/订阅模式 3.扩展事件监听器：文件监听器 4.流程控制：串行并行

1. **Node查找文件顺序**： 核心模块-> 当前目录 -> node_modules
2. **require是Node少数几个同步I/O操作**。 在I/O密集的地方尽量不要require,在运行一个HTTP服务器，每个请求都require会遇到性能问题，require和其他几个操作通常都放在程序最初加载的地方。
3. **模块最终导出的是什么：**
    - 最终导出的是module.exports exports只是对module.exports的一个全局引用，一个可以添加属性的空方法。
    - 假如exports = xxx 这样设定为别的，就打破了module.exports 和exports的**引用关系** 那么就不再指向nodule.exports了，but可以这样让module.exports再次应用exports
4. 事件发射器实现简单的发布/订阅模式
    - module.exports = exports = xxx
5. [扩展事件监听器：文件监听器](https://codepen.io/501981732/pen/pGNpVx)
6. [events模块实现发布/订阅模式](https://codepen.io/501981732/pen/KJNZqe)

#### 第三章 Node Web 程序是什么

1. 一般node web结构
```
package.json
public/ 静态资源文件 css js
app.js or index.js 设置程序代码
models/ 数据库模型
views/ 用来与页面的模板
controllers/ or routers/ http请求处理
middleware/ 中间件组件
```

2. 请求可以用curl命令
```
curl http:localhost:3001/artiles
curl -x DELETE http:localhost:3001/artiles/1
curl --data "title=xxx" http:localhost:3001/artiles/1   post 请求
```

3. sqlite3进程内的管理器，不需要安装一个后台运行的数据库


> 实战代码
> 
#### 第四章 前端构建工具

##### 配置前端构建方法
- 指定命令行参数 ./node_modules/.bin uglify --source-map
- 针对项目创建配置文件 .babelrc .eslint.rc等
- 将配置参数放到package.json 里面 browerslist  babel等
- 构建复杂则可以创建shell命令 用npm 调用
- gulp webpack等

#### gulp
Gulp是基于流的构建系统，我们可以通过对这些流的引导来创建构建过程。

gulp实现高度复用归功于：1.插件 2. 自定义构建任务
```
gulp.task('default', () => {
  return gulp.src('app/*.jsx')
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['es2015', 'react']
    }))
    .pipe(concat('all.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist'));
});
```
在gulp中用js表示构建阶段很容易。我们可以用gulp.task()往这个文件添加自己任务。这些任务通常有相同模式。（sourcemaps是特例：需要2次pipe 一个配置 一次输出）
1. 源文件  -- 收集输入文件
2. 转译   -- 让他们一次通过一个个对他们进行转译的插件。
3. 合并   -- 把这些文件合到一起，创建一个整体构建文件。
4. 输出   -- 设定文件的目标地址或者移动输出文件。

gulp是一个通用的项目自动化工具，它适合管理项目里的跨平台清理脚本，比如隐形复杂的客户端测试或为数据库提供固定的测试环境。

#### webpack

用gulp时，写JS代码是为了驱动测试系统，所以或涉及到写gulpfile和构建任务。
webpack写的是配置文件，用插件和加载器添加新功能，甚至可以不写配置文件，在命令行中直接输webpack将源文件的目录作为参数，就能构建项目。
webpack的优势之一就是 更容易快速搭建出一个支持增量式构建的构建系统。webpack不会因为一个文件发生变化而重新构建整个项目。



## 第十章 Node程序的部署以及运维

>如何向外界开放对程序的访问：1.可以将访问流从80和443端口转发给你的程序。2.也可以在前面部署nginx做代理，同时让他梳理静态文件

### 安置node三种方式

- 平台及服务(PaaS) Amzzon Azure Heoku
- 服务器或者虚拟主机 阿里云 私有主机（**scp** **sftp**等将代码上传或者 **git**仓库）
- 容器 **Docker**这样的软件容器运行你的程序和其他相关服务

### 部署基本知识

- scp sftp等将代码上传或者git仓库拉取
- 自动化部署 **（Fleet）**
- 保证node不掉线 **Forever**
    - 断开SSH后不会退出
    - 如果崩溃 Forever会自动重启
    - -w 在源码发生变化时自动重启程序

### 在线时长和性能最大化

> 1.我们希望保证程序在线，在服务器启动时启动，关闭时关闭，崩溃时重启
> 2. 我们希望吧所有的CPU内核都用上，在高容量生产站点上避免用node提供静态文件，node擅长交互式程序，静态文件 1.交给 **nginx**来处理静态文件，或者 2.将静态文件放到**CDN**，然后再程序中指向它

- **upStart**保证程序在线，在服务器启动时启动，关闭时关闭，崩溃时重启
- 用Node的 **集群API**，充分利用多核处理器的处理能力
- 弄Nginx提供Node程序中的静态文件

#### node集群API的例子

```js
const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;
const workers = {};
let requests = 0;

if (cluster.isMaster) {
  for (let i = 0; i < numCPUs; i++) {
    workers[i] = cluster.fork();
    ((i) => {
      workers[i].on('message', (message) => {//监听来自工作进程的消息
        if (message.cmd == 'incrementRequestTotal') {
          requests++; //增加总请求数
          for (var j = 0; j < numCPUs; j++) {
            workers[j].send({                //将新的总请求数发给所有工作进程
              cmd: 'updateOfRequestTotal',
              requests: requests
            });
          }
        }
      });
    })(i); //用闭包保存当前工作进程的索引
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log('Worker %s died.', worker.process.pid);
  });
} else {
  process.on('message', (message) => {  //监听来自主进程的消息
    if (message.cmd === 'updateOfRequestTotal') {
      requests = message.requests;     //根据主进程的消息来更新请求数
    }
  });
  http.Server((req, res) => {
    res.writeHead(200);
    res.end(`Worker ${process.pid}: ${requests} requests.`);
    process.send({ cmd: 'incrementRequestTotal' });//让主进程知道该增加请求数了
  }).listen(8000);
}
```


### 容器 可以看作是将程序的部署自动化的OS虚拟技术

[nodejs-docker-webapp](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)

 Docker允许将程序定义为镜像，在将程序容器化之后，用一条命令就可以带起一个新鲜的实例.
 - 安装Docker
 - 创建一个node程序
 - 在项目中添加 Dockerfile文件
    - Dockerfile会告诉docker如何创建Docker的奖项，以及如何安装这个程序并运行它，