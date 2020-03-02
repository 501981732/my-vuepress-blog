## 本篇是《深入浅出nodejs》总结篇

- node适用于IO密集型，不适用于CUP密集型？因为Node是单线程，可以用pm2创建个多线程的~ 或者编写c/c++模块解决，或者利用子进程，将一些NODE进程当成常驻服务进程用于计算，利用进程间的消息来传递结果，将计算和I/O分离，这样还能充分利用多CPUbut归根到底不是做多线程的东西。
- Node面向网络，且擅长并行IO,IO密集的优势主要是在于node利用事件循环的处理能力
- setTimeout0 和process.nextTick()区别
    - 后者更加高效，只会将回调放入队列中，下一轮Tick取出执行，前者采用黑红树的操作，时间复杂度为 O(log(n)),后者0(1)

- setImmediate 和process.nextTick类似
```js
setImmediate(function(){
    console.log('setImmediate')
})

process.nextTick(function() {
    console.log('nextTick')
})
console.log('正常')

'正常'
'nextTick'
'setImmediate'
```

    -   事件循环对观察者的检查是有先后顺序的：*idle观察者*先与*I/O观察者*先于*check观察者*，process.nextTick属于idle观察者，setImmediate属于check观察者。
    -   在实现上：process.nextTick()的回调放在数组，setImmediate回调放在链表
    -   在行为上：每轮循环process.nextTick()会将数组的回调全部执行，setImmediate每轮循环只执行链表中的第一个回调：（**现在版本9.0.0已不是如此，setImmediate也会全部执行完**）

```js
process.nextTick(function() {
    console.log('nextTick1')
})
process.nextTick(function() {
    console.log('nextTick2')
})
//加入两个setImmediate
setImmediate(function(){
    console.log('setImmediate延时执行1')
    //进入下次循环
    process.nextTick(function() {
        console.log('强势插入')
    })
})
setImmediate(function(){
    console.log('setImmediate延时执行2')
})
console.log('正常')
```

## 第四章 异步编程

### 高阶函数：可以把函数当成参数，或者返回值的函数。

```js
function foo() {
    return function() {
        return x
    }
}
function foo(x,bar) {
    return bar(x)
}
```
    结合node最基础的事件模块：事件的处理方式正式基于高阶函数的特性来完成的。可以为相同的事件注册不同的回调。

```js
var emitter = new events.EventEmitter();
emitter.on('a',function() {})
```
### 偏函数：通过预先定义部分参数，来生成一个新的定制函数。

```js
var toString = Object.prototype.toString;
function isString(obj) {
    return toString.call(obj) === '[Object String]'
}
function isFunction(obj) {
    return toString.call(obj) === '[Object Function]'
}
```

    利用偏函数像工厂一样生成很多类似函数

```js
var toString = Object.prototype.toString;
function isType(str) {
    return function(obj) {
        return toString.call(obj) === `[Object ${str}]`
    }
}

var isString = isType('String');
var isFunction = isType('Function');

var flag = isString('sss') or
var flag = isType('String')('sss')
```
### 3.2异步编程的优势难点

    - 优势
    - 难点:
        - 异常处理： try catch无法捕捉异步的错误，Node在异常处理上的规定：把异常作为回调函数的第一个实参换回，若为空则无异常
        - 嵌套过深
        - 阻塞代码 sleep(1000)函数 利用setTimeout()
        - 多线程编程

### 4.3异步编程解决方案

- 发布订阅模式
- Promise/Deferred
- 流程控制库
- 现在还有ES6的gejerator函数和async函数

### 发布订阅模式

    - 继承events模块
    - 利用事件队列解决雪崩问题
    - 多异步之间的协作方案
    - eventProxy原理

### 继承events模块

```js
//util模块有继承的方法
let events = require('events')
let util = require('util')

function Stream() {
    events.EventEmitter.call(this)
}
util.inherits(Stream,events.EventEmitter)

```
### 雪崩问题

    雪崩问题:高访问，大并发量的情况下缓存失效的情况，(服务刚好启动，缓存中又不存在数据)，
    改进方案: step1.加**状态锁** step2.利用once进入 **事件队列**

服务刚好启动，缓存中又不存在数据，如果访问量大，同一SQL会被发送到数据库中反复查询，影响服务的整体性能

```js
//某一条数据库查询语句
var select = function(callback) {
    db.select('SQL',function(results) {
        callback(results)
    })
}
```

```js
var state = 'ready'
var select = function(callback) {
    if (state === 'ready') {
        state = 'pending'
        db.select('SQL',function(results) {
            state = 'ready'
            callback(results)
        })
    }
}
```
但是这种情况下连续多次调用select是有第一次是生效的，后面是没有数据服务的，这个时候可以引入 **事件队列**

    利用once将所有请求的回调都压入事件队列中，利用其只执行一次就会将监视器移除的特点，保证每一个回调都只会被执行一次，对于相同的SQL语句，保证在同一个查询从开始到结束的过程永远只有一次。对于相同的SQL语句，保证听同一个查询从开始到结束过程永远只有一次，SQL在进行查询时，新到来的相同调用只需要在队列中等待数据就绪即可，一旦查询结束，得到的结果会被这些调用同时使用 **节约重复的数据库调用的开销**

由于Node是单线程，无需担心状态同步问题，这种方式可以应用到其他远程调用的场景中，及时外部没有缓存策略，也能节约重复开销。

```js 
var proxy = new events.EventEmitter();
var state = 'ready'
var select = function(callback) {
    proxy.once('selected',callback)
    if (state === 'ready') {
        state = 'pending'
        db.select('SQL',function() {
            proxy.emit('selected')
            state = 'ready'
        })
    }
}
```

### 多异步之间的协作方案

一般事件和监听器是一对多的关系，假如事件和监听器是多对一的关系，如何享受异步I/0带来的性能提升，又能保证良好的编码风格？（多个事件调用其实是并行关系，但是为了解决问题只能串行解决？ no）

假如多个调用并无先后关系，相互之间又无交集，我们需要一个 第三方函数和变量来处理异步协作的结果 --**哨兵变量**

```js
//当模板，数据，本地资源全部就绪之后再渲染页面
 var count = 0;
 var result = {};
 var done = function(key,value) {
    result[key] = value
    count++;
    if (count === 3) {
        //渲染页面
        render(result)
    }
 }
fs.readFile(template_path,'utf8',function(err,temp){
    done('template',temp)
})
db.query(sql,function(err,data){
    done('data',data)
})
I18n.get(function(err,resource){
    done('resource',resource)
})
```

我们可以利用 **偏函数**来处理哨兵变量和第三方函数的关系。

### 利用偏函数完成多对一的收敛，和发布/订阅模式完成一对多的发散

```js
//利用偏函数完成多对一的收敛
function after(timer,callback) {
    let count = 0,result = {};
    return function(key,value) {
        result[key] = value;
        count++
        if (count === timer) {
            callback(result)
        }
    }
}
let done = after(3,render)
//随着业务的扩展，我们可以利用发布/订阅模式，完成多对多的场景

let emitter = new events.EventEmitter()
emitter.on('done',done)
emitter.on('done',other)
fs.readFile(template_path,'utf8',function(err,temp){
    emitter.emit('done',"template",template)
})
db.query(sql,function(err,data){
    emitter.emit('done',"data",data)
})
I18n.get(function(err,resource){
    emitter.emit('done',"resource",resource)
})
```

### EventProxy
上面还有一点优化的地方，就是，我们需要准备done函数，还需要手动一次次把数据传过去，EventProxy模块，作为发布/订阅模式的扩展，可以解决此问题。(前后端都可用)

    **原理** 它在非all事件触发时都会触发一次all事件。EventProxy是将all作为事件流的拦截
```js
var proxy = new EventProxy()
proxy.all('template','data','resource',function(template,data,resource){
    // todo
})
fs.readFile(template_path,'utf8',function(err,temp){
    proxy.emitter("template",template)
})
db.query...
...
```

## node内存控制

<a href='/img/node内存控制.pdf'>node内存控制</a>

<embed src="/img/node内存控制.pdf" width="500" height="375" type="application/pdf">

## buffer

<a href='/img/Buffer.pdf'>Buffer</a>

<embed src="/img/Buffer.pdf" width="500" height="375" type="application/pdf">

## 构建WEB应用

<a href='/img/构建WEB应用.pdf'>构建WEB应用</a>

<embed src="/img/构建WEB应用.pdf" width="500" height="375" type="application/pdf">
