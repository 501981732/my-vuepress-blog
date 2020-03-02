http://note.youdao.com/noteshare?id=fa8f6bab2aecfc328c00e328fedb01bb
## 大规模nodejs项目构建和优化
1. java + node去掉中间不用数据
2. vue 做ssr node做
3. node 做proxy   bff backend for frontend
4. 区块链用node


---
内容
1. nodejs异步io原理浅析及优化方案
2. nodejs内存管理机制及内存优化
3. 大规模node站点结构原理分析
4. 服务器集群管理与node集群的应用
5. UV过千万的node站点真身

---

异步io好处
1. 前端通过异步io消除ui阻塞
2. 同步（m+n） 异步 max(m,n)
3. 随着业务的负责会引入分布式系统，扩大第二条
4. io是昂贵的，分布式io更昂贵
5. nodejs适应于io密集型不适合cpu密集型 （单线程，一个就卡死了，写法）


---
node对异步IO的实现

完美的异步IO应该是应用程序发起非阻塞调用，无需通过遍历或者时间幻想登方式轮询

---
几个特殊API
1. settimeout setinterval 线程池不参与
2. process.nextTick() 实现类似settimeout(()=>{},0),每次放到队列中，下一轮循环中取出。
3. setImterval()比nextTick（）优先级低
4. node如何实现一个sleep

```
async function test() {
    console.log('hello')
    await sleep(1000)
    console.log('world')
    }
function sleep(ms) {
    return new Promise(resolve=>setTimeout(resolve,ms))
}
test()

//方法2
function sleep(ms) {
  var start = Date.now(), expire = start + ms;
  while (Date.now() < expire) ;
  return;
}
```
---
常用node处理异步手段
1. step wind (提供等待的异步库)   bigpipe Q.js
2. Async Await
3. promise/defferred 是一种先执行异步调用，延迟传递的处理方式，Promise是高级借口，⌚事件是低级借口，低级借口可以构建更多复杂的场景，高级借口一旦定义，不太容易变化，不再有低级借口的灵活性，但对于解决问题十分有效
4. 由于node基于 v8,暂时不支持协程，执行过程类似于子例程，不带返回值的函数调用
5. 一个程序可以包括多个协程，    多个线程相独立，有自己的上下文，切换受系统控制，而协程也相对独立，有自己的上下文，切换由自己控制，


---

内存管理与优化

1。 V8垃圾回收机制
-     node使用js在服务端操作大内存对象收到了一定的限制，64位系统下约1.4G 32位操作系统下0.7G
-     Process.memoryUsage -> rss, heaptTotal heapUsed
-     V8垃圾回收策略主要基于分代式垃圾回收机制，在自动垃圾回收的演变中，人们发现没有一中垃圾回收算法能胜任所有场景，V8中内存分位新生代和老生带两代。 新生代为存活时间较短的对象，老生代中为存活时间较长的对象
    - 新生代Scavenge算法
    - 老生代 采用 Mark-Sweep（清扫）和 Mark-compact（压紧） 标记清除，然后 Mark-compact 连续

---

常见内存泄露问题
1. 无限制增长的数组
2. 无限制设置属性和值
3. 任何魔抗内的私有变量和方法均是永驻内存的 a = null
4. 大循环无GC机会


--- 
经典的MVC框架

Model-View-Controller
model就是后台请求的数据


---

node微服务

---
上线
1. 前端工程化的搭载动态文件的,AP分析压缩打包合并至CDN
2. 单测，压测性能分析工具发现bug
3. 编写 nginx-conf 实现负载均衡和反向代理 (node很少直接做server，用nginx做网络层代理，pm2做cpu的负载均衡)
4. pm2启动应用程序小流浪灰度上线，修复BUG

---
PV过千万的node站点真身
1. 图2


---



