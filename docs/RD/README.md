HELLO

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