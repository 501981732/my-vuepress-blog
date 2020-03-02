> 前几天又看img-2 一个webcomponents的源码，感觉很有意思，除了用的最新的 `IntersectionObserver`做延时加载外，还提供了webworker Pre-cache图片的功能,出于好奇我查看了他的源码，发现了webworker的黑魔法！！学到就是赚到。

## img-2

    先说一下img-2这个webcomponents，这个原生组件提供了四个功能

- Only render initial images which are visible to the user
- Pre-cache all other images off the main thread with a Web Worker
- Lazy load images as they enter the user's viewport instantly from the cache
- Display a blurred preview image while the user waits for initial images

源码一共300多行，由于篇幅(我比较懒)原因，我们只看webworker部分
```
/**
 * Methods used to pre-cache images using a WebWorker
 */

Img2._worker = new Worker(window.URL.createObjectURL(
    new Blob([`self.onmessage=${function (e) {
        const xhr = new XMLHttpRequest();
        function onload() {
            self.postMessage(e.data.url);
        }
        xhr.responseType = "blob";
        xhr.onload = xhr.onerror = onload;
        xhr.open("GET", e.data.location, true);
        xhr.send();
    }.toString()};`], { type: "text/javascript"})
));

Img2._worker.onmessage = function (e) {
    const slot = Img2._preCacheCallbacks[e.data];
    if (slot !== undefined) {
        slot.cached = true;
        slot.cbs = slot.cbs.filter(cb => {
            // Call the callback
            cb();
            // Remove the callback
            return false;
        });
    }
};

```

wtf??居然还有这种操作，我们知道我们通常创建webworker是通过创建额外的js文件才能运行的
```
var worker =new Worker('work.js’)
```
但是源码这里面，用了多次转换，从而达到动态创建webworker，然后我打开了[MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Workers_API/Using_web_workers),
我们来分析下这里的操作。

1. 普通js函数
2. 转换为js代码字符串(function.toString)
3. 转换为Blob对象(new Blob())
4. 转换为ObjectURL对象(URL.createObjectURL())
5. 转换为webWoker对象(new Worker())
   
interseting!

这样就避免了比较生硬的额外创建js才能创建web worker的尴尬场面。(或者`<script type="text/js-worker">`)

[stackoverflow how-to-create-a-web-worker-from-a-string](https://stackoverflow.com/questions/10343913/how-to-create-a-web-worker-from-a-string)中也有相关回答，
[worker-loader中也是这么操作的](https://github.com/webpack-contrib/worker-loader/blob/master/src/workers/InlineWorker.js)
### 用promise包装，从而可以在主线程随意创建webworker 将 WebWorker 改造成无外链文件模式

```
const makeWorker = f => {
  let pendingJobs = {}

  const worker = new Worker(URL.createObjectURL(new Blob([
    `self.onmessage = ({ data: { key, params } }) => {
     const result = (${f.toString()})(...params)
     postMessage({ key, result })
    }`
  ]),{ type: "text/javascript; charset=utf-8" }))

  worker.onmessage = ({ data: { result, key } }) => {
    pendingJobs[key](result)
    delete pendingJobs[key]
  }

  return (...params) => new Promise(resolve => {
    const key = String(Math.random())
    pendingJobs[key] = resolve
    worker.postMessage({ key, params })
  })
}

```

useage
```
const testFunction = num => num * 2

const testWorker = makeWorker(testFunction)

testWorker(100).then(i => console.log(i))
```



[将 WebWorker 改造成无外链文件模式](https://ucren.com/blog/archives/453)