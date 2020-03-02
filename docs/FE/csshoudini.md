## css houdino

在现今的 Web 开发中，JavaScript 几乎占据所有版面，除了控制页面逻辑与操作 DOM 对象以外，连 CSS 都直接写在 JavaScript 里面了，就算浏览器都还沒有实现的特性，总会有人做出对应的 Polyfills，让你快速的将新 Feature 应用到 Production 环境中，更別提我们还有 Babel 等工具帮忙转译。

而 CSS 就不同了，除了制定 CSS 标准规范所需的时间外，各家浏览器的版本、实战进度差异更是旷日持久，再加上 CSS 并非 Javascript 这样的动态语言，我们无法简单的提供 Polyfills，顶多利用 PostCSS、Sass 等工具來帮我們转译出浏览器能接受的 CSS，而剩下的就是浏览器的事了。

而就现阶段的 Web 技术來看，开发者们能操作的就是通过 JS 去控制 DOM 与 CSSOM，來来影响页面的变化，但是对于接下來的 Layout、Paint 与 Composite 就几乎沒有控制权了。

既无法让各家浏览器快速并统一实战规格，亦不能轻易产生 Polyfills，所以到现在我们依然无法大胆使用 Flexbox，即便它早在 2009 年就被提出了…

但 CSS 并非就此驻足不前。

为了解決上述问题，为了让 CSS 的魔力不再浏览器把持，Houdini 就诞生了！


[houdiniAPI介绍](https://www.w3cplus.com/css/css-houdini.html)

- parser paint layoutAPI
- Worklets
- Properties/Values
- Typed OM Object

### API

- CSS Properties and Values API
```
const textBox = document.querySelector('.textBox'); 
// GET 
const Bxshc = getComputedStyletextBox).getPropertyValue('--box-shadow-color'); 
// SET 
textBox.style.setProperty('--box-shadow-color', 'new color');
```
- CSS Parser API 基本思想会变:允许开发者⾃自由扩展 CSS 词法分析器器，引⼊入新的结构(constructs)， ⽐比如新的媒体规则、新的伪类嵌套、@extends、 @apply 等等。
只要新的词法分析器器知道如何 解析这些新结构，CSSOM 就 不不会直接忽略略它们，⽽而是把这 些结构放到正确的地⽅

- CSS Layout API允许开发 者可以通过 CSS Layout API 实现⾃自⼰己的布局模块 (layout module)，这⾥里里 的“布局模块”指的是 display 的属性值。也就是 说，这个 API 实现以后， 开发者⾸首次拥有了了像 CSS 原⽣生代码(比如 display:flex、 display:table)那样的布 局能⼒力力。
- CSS Painting API 与Layout类似，提供了一个 registerPaint方法。
- Typed OM Object 解决⽬目前模型的⼀一些问题，并实现 CSS Parsing API 和 CSS 属性与值 API 相关的特性。最主要的功能在于将 CSSOM 所使用的字串值转换成具有型別意义的 JavaScript 表示形态。

### worklet

( registerLayout 和 registerPaint)已经了解过了，估计现在你想知 道的是，这些代码得放在哪里呢?答案就是 worklet 脚本(工作流脚本 文件)。
Worklets 的概念和 web worker 类似，它们允许你引入脚本文件并执 行特定的 JS 代码，这样的 JS 代码要满足两个条件:第一，可以在渲染 流程中调用;第二，和主线程独立。
Worklet 脚本严格控制了开发者所能执行的操作类型，这就保证了性能 Worklets 的特点就是轻量以及生命周期较短。

```
CSS.paintWorklet.addModule('xxx.js') 
CSS.layoutWorklet.addModule(‘xxx.js')

registerPaint('simpleRect', XXClass);
```

### css变量 在动画中不生效？

```
.btn {
    --startColor: gray;
    background: linear-gradient(var(startColor),yellow)
    transition: --startColor 1s
}
.btn:hover {
    --startColor: green;
}
```

来注册下~

```
if (window.CSS) {
    CSS.registerProperty({
        name: '--startColor',
        syntax: '<color>',
        inherits: false,
        initialValue: 'transparent'
    });
}
//注销
    CSS.registerProperty({--startColor})
```




```
Typed OM Object 
el.attributeStyleMap.set('padding', CSS.px(42))
const padding = el.attributeStyleMap.get('padding')
console.log(padding.value, padding.unit)
```