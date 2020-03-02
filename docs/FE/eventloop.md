> 老生常谈的一个问题，在其他博客里面也或多或少聊到过，这里再大致总结下

## 浏览器中的eventloop

<img src='/img/EventLoop.webp'  />

### 执行栈 call Stack
    执行栈认为是一个存储函数调用的栈结构，遵循先进后出的原则。

当我们执行 JS 代码的时候其实就是往执行栈中放入函数，那么遇到异步代码的时候该怎么办？其实当遇到异步的代码时，会被挂起并在需要执行的时候加入到 Task（有多种 Task） 队列中。一旦执行栈为空，Event Loop 就会从 Task 队列中拿出需要执行的代码并放入执行栈中执行，所以本质上来说 JS 中的异步还是同步行为

    当我们使用递归的时候，因为栈可存放的函数是有限制的，一旦存放了过多的函数且没有得到释放的话，就会出现爆栈的问题

### 任务队列 task queue

    microtask 微任务包括 process.nextTick ，promise ，MutationObserver
    macrotask 宏任务包括 script ， setTimeout ，setInterval ，setImmediate ，I/O ，UI rendering 

### event loop执行顺序

- 执行同步代码，script ,(宏任务)，往执行栈入栈出栈
- 执行完所有同步代码，任务栈为空，查询是否有异步代码需要执行
- 执行所有微任务
- 执行完所有微观任务，如有必要执行渲染页面(性能优化点，所有页面渲染前最佳时机是在微任务处理，如果是在宏任务处理的话，还要等又一轮的eventloop)
- 开始下一轮Event Loop ,执行红任务中的异步代码，也就是 setTimeout中的回调




## node中 event loop

    Node 中的 Event Loop 和浏览器中的是完全不相同的东西。

<img src='/img/node_eventloop.webp'  />

Node 的 Event Loop 分为 6 个阶段，它们会`按照顺序反复运行`。每当进入某一个阶段的时候，都会从对应的回调队列中取出函数去执行。当队列为空或者执行的回调函数数量到达系统设定的阈值，就会进入下一阶段。

- timers

timers 阶段会执行 setTimeout 和 setInterval 回调，并且是由 poll 阶段控制的。

同样，在 Node 中定时器指定的时间也不是准确时间，只能是尽快执行

- pending callbacks

 I/O 阶段会处理一些上一轮循环中的少数未执行的 I/O 回调


- idle,prepare
  
- poll 
  
系统会做两件事
1. 回到 timer 阶段执行回调
2. 执行 I/O 回调
如果 poll 队列不为空，会遍历回调队列并同步执行，直到队列为空或者达到系统限制
如果 poll 队列为空时，会有两件事发生

    1. 如果有 setImmediate 回调需要执行，poll 阶段会停止并且进入到 check 阶段执行回调
    2. 如果没有 setImmediate 回调需要执行，会等待回调被加入到队列中并立即执行回调，这里同样会有个超时时间设置防止一直等待下去
    3. 
当然设定了 timer 的话且 poll 队列为空，则会判断是否有 timer 超时，如果有的话会回到 timer 阶段执行回调

- check
  
check 阶段执行 setImmediate

- close callbacks
  
  close callbacks 阶段执行 close 事件




### process.nextTick

这个函数其实是独立于 Event Loop 之外的，它有一个自己的队列，当每个阶段完成后，如果存在 nextTick 队列，就会清空队列中的所有回调函数，并且优先于其他 microtask 执行。