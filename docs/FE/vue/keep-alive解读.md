## 解读keep-alive

我们用vue时，有些场景我们希望切换组件的同时希望保留之前的组件状态，这个时候我们就需要用到keep-alive，接下来我们看vue是如何做到的。

### 用法

**keep-alive** 包裹动态组件时，会缓存不活动的组件实例到内存中，而不是销毁它们,和 **transition**相似，**keep-alive** 是一个抽象组件：它自身不会渲染一个 DOM 元素，也不会出现在父组件链中。

 当组件在 **keep-alive** 内被切换，它的 **activated** 和 **deactivated** 这两个生命周期钩子函数将会被对应执行。

**prop**

- include - 字符串或正则表达式。只有名称匹配的组件会被缓存。
- exclude - 字符串或正则表达式。任何名称匹配的组件都不会被缓存。
- max - 数字。最多可以缓存多少组件实例。
```html
<!-- 基本 -->
<keep-alive>
  <component :is="view"></component>
</keep-alive>

<!-- 多个条件判断的子组件 -->
<keep-alive>
  <comp-a v-if="a > 1"></comp-a>
  <comp-b v-else></comp-b>
</keep-alive>

<!-- 和 `<transition>` 一起使用 -->
<transition>
  <keep-alive>
    <component :is="view"></component>
  </keep-alive>
</transition>

<!-- 2.1.0  -->
<!-- 字符串匹配 -->
<keep-alive include="a,b">
  <component :is="view"></component>
</keep-alive>
<!-- 正则匹配 (使用 `v-bind`)-->
<keep-alive :include="/a|b/">
  <component :is="view"></component>
</keep-alive>
<!-- 数组匹配 (使用 `v-bind`) -->
<keep-alive :include="['a', 'b']">
  <component :is="view"></component>
</keep-alive>
<!-- 2.5.0 -->
<!-- 最大缓存数 -->
<keep-alive :max="10">
  <component :is="view"></component>
</keep-alive>

```
注意，**keep-alive** 是用在其一个直属的子组件被开关的情形。如果你在其中有 v-for 则不会工作。如果有上述的多个条件性的子元素，**keep-alive** 要求同时只有一个子元素被渲染。

### keep-alive是如何实现组件的缓存？

>首先，我们要知道vue.js内部其实是将一个个DOM节点抽象成VNode节点，keep-alive也是基于VNode来做的存储，而并非是存储的DOM，它将满足条件的组件缓存到cache对象中（cache在created生命周期创建的）,需要重新渲染的时候再从cache中取出对应的vnode。

- **created()**
> keep-alive会在created生命周期中创建cache对象，用以存储缓存的vnode
```js
create() {
    this.cache = Object.create(null)
    //缓存的所有key的集合
    this.keys= []
}
````

- **mounted() && watch**

> mounted挂载时，注册watch，监听include 和exclude变化，当其修改的时候通过 **pruneCache**对cache缓存对象进行修正，pruneCache实现见下图源码分享。
```js
  mounted () {
  //监控include和exclude,当其修改的时候通过pruneCache对cache进行修正
    this.$watch('include', val => {
      pruneCache(this, name => matches(val, name))
    })
    this.$watch('exclude', val => {
      pruneCache(this, name => !matches(val, name))
    })
  },
```

- **render()**

首先我们通过slot获取第一个子组件,默认取name,没有的话取tag（name || tag）
然后通过 include和exclude去匹配这个这个（name || tag）
如果 没有在include或者在exclude中的话，就直接返回vnode（这时并没有缓存）。
```js
    if (
        (include && (!name || !matches(include, name))) ||
        (exclude && name && matches(exclude, name))
    ) {
        return vnode
    }
```
如果cache对象有缓存过 **(if(cache[key]))**,如果缓存过，则直接从缓存中获取组件实例(componentInstance)给vnode,覆盖掉当前的vnode上面。


如果没有缓存过， **cache[key] = vnode；keys.push(key)**，将vnode存储到cache缓存对象中，将key存储到keys中。


```js
  render () {
  //获取slot插槽中的第一个组件
    const slot = this.$slots.default
    const vnode: VNode = getFirstComponentChild(slot)

    const componentOptions: ?VNodeComponentOptions = vnode && vnode.componentOptions
    if (componentOptions) {
      // check pattern
      // 获取组件名称（名字 || tag）
      const name: ?string = getComponentName(componentOptions)
      const { include, exclude } = this
      //如果 没有在include或者在exclude中的话，就直接返回vnode,这时并没有缓存
      if (
        // not included
        (include && (!name || !matches(include, name))) ||
        // excluded
        (exclude && name && matches(exclude, name))
      ) {
        return vnode
      }
      const { cache, keys } = this
      const key: ?string = vnode.key == null
        // same constructor may get registered as different local components
        // so cid alone is not enough (#3269)
        ? componentOptions.Ctor.cid + (componentOptions.tag ? `::${componentOptions.tag}` : '')
        : vnode.key
        //如果缓存过，则直接从缓存中获取组件实例(componentInstance)给vnode,覆盖掉当前的vnode上面。
      if (cache[key]) {
        vnode.componentInstance = cache[key].componentInstance
        // make current key freshest
        remove(keys, key)
        keys.push(key)
      } else {
        //如果没有缓存过，则进行缓存
        cache[key] = vnode
        keys.push(key)
        // prune oldest entry
        if (this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode)
        }
      }

      vnode.data.keepAlive = true
    }
    return vnode || (slot && slot[0])
  }
```


### 源码

```js
/* @flow */
// 2.6.7
// vue/sr/core/components/keep-alive.js
import { isRegExp, remove } from 'shared/util'
import { getFirstComponentChild } from 'core/vdom/helpers/index'

type VNodeCache = { [key: string]: ?VNode };
// 获取组件名称 原先获取name,其次tag
function getComponentName (opts: ?VNodeComponentOptions): ?string {
  return opts && (opts.Ctor.options.name || opts.tag)
}
//include 和exclude分别支持 数字，字符串，以及正则三种格式，分别对其进行判断
function matches (pattern: string | RegExp | Array<string>, name: string): boolean {
  if (Array.isArray(pattern)) {
    return pattern.indexOf(name) > -1
  } else if (typeof pattern === 'string') {
    return pattern.split(',').indexOf(name) > -1
  } else if (isRegExp(pattern)) {
    return pattern.test(name)
  }
  /* istanbul ignore next */
  return false
}
//修改cache对象
function pruneCache (keepAliveInstance: any, filter: Function) {
  const { cache, keys, _vnode } = keepAliveInstance
  for (const key in cache) {
  //取cache中的vnode
    const cachedNode: ?VNode = cache[key]
    // 如果cache中存在vnode
    if (cachedNode) {
      const name: ?string = getComponentName(cachedNode.componentOptions)
      //不匹配filter规则，（pruneCacheEntry会判断是否是目前渲染的vnode,再去销毁）则从cache对象中删除。
      if (name && !filter(name)) {
        pruneCacheEntry(cache, key, keys, _vnode)
      }
    }
  }
}
// 销毁vnode对应的组件实例： 会判断是否是目前渲染的vnode,再去销毁
function pruneCacheEntry (
  cache: VNodeCache,
  key: string,
  keys: Array<string>,
  current?: VNode
) {
  const cached = cache[key]
  if (cached && (!current || cached.tag !== current.tag)) {
    cached.componentInstance.$destroy()
  }
  cache[key] = null
  remove(keys, key)
}

// 三种格式匹配
const patternTypes: Array<Function> = [String, RegExp, Array]

export default {
  name: 'keep-alive',
  //抽象组件
  abstract: true,

  props: {
    include: patternTypes,
    exclude: patternTypes,
    max: [String, Number]
  },

  created () {
  //创建缓存对象
    this.cache = Object.create(null)
    this.keys = []
  },

  destroyed () {
  // 销毁缓存对象
    for (const key in this.cache) {
      pruneCacheEntry(this.cache, key, this.keys)
    }
  },

  mounted () {
  //监控include和exclude,当其修改的时候通过pruneCache对cache进行修正
    this.$watch('include', val => {
      pruneCache(this, name => matches(val, name))
    })
    this.$watch('exclude', val => {
      pruneCache(this, name => !matches(val, name))
    })
  },

  render () {
  //获取slot插槽中的第一个组件
    const slot = this.$slots.default
    const vnode: VNode = getFirstComponentChild(slot)

    const componentOptions: ?VNodeComponentOptions = vnode && vnode.componentOptions
    if (componentOptions) {
      // check pattern
      // 获取组件名称（名字 || tag）
      const name: ?string = getComponentName(componentOptions)
      const { include, exclude } = this
      //如果 没有在include或者在exclude中的话，就直接返回vnode,这时并没有缓存
      if (
        // not included
        (include && (!name || !matches(include, name))) ||
        // excluded
        (exclude && name && matches(exclude, name))
      ) {
        return vnode
      }
      const { cache, keys } = this
      const key: ?string = vnode.key == null
        // same constructor may get registered as different local components
        // so cid alone is not enough (#3269)
        ? componentOptions.Ctor.cid + (componentOptions.tag ? `::${componentOptions.tag}` : '')
        : vnode.key
        //如果缓存过，则直接从缓存中获取组件实例(componentInstance)给vnode,覆盖掉当前的vnode上面。
      if (cache[key]) {
        vnode.componentInstance = cache[key].componentInstance
        // make current key freshest
        remove(keys, key)
        keys.push(key)
      } else {
        //如果没有缓存过，则进行缓存
        cache[key] = vnode
        keys.push(key)
        // prune oldest entry
        if (this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode)
        }
      }

      vnode.data.keepAlive = true
    }
    return vnode || (slot && slot[0])
  }
}
```