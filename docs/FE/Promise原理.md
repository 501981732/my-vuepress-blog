### Promise

[promise](http://es6.ruanyifeng.com/#docs/promise)

[Promises/A+](https://promisesaplus.com/)
[Promises/A+翻译](http://www.ituring.com.cn/article/66566)
[30分钟，让你彻底明白Promise原理](https://segmentfault.com/a/1190000009478377?utm_source=tag-newest)
[深入理解Promise](https://mengera88.github.io/2017/05/18/Promise%E5%8E%9F%E7%90%86%E8%A7%A3%E6%9E%90/)
[JavaScript Promises ... In Wicked Detail](https://www.mattgreer.org/articles/promises-in-wicked-detail/)
what where when who why how

#### 1.promise是什么

> promise: 简单说就是一个容器，里面保存着某个未来才会结束的事件（通常是一个异步操作）的结果。从语法上说，Promise 是一个对象，从它可以获取异步操作的消息。是ES6解决“回调地狱”的一种方式。

promise特点：

1. 对象的状态不受外界影响。Promise对象代表一个异步操作，有三种状态：pending（进行中）、fulfilled（已成功）和rejected（已失败）。
2. ）一旦状态改变，就不会再变，任何时候都可以得到这个结果。Promise对象的状态改变，只有两种可能：从pending变为fulfilled和从pending变为rejected。

#### 2.promise的用法

先来看下对比：

```js
回调地狱写法:
请求1(function(请求结果1){
    请求2(function(请求结果2){
        请求3(function(请求结果3){
            请求4(function(请求结果4){
                请求5(function(请求结果5){
                    ...
                })
            })
        })
    })
})

promise写法：
new Promise(step1)
    .then(step2(result_step1))
    .then(step3(result_step2))
    .then(step4(result_step3))
    .then(step5(result_step4))
    .catch(处理异常(异常信息))
async写法：
(async ()=>{
    let result_step1 = await step1();
    let result_step2 = await step2(result_step1);
    let result_step3 = await step3(result_step2);
    let result_step4 = await step4(result_step3);
})();
```

**处理多个相关联的异步请求**
```js
const request = url => {
    return new Promise((reslove,reject) => {
        $.get(url, data => reslove(data))
        })
}
request(url1).then(data1 => {
    return request(data1.url)
    }).then(data2 => {
    return request(data2.url)
    }).catch(err => throw new Error(err))
```
##### promise原型方法
```js
    onFulfilled接受promise成功的值
    onRejected 接受promise失败的结果
```
1. Promise.prototype.then()
    promise.then(onFulfilled, onRejected)
2. Promise.prototype.catch()
    相当于promise.then(null, onRrejected);
3. Promise.prototype.finally() //指定不管 Promise 对象最后状态如何，都会执行的操作(es2018引入)
4. promise chain //then方法返回的是一个新的Promise实例（注意，不是原来那个Promise实例）。因此可以采用链式写法，即then方法后面再调用另一个then方法。
```js
promise.then(onFulfilled, onRejected) 
//这里面onRejected 并不能捕捉onFulfilled的结果

//推荐写法 
//1. onRejected不仅能捕捉promise错误 还可以捕捉onFulfilled的错误
//2. 也更接近同步的写法（try/catch）
promise
    .then(onFulfilled)
    .catch(onRejected)


// finally 本质上是then方法的特例
promise
    .finally(() => {
});

// 等同于
promise
.then(
  result => {
    // 语句
    return result;
  },
  error => {
    // 语句
    throw error;
  }
);
// 实现
Promise.prototype.finally = function (callback) {
  let P = this.constructor;
  return this.then(
    value  => P.resolve(callback()).then(() => value),
    reason => P.resolve(callback()).then(() => { throw reason })
  );
};

```
##### Promise静态方法
1. Promise.all() 

    将多个promise实例包装成一个promise实例，参数为每个成员都是promise的数组（或者具有Iterator接口的数据结构）
```js
    // 生成一个Promise对象的数组
    const promises = [2, 3, 5, 7, 11, 13].map(function (id) {
      return request('/post/' + id + ".json");
    });

    Promise.all(promises).then(function (posts) {
      // ...
    }).catch(function(reason){
      // ...
    });
```
**只有全部为reslove或者一个reject才能调用，通常用于多个并行异步操作.**

2. Promise.race() 同Promise.all 区别 **当有一个promise对象进入 FulFilled 或者 Rejected 状态的话，就会继续进行后面的处理**

3. Promise.reslove() //创建一个promise实例（fulfilled状态）
    Promise.reslove('wxj')相当于 new Promise(resolve => resolve('wxj'))
4. Promise.reject() //创建一个promise实例（reject状态）
    Promise.reject('wxj')相当于 new Promise((resolve, reject) => reject('wxj'))
5. Promise.try() 让同步函数同步执行，异步函数异步执行。
```js
// 只能捕捉同步异常
database.users.get({id: userId})
.then(...)
.catch(...)
//可以捕捉同步异常或异步异常
Promise.try(() => database.users.get({id: userId}))
  .then(...)
  .catch(...)
```
#### 3.promise的应用

加载图片封装成promise

```js
const preloadImage = function (path) {
  return new Promise(function (resolve, reject) {
    const image = new Image();
    image.onload  = resolve;
    image.onerror = reject;
    image.src = path;
  });
};
```
### 4.promise的实现
```
function getUserId() {
    return new Promise(function(resolve) {
        //异步请求
        http.get(url, function(results) {
            resolve(results.id)
        })
    })
}

getUserId().then(function(id) {
    
})
```
#### first 极简Promise   then方法可链式调用
```js
1. 注册then 方法，将promise异步操作成功的回调放入callbacks队列
2. 创建promise时会像promise传入一个以reslove函数为参数的函数~接受一个value代表异步操作成功之后的结果，当操作成功之后会执行reslove方法（其实执行的是callbacks队列中的方法）
// 极简
 function PromiseLike(fn) {
    var value = null
    var callbacks = [] //

    this.then = (onFulfilled) => {
        callbacks.push(onFulfilled)
        // promise可链式调用 return this 返回新的promise
        return this
    }
    function reslove(value) {
        callbacks.forEach(callback => {
            callback(value)
        })
    }

    fn(resolve)
 }
//首先new Promise时，传给promise的函数发送异步请求接着调用promise对象的then属性注册请求成功的回调函数，然后当异步请求发送成功时调用resolve(results.id)方法, 该方法执行then方法注册的回调数组
```
#### 加入延时 确保reslove执行前，then方法都已经注册

假如then方法还没有注册就已经执行reslove了？ 比如说promise内部是同步
pro
```js
getSomethingSync().then()

//Promises/A+规范明确要求回调需要通过异步方式执行，用以保证一致可靠的执行顺序。因此我们要加入一些处理，保证在resolve执行之前，then方法已经注册完所有的回调
//将reslove中事件放入JS任务队列的末尾，下一个Event loop时执行
function resolve(value) {
    setTimeout(function() {
        callbacks.forEach(function (callback) {
            callback(value);
        });
    }, 0)
}

```

#### 加入状态 pending fulfilled rejected
> 我们在PromiseLike 注册的then的callback在异步操作成功之后都会执行，但是Promise在异步操作成功之后再调用then也不会执行。so加入状态

> Promises/A+规范中的2.1Promise States中明确规定了，pending可以转化为fulfilled或rejected并且只能转化一次。

```js
// reslove执行时，会把状态改为fulfilled,在此之后调用then添加的新回调都会立刻执行
function PromiseLike(fn) {
    let state = 'pending',
        value = null,
        callbacks = [];
        this.then = function(onFulfilled) {
            // 状态未改变之前 then方法只是把回调注册到callbacks
            if (state === 'pending') {
                callbacks.push(onFulfilled);
                return this;
            }
            // 状态改变之后添加的回调都会立即执行
            onFulfilled(value);
            return this;
        }
        function reslove(newValue) {
            value = newValue;
            state = 'fulfilled';
            setTimeout(function(){
                callbacks.forEach((callback) => {
                    callback(value)
                })
        }
        fn(resolve)
}
```
#### 链式promise

> promise中then方法里面注册的若还是个Promise,当上一个promise状态从pending状态达到fulfilled,就会开始下一个promise，这就是所谓的链式Promise。

```js
getUserId().then(getUserJobById).then()
function getUserJobById(id) {
    return new Promise(function (resolve) {
        http.get( 'xxx'+ id, function(res) {
            resolve(res);
        });
    });
}
```
**难点：如何衔接当前promise和后面的promise**

Promises/A+规范中的2.2.7: then方法里面return一个promise.

```js
2.2.7 then must return a promise [3.3].

promise2 = promise1.then(onFulfilled, onRejected);

2.2.7.1 If either onFulfilled or onRejected returns a value x, run the Promise Resolution Procedure [[Resolve]](promise2, x).

2.2.7.2 If either onFulfilled or onRejected throws an exception e, promise2 must be rejected with e as the reason.

2.2.7.3 If onFulfilled is not a function and promise1 is fulfilled, promise2 must be fulfilled with the same value as promise1.

2.2.7.4 If onRejected is not a function and promise1 is rejected, promise2 must be rejected with the same reason as promise1.
```


```js
function PromiseLike(fn) {
    var state = 'pending',
        value = null,
        callbacks = [];
    this.then = function (onFulfilled) {
        return new PromiseLike(function (resolve) {
            handle({
                onFulfilled: onFulfilled || null,
                resolve: resolve
            });
        });
    };
    function handle(callback) {
        if (state === 'pending') {
            callbacks.push(callback);
            return;
        }
        //如果then中没有传递任何东西
        if(!callback.onFulfilled) {
            callback.resolve(value);
            return;
        }
        var ret = callback.onFulfilled(value);
        callback.resolve(ret);
    }
    
    function resolve(newValue) {
        if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
            var then = newValue.then;
            if (typeof then === 'function') {
                then.call(newValue, resolve);
                return;
            }
        }
        state = 'fulfilled';
        value = newValue;
        setTimeout(function () {
            callbacks.forEach(function (callback) {
                handle(callback);
            });
        }, 0);
    }
    fn(resolve);
}
```
1. then方法中，创建并返回了新的Promise实例，这是串行Promise的基础，并且支持链式调用。

2. handle方法是promise内部的方法。then方法传入的形参onFulfilled以及创建新Promise实例时传入的resolve均被push到当前promise的callbacks队列中，这是衔接当前promise和后邻promise的关键所在（这里一定要好好的分析下handle的作用）。

3. getUserId生成的promise（简称getUserId promise）异步操作成功，执行其内部方法resolve，传入的参数正是异步操作的结果id

4. 调用handle方法处理callbacks队列中的回调：getUserJobById方法，生成新的promise（getUserJobById promise）

5. 执行之前由getUserId promise的then方法生成的新promise(称为bridge promise)的resolve方法，传入参数为getUserJobById promise。这种情况下，会将该resolve方法传入getUserJobById promise的then方法中，并直接返回。

6. 在getUserJobById promise异步操作成功时，执行其callbacks中的回调：getUserId bridge promise中的resolve方法

7. 最后执行getUserId bridge promise的后邻promise的callbacks中的回调。

#### 错误处理
```js
function Promise(fn) {
    var state = 'pending',
        value = null,
        callbacks = [];
    this.then = function (onFulfilled, onRejected) {
        return new Promise(function (resolve, reject) {
            handle({
                onFulfilled: onFulfilled || null,
                onRejected: onRejected || null,
                resolve: resolve,
                reject: reject
            });
        });
    };
    function handle(callback) {
        if (state === 'pending') {
            callbacks.push(callback);
            return;
        }
        var cb = state === 'fulfilled' ? callback.onFulfilled : callback.onRejected,
            ret;
        if (cb === null) {
            cb = state === 'fulfilled' ? callback.resolve : callback.reject;
            cb(value);
            return;
        }
        ret = cb(value);
        callback.resolve(ret);
    }
    function resolve(newValue) {
        if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
            var then = newValue.then;
            if (typeof then === 'function') {
                then.call(newValue, resolve, reject);
                return;
            }
        }
        state = 'fulfilled';
        value = newValue;
        execute();
    }
    function reject(reason) {
        state = 'rejected';
        value = reason;
        execute();
    }
    function execute() {
        setTimeout(function () {
            callbacks.forEach(function (callback) {
                handle(callback);
            });
        }, 0);
    }
    fn(resolve, reject);
}
```
#### 异常处理

```js
function handle(callback) {
    if (state === 'pending') {
        callbacks.push(callback);
        return;
    }
    var cb = state === 'fulfilled' ? callback.onFulfilled : callback.onRejected,
        ret;
    if (cb === null) {
        cb = state === 'fulfilled' ? callback.resolve : callback.reject;
        cb(value);
        return;
    }
    try {
        ret = cb(value);
        callback.resolve(ret);
    } catch (e) {
        callback.reject(e);
    } 
}
```
#### 总结：
1. 我们返回来根据执行promise的逻辑来看源码就省力很多，promise的then仅仅是注册了后续要执行的代码，真正执行实在reslove方法里面执行的。
2. Promise的实现过程中，主要是用了设计模式中的观察者模式
    - 通过Promise.prototype.then和Promise.prototype.catch方法将观察者方法注册到被观察者Promise对象中，同时返回一个新的Promise对象，一遍可以链式调用。
    - 被观察者管理内部pending,fulfilled和rejected的状态转变，同时通过构造函数中传递的reslove和reject方法以主动触发状态转变和通知观察者。

