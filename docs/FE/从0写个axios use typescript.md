todo:

- 个人博客
- 性能优化--性能优化易-如何判断性能出现的原因难
- 游戏组件库

#### 掌握造轮子过程--- 单元测试 ----前端工具的辅助开发----   提成段位


### axios ts版本

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

npm install -g semantic-release-cli

semantic-release-cli setup

https://github.com/501981732/ls-cache-files-ts

7. typescript

### axios 实现

- 在浏览器端使用 XMLHttpRequest 对象通讯
- 支持 Promise API
- 支持请求和响应的拦截器
- 支持请求数据和响应数据的转换
- 支持请求的取消
- JSON 数据的自动转换
客户端防止 XSRF


    工具：TypeScript library starter

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

**利用Primise实现异步分离**，在cancelToken中保存一个pending状态的Promise对象，当我们执行cancel的时候能访问到Promise，reslove，这样我们在异步请求的代码中插入这样的代码，在then函数中实现取消的请求逻辑

```
<!--cancelToken是我们请求传入的cancelToken参数：new CancelToken(executor),实例化的时候传入一个executor的函数类型参数，改方法的参数是一个取消函数，我们可以在executor方法执行的内部拿到这个函数，赋值给外面的变量cancel，当我们执行cancel的时候，执行promise的reslove引用，会使promise变成reslove状态，使我们插入的这段代码执行then方法-->
if (cancelToken) {
  cancelToken.promise
    .then(reason => {
      request.abort()
      reject(reason)
    })
}
```

```
CancelToken类的实现
export default class CancelToken {
  promise: Promise<string>
  reason?: string

  constructor(executor: CancelExecutor) {
    let resolvePromise: ResolvePromise
    this.promise = new Promise<string>(resolve => {
      resolvePromise = resolve
    })

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













