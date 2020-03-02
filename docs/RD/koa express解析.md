
先推荐两本书
[Koa.js 设计模式-学习笔记](https://github.com/chenshenhai/koajs-design-note)
[koa2快速入门](https://chenshenhai.github.io/koa2-note/note/start/quick.html)

### koa中间件原理解析
```
//KOA中间件原理解析
const http = require('http')
// 组合中间件
const compose = (middlewareList) => {
    return function(ctx) {
        function dispatch(i) {
            const fn = middlewareList[i]
            try {
                return Promise.resolve(
                    // next 机制
                    // dispatch.bind(null, i + 1) 相当于 中间件中的 next  假如 await next() 则会递归执行中间件
                    fn(ctx, dispatch.bind(null, i + 1)) // promise 经过包裹 保证返回promise对象
                )
            }
            catch (err) {
                return Promise.reject(err)
            }
        }
        return dispatch(0)
    }

}
class Koa2Like {
    constructor() {
        this.middlewareList = []
    }
    // 注册中间件
    use(fn) {
        this.middlewareList.push(fn)
        return this //链式调用
    }
    createCtx(req,res) {
        const ctx = {
            req,
            res
        }
        ctx.query = req.query
        // ...
        return ctx
    }
    handleRequest(ctx, fn) {
        return fn(ctx)
    }
    callback() {
        const fn = compose(this.middlewareList)
        return (req, res) => {
            const ctx = this.createCtx(req, res)
            return this.handleRequest(ctx, fn)
        }
    }
    listen(...args) {
        const server = http.createServer(this.callback())
        server.listen(...args)
    }
}

module.exports = Koa2Like
```
测试：
```
const Koa = require('./../lib/index.js');
const app = new Koa();

// logger
app.use(async (ctx, next) => {
  await next();
  const rt = ctx['X-Response-Time'];
  console.log(`${ctx.req.method} ${ctx.req.url} - ${rt}`);
});

// x-response-time
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx['X-Response-Time'] = `${ms}ms`;
});

// response
app.use(async ctx => {
  ctx.res.end('This is like koa2');
});

app.listen(8000,() => console.log('listen on 8000'));
```

### express 解析

```
const http = require('http')
const slice = Array.prototype.slice
class ExpressLike {
    constructor() {
        // 存放各种方式中间件, 包含path和stack
        this.routes = {
            use: [
                // {
                //     path: '/',
                //     stack: xx
                // }
            ],
            get: [],
            post: [],
        }
    }

    register() {
        let info = {}
        // 第一个参数为字符串，则为局部中间件，否则为全局中间件
        if (typeof arguments[0] === 'string') {
            info.path = arguments[0]
            info.stack  = slice.call(arguments,1)
        } else {
            info.path = '/'
            info.stack  = slice.call(arguments,0)
        }
        return info
    }
    // 分别在各自方法中注册相应的中间件
    //this.routes.use = [
    //     {
    //         path: '/',
    //         stack: [cookieParse,checkLogin]
    //     },
    //     {
    //         path: '/api',
    //         stack: [checkLogin]
    //     }
    // ]
    use() {
        let info = this.register.apply(this, arguments)
        this.routes.use.push(info)
    }
    get() {
        let info = this.register.apply(this, arguments)
        this.routes.get.push(info)
    }
    post() {
        let info = this.register.apply(this, arguments)
        this.routes.post.push(info)
    }
    // 寻找对应匹配的中间件
    // 在相应的方法中 ，正则匹配路由 将对应路由的中间件注册进去
    match(method, url) {
        let stack = []
        if (url === '/favicon.ico') {
            return stack
        }
        let currentRoute = [...this.routes.use,...this.routes[method]]
        currentRoute.forEach(info => {
            // 应正则匹配
            if(url.indexOf(info.path) === 0) {
                // url='/api/blog/list' -> info.path= '/'
                // url='/api/blog/list' -> info.path= '/api'
                // url='/api/blog/list' -> info.path= '/api/api/blog/list'
                stack.push(...info.stack)
                console.log(stack)
            }
        })
        // 结果就是 每个对应路由 对应一个stack的中间件
        return stack
    }
    // next机制核心
    // 假如 [cookieParser,checkLogin,handleRouter]
    // 结合中间件写法理解
    // handle(req, res, stack) {
    //     const next = () => {
    //         // 拿到第一个中间件 执行
    //         const middleware = stack.shift()
    //         if (middleware) {
    //             // 传入 next中间件，使 中间件执行完毕后，递归调用自身
    //             middleware(req, res, next)
    //         }
    //     }
    //     next()
    // }

    handle(req, res, stack) {
        const next = (err) => {
            if (err) {
                return this.handle500(err,req,res,stack)
            }
            const middleware = stack.shift()
            if (middleware) {
                // 传入 next中间件，使 中间件执行完毕后，递归调用自身
                middleware(req, res, next)
            }
        }
        next()
    }

    handle404(req,res) {
        console.log(404)
        // res.end(404)
    }
    // 异常处理中间件
    handle500(err,req,res,stack) {
        stack = stack.filter(middleware => middleware.length === 4)
        const middleware = stack.shift()
        if (middleware) {
            // 传入 next中间件，使 中间件执行完毕后，递归调用自身
            middleware(err,req, res, next)
        }
    }
    // 统一处理处理
    callback() {
        return (req,res) => {
            res.json = (data) => {
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify(data))
            }
            const url = req.url
            const method = req.method.toLowerCase()
            // 当前路由对应的中间件
            const currentStack = this.match(method, url)
            if (currentStack.length) {
                this.handle(req, res, currentStack)
            } else {
                this.handle404(req,res)
            }
        }
    }
    listen(...args) {
        const server = http.createServer(this.callback())
        server.listen(...args)
    }
}


// 工厂 
module.exports = () => {
    return new ExpressLike()
}

```

测试：

```
const express = require('./../lib/index')

// 本次 http 请求的实例
const app = express()

app.use((req, res, next) => {
    console.log('请求开始...', req.method, req.url)
    next()
})

app.use((req, res, next) => {
    // 假设在处理 cookie
    console.log('处理 cookie ...')
    req.cookie = {
        userId: 'abc123'
    }
    next()
})

app.use('/api', (req, res, next) => {
    console.log('处理 /api 路由')
    next()
})

app.get('/api', (req, res, next) => {
    console.log('get /api 路由')
    next()
})

// 模拟登录验证
function loginCheck(req, res, next) {
    setTimeout(() => {
        console.log('模拟登陆成功')
        next()
    })
}

app.get('/api/getCookie', loginCheck, (req, res, next) => {
    console.log('get /api/getCookie')
    res.json({
        errno: 0,
        data: req.cookie
    })
})

app.listen(8000, () => {
    console.log('server is running on port 8000')
})
```