# 缓存
> 通过一些案例帮助理解分类各种缓存 以及缓存的应用模式

> cache  请求头  preload prefetch ServerWorker

## 前端/后端缓存
> 网络请求基本分三步： 请求，处理，响应
1. 后端缓存：主要基础在“处理”这一步骤，通过保留数据库连接，存储处理结果等方式缩短处理时间。使尽快进入响应阶段
2. 前端缓存：在 “请求阶段” 浏览器可以通过存储结果的方式直接使用资源省去了发送请求；在“响应阶段”需要浏览器和服务器共同配合，较少响应内容来缩短传输时间。

- 按缓存位置分类（memory cache, disk cache, Service Worker等）
- 按失效策略分类（Cache-Control, ETag）

## 按存储位置

我看过的大部分讨论缓存的文章会直接从 HTTP 协议头中的缓存字段开始，例如 Cache-Control, ETag, max-age 等。但偶尔也会听到别人讨论 memory cache, disk cache 等。那这两种分类体系究竟有何关联？是否有交叉？(我个人认为这是本文的最大价值所在，因为在写之前我自己也是被两种分类体系搞的一团糟)

实际上，HTTP 协议头的那些字段，都属于 disk cache 的范畴，是几个缓存位置的其中之一。因此本着从全局到局部的原则，我们应当先从缓存位置开始讨论。等讲到 disk cache 时，才会详细讲述这些协议头的字段及其作用。

我们可以在 Chrome 的开发者工具中，Network -> Size 一列看到一个请求最终的处理方式：如果是大小 (多少 K， 多少 M 等) 就表示是网络请求，否则会列出 from memory cache, from disk cache 和 from ServiceWorker。

它们的优先级是：(由上到下寻找，找到即返回；找不到则继续)

- Service Worker
- Memory Cache
- Disk Cache
- 网络请求   
 
### momery cache 

memory cache 是内存中的缓存，(与之相对 disk cache 就是硬盘上的缓存)。按照操作系统的常理：先读内存，再读硬盘。

几乎所有的网络请求资源都会被浏览器自动加入到 memory cache 中。但是也正因为数量很大而且浏览器占用的内存不能无限扩大这样两个因素，memory cache 注定只能是个“短期存储”。常规情况下，浏览器的 TAB 关闭后该次浏览的 memory cache 便告失效 (为了给其他 TAB 腾出位置)。而如果极端情况下 (例如一个页面的缓存就占用了超级多的内存)，那可能在 TAB 没关闭之前，排在前面的缓存就已经失效了。

刚才提过，几乎所有的请求资源 都能进入 memory cache，这里细分一下主要有两块：

**preloader**

熟悉浏览器处理流程的同学们应该了解，在浏览器打开网页的过程中，会先请求 HTML 然后解析。之后如果浏览器发现了 js, css 等需要解析和执行的资源时，它会使用 CPU 资源对它们进行解析和执行。在古老的年代(大约 2007 年以前)，“请求 js/css - 解析执行 - 请求下一个 js/css - 解析执行下一个 js/css” 这样的“串行”操作模式在每次打开页面之前进行着。很明显在解析执行的时候，网络请求是空闲的，这就有了发挥的空间：我们能不能一边解析执行 js/css，一边去请求下一个(或下一批)资源呢？

这就是 preloader 要做的事情。不过 preloader 没有一个官方标准，所以每个浏览器的处理都略有区别。例如有些浏览器还会下载 css 中的 @import 内容或者 video标签 的 poster等。

而这些被 preloader 请求过来的资源就会被放入 memory cache 中，供之后的解析执行操作使用。

**preload** (虽然看上去和刚才的 preloader 就差了俩字母)。实际上这个大家应该更加熟悉一些，例如 ```<link rel="preload">```。这些显式指定的预加载资源，也会被放入 memory cache 中。

memory cache 机制保证了一个页面中如果有两个相同的请求 (例如两个 src 相同的 <img>，两个 href 相同的 <link>)都实际只会被请求最多一次，避免浪费。

不过在匹配缓存时，除了匹配完全相同的 URL 之外，还会比对他们的类型，CORS 中的域名规则等。因此一个作为脚本 (script) 类型被缓存的资源是不能用在图片 (image) 类型的请求中的，即便他们 src 相等。

在从 memory cache 获取缓存内容时，浏览器会忽视例如 max-age=0, no-cache 等头部配置。例如页面上存在几个相同 src 的图片，即便它们可能被设置为不缓存，但依然会从 memory cache 中读取。这是因为 memory cache 只是短期使用，大部分情况生命周期只有一次浏览而已。而 max-age=0 在语义上普遍被解读为“不要在下次浏览时使用”，所以和 memory cache 并不冲突。

但如果站长是真心不想让一个资源进入缓存，就连短期也不行，那就需要使用 no-store。存在这个头部配置的话，即便是 memory cache 也不会存储，自然也不会从中读取了。(后面的第二个示例有关于这点的体现)

### disk cache

disk cache 也叫 HTTP cache，顾名思义是存储在硬盘上的缓存，因此它是持久存储的，是实际存在于文件系统中的。而且它允许相同的资源在跨会话，甚至跨站点的情况下使用，例如两个站点都使用了同一张图片。

disk cache 会严格根据 HTTP 头信息中的各类字段来判定哪些资源可以缓存，哪些资源不可以缓存；哪些资源是仍然可用的，哪些资源是过时需要重新请求的。当命中缓存之后，浏览器会从硬盘中读取资源，虽然比起从内存中读取慢了一些，但比起网络请求还是快了不少的。绝大部分的缓存都来自 disk cache。

关于 HTTP 的协议头中的缓存字段，我们会在稍后进行详细讨论。

凡是持久性存储都会面临容量增长的问题，disk cache 也不例外。在浏览器自动清理时，会有神秘的算法去把“最老的”或者“最可能过时的”资源删除，因此是一个一个删除的。不过每个浏览器识别“最老的”和“最可能过时的”资源的算法不尽相同，可能也是它们差异性的体现。

### Service Worker

上述的缓存策略以及缓存/读取/失效的动作都是由浏览器内部判断 进行的，我们只能设置响应头的某些字段来告诉浏览器，而不能自己操作。举个生活中去银行存/取钱的例子来说，你只能告诉银行职员，我要存/取多少钱，然后把由他们会经过一系列的记录和手续之后，把钱放到金库中去，或者从金库中取出钱来交给你。

但 Service Worker 的出现，给予了我们另外一种更加灵活，更加直接的操作方式。依然以存/取钱为例，我们现在可以绕开银行职员，自己走到金库前(当然是有别于上述金库的一个单独的小金库)，自己把钱放进去或者取出来。因此我们可以选择放哪些钱(缓存哪些文件)，什么情况把钱取出来(路由匹配规则)，取哪些钱出来(缓存匹配并返回)。

Service Worker 能够操作的缓存是有别于浏览器内部的 memory cache 或者 disk cache 的。我们可以从 Chrome 的 F12 中，Application -> Cache Storage 找到这个单独的“小金库”。除了位置不同之外，这个缓存是永久性的，即关闭 TAB 或者浏览器，下次打开依然还在(而 memory cache 不是)。有两种情况会导致这个缓存中的资源被清除：手动调用 API cache.delete(resource) 或者容量超过限制，被浏览器全部清空。

如果 Service Worker 没能命中缓存，一般情况会使用 fetch() 方法继续获取资源。这时候，浏览器就去 memory cache 或者 disk cache 进行下一次找缓存的工作了。注意：经过 Service Worker 的 fetch() 方法获取的资源，即便它并没有命中 Service Worker 缓存，甚至实际走了网络请求，也会标注为 from ServiceWorker。这个情况在后面的第三个示例中有所体现。

### 请求网络

如果一个请求在上述 3 个位置都没有找到缓存，那么浏览器会正式发送网络请求去获取内容。之后容易想到，为了提升之后请求的缓存命中率，自然要把这个资源添加到缓存中去。具体来说：

- 根据 Service Worker 中的 handler 决定是否存入 Cache Storage (额外的缓存位置)。
- 根据 HTTP 头部的相关字段(Cache-control, Pragma 等)决定是否存入 disk cache。
- memory cache 保存一份资源 的引用，以备下次使用。

## 按失效策略分类

- 强制缓存 (也叫强缓存)
- 对比缓存 (也叫协商缓存)

memory cache 是浏览器为了加快读取缓存速度而进行的自身的优化行为，不受开发者控制，也不受 HTTP 协议头的约束，算是一个黑盒。Service Worker 是由开发者编写的额外的脚本，且缓存位置独立，出现也较晚，使用还不算太广泛。所以我们平时最为熟悉的其实是 disk cache，也叫 HTTP cache (因为不像 memory cache，它遵守 HTTP 协议头中的字段)。平时所说的强制缓存，对比缓存，以及 Cache-Control 等，也都归于此类。
### 强制缓存

强制缓存的含义是，当客户端请求后，会先访问缓存数据库看缓存是否存在。如果存在则直接返回；不存在则请求真的服务器，响应后再写入缓存数据库 （不可能所有的服务器都直接访问服务器，缓存是必做的 为了缓解服务器的压力）

强制缓存直接减少请求数，是提升最大的缓存策略。 它的优化覆盖了文章开头提到过的请求数据的全部三个步骤。如果考虑使用缓存来优化网页性能的话，强制缓存应该是首先被考虑的。

#### Expires

这是 HTTP 1.0 的字段，表示缓存到期时间，是一个绝对的时间 (当前时间+缓存时间)，如
可以造成强制缓存的字段是 Cache-control 和 Expires。
```
Expires: Thu, 10 Nov 2017 08:45:11 GMT
```

在响应消息头中，设置这个字段之后，就可以告诉浏览器，在未过期之前不需要再次请求。
缺点： 
    1. 由于是绝对时间，用户可能会将客户端本地的时间进行修改，而导致浏览器判断缓存失效，重新请求该资源。此外，即使不考虑自信修改，时差或者误差等因素也可能造成客户端与服务端的时间不一致，致使缓存失效。
    2.  写法太复杂了。表示时间的字符串多个空格，少个字母，都会导致非法属性从而设置失效。

#### Cache-control

已知Expires的缺点之后，在HTTP/1.1中，增加了一个字段Cache-control，该字段表示资源缓存的最大有效时间，在该时间内，客户端不需要向服务器发送请求

前者是绝对时间 后者是相对时间
```
Cache-control: max-age=2592000
```

- max-age：即最大有效时间
- must-revalidate：如果超过了 max-age的时间，浏览器必须向服务器发送请求，验证资源是否还有效。
- no-cache：虽然字面意思是“不要缓存”，但实际上还是要求客户端缓存内容的，只是是否使用这个内容由后续的对比来决定。
- no-store: 真正意义上的“不要缓存”。所有内容都不走缓存，包括强制和对比。
- public：所有的内容都可以被缓存 (包括客户端和代理服务器， 如 CDN)
- private：所有的内容只有客户端才可以缓存，代理服务器不能缓存。默认值。

这些值可以混合使用，例如 Cache-control:public, max-age=2592000。在混合使用时，它们的优先级如下图：
<img src="https://raw.githubusercontent.com/501981732/tips/master/images/1.jpeg" alt="">
这里有一个疑问：max-age=0 和 no-cache 等价吗？从规范的字面意思来说，max-age 到期是 应该(SHOULD) 重新验证，而 no-cache 是 必须(MUST) 重新验证。但实际情况以浏览器实现为准，大部分情况他们俩的行为还是一致的。（如果是 max-age=0, must-revalidate 就和 no-cache 等价了）

顺带一提，在 HTTP/1.1 之前，如果想使用 no-cache，通常是使用 Pragma 字段，如 Pragma: no-cache(这也是 Pragma 字段唯一的取值)。但是这个字段只是浏览器约定俗成的实现，并没有确切规范，因此缺乏可靠性。它应该只作为一个兼容字段出现，在当前的网络环境下其实用处已经很小。

总结：自从 HTTP/1.1 开始，Expires 逐渐被 Cache-control 取代。Cache-control 是一个相对时间，即使客户端时间发生改变，相对时间也不会随之改变，这样可以保持服务器和客户端的时间一致性。而且 Cache-control 的可配置性比较强大。

### 对比缓存 (也叫协商缓存)

当强制缓存失效(超过规定时间)时，就需要使用对比缓存，由服务器决定缓存内容是否失效。

流程上说，浏览器先请求缓存数据库，返回一个缓存标识。之后浏览器拿这个标识和服务器通讯。如果缓存未失效，则返回 HTTP 状态码 304 表示继续使用，于是客户端继续使用缓存；如果失效，则返回新的数据和缓存规则，浏览器响应数据后，再把规则写入到缓存数据库。

对比缓存在请求数上和没有缓存是一致的，但如果是 304 的话，返回的仅仅是一个状态码而已，并没有实际的文件内容，因此 在响应体体积上的节省是它的优化点。它的优化覆盖了文章开头提到过的请求数据的三个步骤中的最后一个：“响应”。通过减少响应体体积，来缩短网络传输时间。所以和强制缓存相比提升幅度较小，但总比没有缓存好。

对比缓存是可以和强制缓存一起使用的，作为在强制缓存失效后的一种后备方案。实际项目中他们也的确经常一同出现。

#### 1.Last-Modified & If-Modified-Since
服务器通过 Last-Modified 字段告知客户端，资源最后一次被修改的时间
```
Last-Modified: Mon, 10 Nov 2018 09:10:11 GMT
```

浏览器将这个值和内容一起记录在缓存数据库中。

下一次请求相同资源时时，浏览器从自己的缓存中找出“不确定是否过期的”缓存。因此在请求头中将上次的 Last-Modified 的值写入到请求头的 If-Modified-Since 字段

服务器会将 If-Modified-Since 的值与 Last-Modified 字段进行对比。如果相等，则表示未修改，响应 304；反之，则表示修改了，响应 200 状态码，并返回数据。

缺点：
- 如果资源更新的速度是秒以下单位，那么该缓存是不能被使用的，因为它的时间单位最低是秒。

- 如果文件是通过服务器动态生成的，那么该方法的更新时间永远是生成的时间，尽管文件可能没有变化，所以起不到缓存的作用。

#### 2.Etag & If-None-Match
为了解决上述问题，出现了一组新的字段 Etag 和 If-None-Match

Etag 存储的是文件的特殊标识(一般都是 hash 生成的)，服务器存储着文件的 Etag 字段。之后的流程和 Last-Modified 一致，只是 Last-Modified 字段和它所表示的更新时间改变成了 Etag 字段和它所表示的文件 hash，把 If-Modified-Since 变成了 If-None-Match。服务器同样进行比较，命中返回 304, 不命中返回新资源和 200。

Etag 的优先级高于 Last-Modified

<img src="https://raw.githubusercontent.com/501981732/tips/master/images/cache-11.jpg" alt="">
## 总结

当浏览器请求资源时

1. 调用 Service Worker 的 fetch 事件响应
2. 查看 memory cache
3. 查看 disk cache。这里又细分：
    - 如果有强制缓存且未失效，则使用强制缓存，不请求服务器。这时的状态码全部是 200
    - 如果有强制缓存已失效，使用对比缓存，比较后确定 304 还是 200
4. 发送网络请求，等待网络响应
5. 把响应内容存入 disk cache (如果 HTTP 头信息配置可以存的话)
6. 把响应内容 的引用 存入 memory cache (无视 HTTP 头信息的配置)
7. 把响应内容存入 Service Worker 的 Cache Storage (如果 Service Worker 的脚本调用了 cache.put())

## 实战

### memory cache & disk cache

我们写一个简单的 index.html，然后引用 3 种资源，分别是 index.js, index.css 和 mashroom.jpg。

我们给这三种资源都设置上 Cache-control: max-age=86400，表示强制缓存 24 小时。以下截图全部使用 Chrome 的隐身模式。

第一次毫无意外的全部走网络请求，因为什么缓存都还没有。

<img src="https://raw.githubusercontent.com/501981732/tips/master/images/cache-1.png" alt="">

第二次：刷新三个请求都来自 memory cache。因为我们没有关闭 TAB，所以浏览器把缓存的应用加到了 memory cache。(耗时 0ms，也就是 1ms 以内)

<img src="https://raw.githubusercontent.com/501981732/tips/master/images/cache-2.png" alt="">

第三次：关闭 TAB，打开新 TAB 并再次请求因为关闭了 TAB，memory cache 也随之清空。但是 disk cache 是持久的，于是所有资源来自 disk cache。(大约耗时 3ms，因为文件有点小)

而且对比 2 和 3，很明显看到 memory cache 还是比 disk cache 快得多的。
<img src="https://raw.githubusercontent.com/501981732/tips/master/images/cache-3.png" alt="">

### no-cache & no-store
现在我们：
- 每种资源都(同步)请求两次
- 增加脚本异步请求图片

```
<!-- 把3种资源都改成请求两次 -->
<link rel="stylesheet" href="/static/index.css">
<link rel="stylesheet" href="/static/index.css">
<script src="/static/index.js"></script>
<script src="/static/index.js"></script>
<img src="/static/mashroom.jpg">
<img src="/static/mashroom.jpg">
<!-- 异步请求图片 -->
<script>
    setTimeout(function () {
        let img = document.createElement('img')
        img.src = '/static/mashroom.jpg'
        document.body.appendChild(img)
    }, 1000)
</script>
```

当把服务器响应设置为 Cache-Control: no-cache 时，我们发现打开页面之后，三种资源都只被请求 1 次。
<img src="https://raw.githubusercontent.com/501981732/tips/master/images/cache-4.png" alt="">
<img src="https://raw.githubusercontent.com/501981732/tips/master/images/cache-5.png" alt="">
这说明：
- 同步请求方面，浏览器会自动把当次 HTML 中的资源存入到缓存 (memory cache)，这样碰到相同 src 的图片就会自动读取缓存(但不会在 Network 中显示出来)

- 异步请求方面，浏览器同样是不发请求而直接读取缓存返回。但同样不会在 Network 中显示。

总体来说，如上面原理所述，no-cache 从语义上表示下次请求不要直接使用缓存而需要比对，并不对本次请求进行限制。因此浏览器在处理当前页面时，可以放心使用缓存。

当把服务器响应设置为 Cache-Control: no-store 时，情况发生了变化，三种资源都被请求了 2 次。而图片因为还多一次异步请求，总计 3 次。（红线内为异步请求）
<img src="https://raw.githubusercontent.com/501981732/tips/master/images/cache-6.png" alt="">
<img src="https://raw.githubusercontent.com/501981732/tips/master/images/cache-7.png" alt="">

> 实验中发现css img 是同步请求了1次 js2次 img异步请求了一次
> 
- 如之前原理所述，虽然 memory cache 是无视 HTTP 头信息的，但是 no-store 是特别的。在这个设置下，memory cache 也不得不每次都请求资源。

- 异步请求和同步遵循相同的规则，在 no-store 情况下，依然是每次都发送请求，不进行任何缓存。

### Service Worker & memory (disk) cache

我们尝试把 Service Worker 也加入进去。我们编写一个 serviceWorker.js，并编写如下内容：(主要是预缓存 3 个资源，并在实际请求时匹配缓存并返回)

```
// serviceWorker.js
var CACHE_NAME = 'service-worker-test-precache';
var CACHE_LIST = ['./index.js', 
    './index.css', 
    './hx-loading-icon.gif']

self.addEventListener('install', e => {
  // 当确定要访问某些资源时，提前请求并添加到缓存中。
  // 这个模式叫做“预缓存”
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(CACHE_LIST)
    })
  )
})
self.addEventListener('fetch', e => {
  // 缓存中能找到就返回，找不到就网络请求，之后再写入缓存并返回。
  // 这个称为 CacheFirst 的缓存策略。
  return e.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(e.request).then(matchedResponse => {
        return matchedResponse || fetch(e.request).then(fetchedResponse => {
          cache.put(e.request, fetchedResponse.clone())
          return fetchedResponse
        })
      })
    })
  )
})




```

注册SW 此外服务器设置Cache-Control: max-age=86400 来开启 disk cache。我们的目的是看看两者的优先级

```
<script>
    // 检查浏览器是否对 serviceWorker 有原生支持
    if ('serviceWorker' in navigator) {
      // 有原生支持时，在页面加载后开启新的 Service Worker 线程，从而优化首屏加载速度
      window.addEventListener('load', function() {
      // register 方法里第一个参数为 Service Worker 要加载的文件；第二个参数 scope 可选，用来指定 Service Worker 控制的内容的子目录
        navigator.serviceWorker.register('./ServiceWorker.js').then(function(registration) {
          // Service Worker 注册成功
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }).catch(function(err) {
          // Service Worker 注册失败
          console.log('ServiceWorker registration failed: ', err);
        });
      });
    }
  </script>

```




> 可以访问 chrome://inspect/#service-workers和 chrome://serviceworker-internals/ 来检查 Service Worker 是否已经启用。

> 关闭chrome://serviceworker-internals/


> [Service Worker](https://www.jianshu.com/p/0e2dee4c77bc)

> [饿了么 PWA升级实践](https://zhuanlan.zhihu.com/p/27853228)

>  [轻松把你的项目升级到PWA](https://zhuanlan.zhihu.com/p/29570875)


当我们首次访问时，会看到常规请求之外，浏览器(确切地说是 Service Worker)额外发出了 几个请求。这来自预缓存的代码。
<img src="https://raw.githubusercontent.com/501981732/tips/master/images/cache-8.png">

第二次访问(无论关闭 TAB 重新打开，还是直接按 F5 刷新)都能看到所有的请求标记为 from SerciceWorker。

<img src="https://raw.githubusercontent.com/501981732/tips/master/images/cache-9.png">


从服务器的日志也能很明显地看到，几 个资源都没有被重新请求，即命中了 Service Worker 内部的缓存。

<img src="https://raw.githubusercontent.com/501981732/tips/master/images/cache-10.png" alt="">


可以发现在后续访问时的效果和修改前是 完全一致的。(即 Network 仅有标记为 from ServiceWorker 的几个请求，而服务器也不打印 3 个资源的访问日志)
如果修改 serviceWorker.js 的 fetch 事件监听代码，改为如下：

```
// 这个也叫做 NetworkOnly 的缓存策略。
self.addEventListener('fetch', e => {
  return e.respondWith(fetch(e.request))
})
```
很明显 Service Worker 这层并没有去读取自己的缓存，而是直接使用 fetch() 进行请求。所以此时其实是 Cache-Control: max-age=86400 的设置起了作用，也就是 memory/disk cache。但具体是 memory 还是 disk 这个只有浏览器自己知道了，因为它并没有显式的告诉我们。(个人猜测是 memory，因为不论从耗时 0ms 还是从不关闭 TAB 来看，都更像是 memory cache)


浏览器行为 

 - 打开网页，地址栏输入地址： 查找 disk cache 中是否有匹配。如有则使用；如没有则发送网络请求。

- 普通刷新 (F5)：因为 TAB 并没有关闭，因此 memory cache 是可用的，会被优先使用(如果匹配的话)。其次才是 disk cache。

- 强制刷新 (Ctrl + F5)：浏览器不使用缓存，因此发送的请求头部均带有 Cache-control: no-cache(为了兼容，还带了 Pragma: no-cache)。服务器直接返回 200 和最新内容。


##缓存的应用模式

> 了解了缓存的原理，我们可能更加关心如何在实际项目中使用它们，才能更好的让用户缩短加载时间，节约流量等。这里有几个常用的模式，供大家参考

1. 不长变化的资源(jquery库等)

```
Cache-Control: max-age=31536000
```

通常在处理这类资源资源时，给它们的 Cache-Control 配置一个很大的 max-age=31536000 (一年)，这样浏览器之后请求相同的 URL 会命中强制缓存。而为了解决更新的问题，就需要在文件名(或者路径)中添加 hash， 版本号等动态字符，之后更改动态字符，达到更改引用 URL 的目的，从而让之前的强制缓存失效 (其实并未立即失效，只是不再使用了而已)。

在线提供的类库 (如 jquery-3.3.1.min.js, lodash.min.js 等) 均采用这个模式。如果配置中还增加 public 的话，CDN 也可以缓存起来，效果拔群。

这个模式的一个变体是在引用 URL 后面添加参数 (例如 ?v=xxx 或者 ?_=xxx)，这样就不必在文件名或者路径中包含动态参数，满足某些完美主义者的喜好。在项目每次构建时，更新额外的参数 (例如设置为构建时的当前时间)，则能保证每次构建后总能让浏览器请求最新的内容。

特别注意： 在处理 Service Worker 时，对待 sw-register.js(注册 Service Worker) 和 serviceWorker.js (Service Worker 本身) 需要格外的谨慎。如果这两个文件也使用这种模式，你必须多多考虑日后可能的更新及对策。

2. 经常变化的资源
```
Cache-Control: no-cache
```


这里的资源不单单指静态资源，也可能是网页资源，例如博客文章。这类资源的特点是：URL 不能变化，但内容可以(且经常)变化。我们可以设置 Cache-Control: no-cache 来迫使浏览器每次请求都必须找服务器验证资源是否有效。

既然提到了验证，就必须 ETag 或者 Last-Modified 出场。这些字段都会由专门处理静态资源的常用类库(例如 koa-static)自动添加，无需开发者过多关心。

也正如上文中提到协商缓存那样，这种模式下，节省的并不是请求数，而是请求体的大小。所以它的优化效果不如模式 1 来的显著。

3. 非常危险的模式 1 和 2 的结合 （反例)

不知道是否有开发者从模式 1 和 2 获得一些启发：模式 2 中，设置了 no-cache，相当于 max-age=0, must-revalidate。我的应用时效性没有那么强，但又不想做过于长久的强制缓存，我能不能配置例如 max-age=600, must-revalidate 这样折中的设置呢？

表面上看这很美好：资源可以缓存 10 分钟，10 分钟内读取缓存，10 分钟后和服务器进行一次验证，集两种模式之大成，但实际线上暗存风险。因为上面提过，浏览器的缓存有自动清理机制，开发者并不能控制。

举个例子：当我们有 3 种资源： index.html, index.js, index.css。我们对这 3 者进行上述配置之后，假设在某次访问时，index.js 已经被缓存清理而不存在，但 index.html, index.css 仍然存在于缓存中。这时候浏览器会向服务器请求新的 index.js，然后配上老的 index.html, index.css 展现给用户。这其中的风险显而易见：不同版本的资源组合在一起，报错是极有可能的结局。

除了自动清理引发问题，不同资源的请求时间不同也能导致问题。例如 A 页面请求的是 A.js 和 all.css，而 B 页面是 B.js 和 all.css。如果我们以 A -> B 的顺序访问页面，势必导致 all.css 的缓存时间早于 B.js。那么以后访问 B 页面就同样存在资源版本失配的隐患。


本文 囊括了前端缓存的绝大部分，包括 HTTP 协议中的缓存，Service Worker，以及 Chrome 浏览器的一些优化 (Memory Cache)。希望开发者们善用缓存，因为它往往是最容易想到，提升也最大的性能优化策略。


## 资料预加载 preload prefetch

preload通常在页面中，我们需要加载一些脚本和样式，而使用 preload 可以对当前页面所需的脚本、样式等资源进行预加载，而无需等到解析到 script 和 link 标签时才进行加载。这一机制使得资源可以更早的得到加载并可用，且更不易阻塞页面的初步渲染，进而提升性能。

网站使用了一种特殊字体，我们在css里面定义了字体的url。那么直到浏览器开始解析CSS了才会识别出来需要加载这个资源。如何提前让浏览器下载好这个资源呢？那么执行CSS的时候就可以直接用了

```
<head>
    <meta charset="utf-8">
    <title>
        preload example
    </title>
    <!-- 对 style.css 和 index.js 进行预加载 -->
    <link rel="preload" href="style.css" as="style">
    <link rel="preload" href="fonts/cicle_fina-webfont.woff" as="font" type="font/woff" crossorigin="anonymous">
    <link rel="preload" href="index.js" as="script">
    <link rel="stylesheet" href="style.css">

    <!-- 对资源进行 prefetch 预加载 -->
    <link rel="prefetch" href="next.css">
    <link rel="prefetch" href="next.js">
</head>

<body>
    <div id="app"></div>
    <script src="index.js"></script>
</body>
```

prefetch与 preload 一样，都是对资源进行预加载，但是 prefetch 加载的资源一般不是用于当前页面的，即未来很可能用到的这样一些资源，简单点说就是其他页面会用到的资源。当然，prefetch 不会像 preload 一样，在页面渲染的时候加载资源，而是利用浏览器空闲时间来下载。当进入下一页面，就可直接从 disk cache 里面取，既不影响当前页面的渲染，又提高了其他页面加载渲染的速度。


- dns-prefetch

- prefetch跟preload不同在于，用户从A页面进入B页面，preload的会失效，而prefetch的内容可以在B页面使用。

> [webopack4已支持](https://webpack.docschina.org/guides/code-splitting/#prefetching-preloading-modules) 但是4.6之后才支持

> ```
> import(/* webpackPreload: true */ 'ChartingLibrary');
> import(/* webpackPrefetch: true */ 'LoginModal');
> ```

[webpack插件resource-hints-webpack-plugin](https://github.com/jantimon/resource-hints-webpack-plugin) similarly no async chunk support
[preload-webpack-plugin](https://github.com/vuejs/preload-webpack-plugin)







