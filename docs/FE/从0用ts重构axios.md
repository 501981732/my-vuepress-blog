todo:

- 性能优化--性能优化易-如何判断性能出现的原因难
- 游戏组件库

> 掌握造轮子过程--- 单元测试 ----前端工具的辅助开发----   提成段位
- ts开发项目
- 学会造轮子 单元测试
- 使用先进的开发工具
- axios实现原理

1. jest 
2. tslint
3. commitizen
4. prettier
5. rollupJs
6. semantic release 完全自动化版本管理和软件包发布
7. typescript

## axios 实现

- 在浏览器端使用 XMLHttpRequest 对象通讯
- 支持 Promise API
- 支持请求和响应的拦截器
- 支持请求数据和响应数据的转换
- 支持请求的取消
- JSON 数据的自动转换
- 客户端防止 XSRF


    工具：[typescript-library-starter](https://github.com/alexjoverm/typescript-library-starter)

集成了许多优秀的开源库：

- 使用 **RollupJS** 帮助我们打包。
- 使用 **Prettier** 和 **TSLint** 帮助我们格式化代码以及保证代码风格一致性。
- 使用 **TypeDoc** 帮助我们自动生成文档并部署到 **GitHub pages**。
- 使用 **Jest**帮助我们做单元测试。
- 使用 **Commitizen**帮助我们生成规范化的提交注释。
- 使用 **Semantic release**帮助我们管理版本和发布。
使用 **husk** 帮助我们更简单地使用 git hooks。
- 使用 **Conventional changelog**帮助我们通过代码提交信息自动生成 change log。
- Automatic types (*.d.ts) file generation
- Travis integration and Coveralls report

## 错误信息增强 扩展Error类 AxiosError extends Error

## ts-axios 接口扩展【工厂模式的合理运用，设计思想的转变】


##  ts-axios 拦截器实现【巧妙运用 Promise 链式调用】


## ts-axios 配置化实现【巧妙运用策略模式实现配置合并】


## ts-axios 取消功能实现【巧妙运用 Promise 实现异步分离】

### 需求分析：

有时候我们希望取消已经发送的请求：比如输入框搜索，每次输入都要重新请求，通常的解决方案是前端做debounce节流，延时200ms发送请求，当用户连续输入时，当间隔小于200ms不会发送请求。

但是当极端情况，后端接口很慢，我超过200ms去输入，在前面的请求还没有响应前，可能已经发出多个请求了，接口的相应时长不定，先发的请求比后发出的请求先相应，就会导致混乱。


xhr中adortAPI可以取消请求[XMLHttpRequest.abort()](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/abort),but 在axios中我们并不能接触到xhr,我们希望在XHR请求中插入一段代码，当我们在外面执行cancel的时候，能驱动这段代码执行，然后执行xhr.abort方法取消请求。

**调用方式一**

axios.CancelToken是一个类，
我们直接把它实例化的对象传给请求配置中的 cancelToken 属性，CancelToken 的构造函数参数支持传入一个 executor 方法，该方法的参数是一个取消函数 c，我们可以在 executor 方法执行的内部拿到这个取消函数 c，赋值给我们外部定义的 cancel 变量，之后我们可以通过调用这个 cancel 方法来取消请求。

#异步分离的
```
const CancelToken = axios.CancelToken;
let cancel;

axios.get('/user/12345', {
  cancelToken: new CancelToken(function executor(c) {
    cancel = c;
  })
});

// 取消请求
cancel();

```

我们给 axios 添加一个 CancelToken 的对象，它有一个 source 方法可以返回一个 source 对象，source.token 是在每次请求的时候传给配置对象中的 cancelToken 属性，然后在请求发出去之后，我们可以通过 source.cancel 方法取消请求。

### 异步分离的设计方案

我们需要为请求配置一个 cancelToken，然后在外部调用一个 cancel 方法。请求是一个异步过程，最终会执行xhr.send,我们在axios外面是碰不到axios自己封装的xhr的，我们希望在执行cancel的时候去执行 xhr.abort()方法,

相当于我们在xhr异步请求的时候插入一段代码，当我们在外部执行cancel的时候驱动这段代码执行从而取消请求。


### 利用Primise实现异步分离
**利用Primise实现异步分离**，在cancelToken中保存一个pending状态的Promise对象，当我们执行cancel的时候能访问到这个Promise，把它从pending状态变成reslove，这样我们就可以在 then 函数中去实现取消请求的逻辑。

```

插入在 xhr.js中

//当 请求传入了 cancelToken 实例，并且该实例内部的promise从pending变成reslove时 会执行
//啥时候回变呢
if (cancelToken) {
  cancelToken.promise
    .then(reason => {
      request.abort()
      reject(reason)
    })
}
```

### CancelToken类的实现

在 CancelToken构造函数内部，实例化一个pending状态的Promise,然后用resolvePromise指向resolve函数,接着执行executor, 在cancel内部会调用resolvePromise，利用闭包，外面可以拿到executor的函数参数，调用该函数，使promise从pending变成resolved。
```
export default class CancelToken {
  promise: Promise<string>
  reason?: string

  constructor(executor: CancelExecutor) {
    let resolvePromise: ResolvePromise
    this.promise = new Promise<string>(resolve => {
      resolvePromise = resolve
    })
    <!--调用的时候 传入CancelToken类里面的c 就是这 里面的function ,执行会  -->
    executor(message => {
      if (this.reason) {
        return
      }
      this.reason = message
      resolvePromise(this.reason)
    })
  }
}

```

## 其他功能

### withCredentials

> 通过CORS解决的跨域问题，默认不会请求不会懈怠cookie的， 需要设置xhr的 WithCredentials为true

### XSRF防御

> 又叫  CSRF，跨站请求访问。

<img src='/img/xsrf.png'>

#### 防御手段

1. 验证请求的referer,但是referer也可以伪造
2. 服务器端要求每次请求都包含一个`token`, `token`在我们每次访问站点的时候生成，并且`set-cookie`的方式种到客户端。 每次请求的时候从`cookie`中读取`token`，添加到`headers`中。 这样服务端从header中读取`token`并验证，这个`token`很难伪造，就能确保安全。

#### 使用
```
axios.get('/more/get',{
  xsrfCookieName: 'XSRF-TOKEN', // default
  xsrfHeaderName: 'X-XSRF-TOKEN' // default
}).then(res => {
  console.log(res)
})

```
1. 判断是否配置withCredentials为true或者同域请求，再添加字段
2. 判断成功从cookie中读取xsrf的token
3. 读到在假如到headers的相关字段

**判断是否同域小技巧**创建一个 a 标签的 DOM，然后设置 href 属性为我们传入的 url，然后可以获取该 DOM 的 protocol、host。当前页面的 url 和请求的 url 都通过这种方式获取。

```
const urlParsingNode = document.createElement('a')
const currentOrigin = resolveURL(window.location.href)

function resolveURL(url: string): URLOrigin {
  urlParsingNode.setAttribute('href', url)
  const { protocol, host } = urlParsingNode

  return {
    protocol,
    host
  }
```

### 上传与下载的进度监控

#### 需求
我们想上传文件或者请求大体积数据的时候知道实时进度，做进度条。xhr提供了`progress`事件，监听下载进度， `xhr.upload`也提供`progress`对上传进度监控

#### 使用方法
```
axios.get('/more/get',{
  onDownloadProgress(progressEvent) {
    // 监听下载进度
  }
})

axios.post('/more/post',{
  onUploadProgress(progressEvent) {
    // 监听上传进度
  }
})
```
如果请求的数据是 FormData 类型，我们应该主动删除请求 headers 中的 Content-Type 字段，让浏览器自动根据请求数据设置 Content-Type。比如当我们通过 FormData 上传文件的时候，浏览器会把请求 headers 中的 Content-Type 设置为 multipart/form-data
```
      if (onDownloadProgress) {
        request.onprogress = onDownloadProgress
      }

      if (onUploadProgress) {
        request.upload.onprogress = onUploadProgress
      }
```

```
export function isFormData(val: any): boolean {
  return typeof val !== 'undefined' && val instanceof FormData
}
```

#### auth授权

HTTP 协议中的 Authorization 请求 header 会包含服务器用于验证用户代理身份的凭证，通常会在服务器返回 401 Unauthorized 状态码以及 WWW-Authenticate 消息头之后在后续请求中发送此消息头。

axios 库也允许你在请求配置中配置 auth 属性，auth 是一个对象结构，包含 username 和 password 2 个属性。一旦用户在请求的时候配置这俩属性，我们就会自动往 HTTP 的 请求 header 中添加 Authorization 属性，它的值为 Basic 加密串。 这里的加密串是 username:password base64 加密后的结果。

useage

```
axios.post('/more/post', {
  a: 1
}, {
  auth: {
    username: 'Yee',
    password: '123456'
  }
}).then(res => {
  console.log(res)
})
```
实现

```
if (auth) {
  headers['Authorization'] = 'Basic ' + btoa(auth.username + ':' + auth.password)
}
```

server
```
router.post('/more/post', function(req, res) {
  const auth = req.headers.authorization
  const [type, credentials] = auth.split(' ')
  console.log(atob(credentials))
  const [username, password] = atob(credentials).split(':')
  if (type === 'Basic' && username === 'Yee' && password === '123456') {
    res.json(req.body)
  } else {
    res.end('UnAuthorization')
  }
})
```

### 自定义合法状态码

useage:
```
axios.get('/more/304', {
  validateStatus(status) {
    return status >= 200 && status < 400
  }
}).then(res => {
  console.log(res)
}).catch((e: AxiosError) => {
  console.log(e.message)
})
```
实现
```
function handleResponse(response: AxiosResponse): void {
  if (!validateStatus || validateStatus(response.status)) {
    resolve(response)
  } else {
    reject(
      createError(
        `Request failed with status code ${response.status}`,
        config,
        null,
        request,
        response
      )
    )
  }
}
```
如果没有配置 validateStatus 以及 validateStatus 函数返回的值为 true 的时候，都认为是合法的,正常 resolve(response)，否则都创建一个错误。


### 自定义参数序列

axios默认会对我们传入的params对象解析，根据一定规则把它解析成字符串拼接在url后面。默认对字符串encode，对一些特殊字符`@ +`不转义,我们也可以自己配置解析规则，接受params返回值作为解析后的结果。

useage

```
axios.get('/more/get', {
  params: {
    a: 1,
    b: 2,
    c: ['a', 'b', 'c']
  },
  paramsSerializer(params) {
    return qs.stringify(params, { arrayFormat: 'brackets' })
  }
}).then(res => {
  console.log(res)
})
```
实现
```
url.ts

  if (paramsSerializer) {
    serializedParams = paramsSerializer(params)
  } else if (isURLSearchParams(params)) {
    serializedParams = params.toString()
  } else {
    ...
```


### baseURL


```
url.js
export function isAbsoluteURL(url: string): boolean {
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url)
}

export function combineURL(baseURL: string, relativeURL?: string): string {
  return relativeURL ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '') : baseURL
}
dispatchRequest.ts调用
function transformURL(config: AxiosRequestConfig): string {
  let { url, params, paramsSerializer, baseURL } = config
  if (baseURL && !isAbsoluteURL(url!)) {
    url = combineURL(baseURL, url)
  }
  return buildURL(url!, params, paramsSerializer)
}

```


## 单元测试

## 部署 编译与发布

### 编译打包

  使用rollup打包，相对于webpack,更适合去编译和打包一些js库


rollup.config.ts
```

import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import sourceMaps from 'rollup-plugin-sourcemaps'
import camelCase from 'lodash.camelcase'
import typescript from 'rollup-plugin-typescript2'
import json from 'rollup-plugin-json'

const pkg = require('./package.json')

const libraryName = 'axios'

export default {
  input: `src/index.ts`,
  output: [
    { file: pkg.main, name: camelCase(libraryName), format: 'umd', sourcemap: true },
    { file: pkg.module, format: 'es', sourcemap: true }
  ],
  // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
  external: [],
  watch: {
    include: 'src/**'
  },
  plugins: [
    // Allow json resolution
    json(),
    // Compile TypeScript files
    typescript({ useTsconfigDeclarationDir: true }),
    // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
    commonjs(),
    // Allow node_modules resolution, so you can use 'external' to control
    // which external modules to include in the bundle
    // https://github.com/rollup/rollup-plugin-node-resolve#usage
    resolve(),

    // Resolve source maps to the original source
    sourceMaps()
  ]
}
```

### rollup简单讲解：

- input: 打包入口文件
- output：输出的目标文件，是个对象数组，我们可以指定输出格式，umd（通用模块规范，兼容AMD commonjs），es模式等
- external: 外部声明 不被打包进入
- watch: 监听文件变化重新编译，只有在编译的时候开启--watch才生效。
- plugins: 编译用到的插件 。rollup-plugin-typescript2 就是用来编译 TypeScript 文件，useTsconfigDeclarationDir 表示使用 tsconfig.json 文件中定义的 declarationDir

#### 修改package.json

```
{
  "main": "dist/axios.umd.js",
  "module": "dist/axios.es5.js",
  "typings": "dist/types/index.d.ts"
}
```

  其中 lib 目录是单个 .ts 文件编译后的 .js 文件。types 目录是所有 .ts 文件编译后生产的 .d.ts 声明文件。axios.es5.js 是编译后生成的 es 模式的入口文件，用在 package.json 的 module 字段，axios.umd.js 文件是编译后生成的 umd 模式的入口文件，用在 package.json 的 main 字段。

## 自动化部署

semantic-release 插件过于黑盒也略微重量,我们自己编写自动化插件

```
  "scripts": {
    ...
  "prepub": "npm run test:prod && npm run build",
  "pub": "sh release.sh"
  },
  "repository": {//关联远程参考地址
    "type": "git",
    "url": "git+https://github.com/Suremotoo/ts-axios-doc.git"
  },
```

`prepub`钩子在执行`npm run pub`的时候优先执行，`&&`便是前面命令执行完再执行后面的。

npm run test:prod 实际上运行了 npm run lint && npm run test -- --no-cache。 先运行 lint 去校验我们的源码和测试文件是否遵循 tslint 规范，再运行 test 去跑测试。

npm run build 实际上运行了 tsc --module commonjs、rollup -c rollup.config.ts 和 typedoc --out docs --target es6 --theme minimal --mode file src。先运行 tsc 去编译我们的 TypeScript 文件，dist/lib 和 dist/types 下的文件就是该命令产生的，然后运行 rollup 去构建 axios.umd.js 及 axios.es.js，最后运行 typedoc 去构建项目的文档。

运行完 prepub 后就会再运行 pub 命令，实际上执行了 sh release.sh 命令，但是目前我们没有这个脚本，接下来我们就需要来编写部署脚本 release.sh。

### 编写部署脚本

release.sh
```
#!/usr/bin/env sh
set -e
echo "Enter release version: "
read VERSION
read -p "Releasing $VERSION - are you sure? (y/n)" -n 1 -r
echo  # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then
  echo "Releasing $VERSION ..."

  # commit
  git add -A
  git commit -m "[build] $VERSION"
  npm version $VERSION --message "[release] $VERSION"
  git push origin master

  # publish
  npm publish
fi
```

**解读**部署脚本是 shell 脚本，shell 脚本就是封装了多行控制台命令

`#!/usr/bin/env sh` 用来表示它是一个 shell 脚本。

`set -e` 告诉脚本如果执行结果不为 true 则退出。

`echo "Enter release version: "` 在控制台输出 Enter release version:。

`read VERSION` 表示从标准输入读取值，并赋值给 $VERSION 变量。

`read -p "Releasing $VERSION - are you sure? (y/n)" -n 1 -r`，其中 read -p 表示给出提示符，后面接着 Releasing $VERSION - are you sure? (y/n) 提示符；-n 1 表示限定最多可以有 1 个字符可以作为有效读入；-r 表示禁止反斜线的转义功能。因为我们的 read 并没有指定变量名，那么默认这个输入读取值会赋值给 $REPLY 变量。

`echo` 输出空值表示跳到一个新行，`#` 在 shell 脚本中表示注释。

`if [[ $REPLY =~ ^[Yy]$ ]]` 表示 shell 脚本中的流程控制语句，判断 $REPLY 是不是大小写的 y，如果满足，则走到后面的 then 逻辑。

`echo "Releasing $VERSION ..."` 在控制台输出 Releasing $VERSION ...。

`git add -A` 表示把代码所有变化提交到暂存区。

`git commit -m "[build] $VERSION"` 表示提交代码，提交注释是 [build] $VERSION。

`npm version $VERSION --message "[release] $VERSION"` 是修改 package.json 中的 version 字段到 $VERSION，并且提交一条修改记录，提交注释是 [release] $VERSION。

`git push origin master` 是把代码发布到主干分支。

`npm publish` 是把仓库发布到 npm 上，我们会把 dist 目录下的代码都发布到 npm 上，因为我们在 package.json 中配置的是 files 是 ["dist"]。
`fi`if 结束

### 运行部署脚本
/* istanbul ignore next */ 忽略某些代码分支的测试。

当我们执行 npm run pub时候，先执行test，再build,再执行release.sh自动部署。就完成了整个代码的发布流程



