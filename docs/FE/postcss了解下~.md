



## postcss

>PostCSS is a tool for transforming styles with JS plugins. These plugins can lint your CSS, support variables and mixins, transpile future CSS syntax, inline images, and more.

## postcss是啥
PostCSS是CSS变成JavaScript的数据，使它变成可操作。PostCSS是基于JavaScript插件，然后执行代码操作。PostCSS自身并不会改变CSS，它只是一种插件，为执行任何的转变铺平道路。

## postcss可以做啥

PostCSS 接收一个 CSS 文件并提供了一个 API 来分析、修改它的规则（通过把 CSS 规则转换成一个抽象语法树的方式）。在这之后，这个 API 便可被许多插件利用来做有用的事情，比如寻错或自动添加 CSS vendor 前缀。
PostCSS插件可以像预处理器，它们可以优化和autoprefix代码；可以添加未来语法；可以添加变量和逻辑；可以提供完整的网格系统；可以提供编码的快捷方式等等。 

postCSS可以做很多，但是他自身又不会去做什么，你可以通过配置插件或者结合其他来完成你想要的效果。

::: tip
尽管表面上它看起来是一个预处理器，其实它不是一个预处理器  
尽管表面上它看起来是一个后处理器，其实它也不是一个后处理器  
尽管它可以促进、支持未来的语法，其实它不是未来语法  
尽管它可以提供清理、优化代码这样的功能，其实它不是清理、优化代码的工具  
它不是任何一件事情，这也意味者它潜力无限，你可以根据自己的需要配置你需要的功能
:::
现在postcss有超过200个plugins，你可以在这里[list](https://github.com/postcss/postcss/blob/master/docs/plugins.md)或者这里[searchable catalog](https://www.postcss.parts/)来查找。


[readme](https://github.com/postcss/postcss/blob/HEAD/README-cn.md)

### 解决全局 CSS 的问题

* [`postcss-use`] 允许你在 CSS 里明确地设置 PostCSS 插件，并且只在当前文件执行它们。
* [`postcss-modules`] 和 [`react-css-modules`] 可以自动以组件为单位隔绝 CSS 选择器。
* [`postcss-autoreset`] 是全局样式重置的又一个选择，它更适用于分离的组件。
* [`postcss-initial`] 添加了 `all: initial` 的支持，重置了所有继承的样式。
* [`cq-prolyfill`] 添加了容器查询的支持，允许添加响应于父元素宽度的样式.

### 提前使用先进的 CSS 特性

* [`autoprefixer`] 添加了 vendor 浏览器前缀，它使用 Can I Use 上面的数据。
* [`postcss-preset-env`] 允许你使用未来的 CSS 特性。

### 更佳的 CSS 可读性

* [`precss`] 囊括了许多插件来支持类似 Sass 的特性，比如 CSS 变量，套嵌，mixins 等。
* [`postcss-sorting`] 给规则的内容以及@规则排序。
* [`postcss-utilities`] 囊括了最常用的简写方式和书写帮助。
* [`short`] 添加并拓展了大量的缩写属性。

### 图片和字体

* [`postcss-assets`] 可以插入图片尺寸和内联文件。
* [`postcss-sprites`] 能生成雪碧图。
* [`font-magician`] 生成所有在 CSS 里需要的 `@font-face` 规则。
* [`postcss-inline-svg`] 允许你内联 SVG 并定制它的样式。
* [`postcss-write-svg`] 允许你在 CSS 里写简单的 SVG。

### 提示器（Linters）

* [`stylelint`] 是一个模块化的样式提示器。
* [`stylefmt`] 是一个能根据 `stylelint` 规则自动优化 CSS 格式的工具。
* [`doiuse`] 提示 CSS 的浏览器支持性，使用的数据来自于 Can I Use。
* [`colorguard`] 帮助你保持一个始终如一的调色板。

### 其它

* [`postcss-rtl`] 在单个 CSS 文件里组合了两个方向（左到右，右到左）的样式。
* [`cssnano`] 是一个模块化的 CSS 压缩器。
* [`lost`] 是一个功能强大的 `calc()` 栅格系统。
* [`rtlcss`] 镜像翻转 CSS 样式，适用于 right-to-left 的应用场景。

[`postcss-inline-svg`]:         https://github.com/TrySound/postcss-inline-svg
[`postcss-preset-env`]:         https://github.com/jonathantneal/postcss-preset-env
[`react-css-modules`]:          https://github.com/gajus/react-css-modules
[`postcss-autoreset`]:          https://github.com/maximkoretskiy/postcss-autoreset
[`postcss-write-svg`]:          https://github.com/jonathantneal/postcss-write-svg
[`postcss-utilities`]:          https://github.com/ismamz/postcss-utilities
[`postcss-initial`]:            https://github.com/maximkoretskiy/postcss-initial
[`postcss-sprites`]:            https://github.com/2createStudio/postcss-sprites
[`postcss-modules`]:            https://github.com/outpunk/postcss-modules
[`postcss-sorting`]:            https://github.com/hudochenkov/postcss-sorting
[`postcss-assets`]:             https://github.com/assetsjs/postcss-assets
[开发 PostCSS 插件]:             https://github.com/postcss/postcss/blob/master/docs/writing-a-plugin.md
[`font-magician`]:              https://github.com/jonathantneal/postcss-font-magician
[`autoprefixer`]:               https://github.com/postcss/autoprefixer
[`cq-prolyfill`]:               https://github.com/ausi/cq-prolyfill
[`postcss-rtl`]:                https://github.com/vkalinichev/postcss-rtl
[`postcss-use`]:                https://github.com/postcss/postcss-use
[`css-modules`]:                https://github.com/css-modules/css-modules
[`colorguard`]:                 https://github.com/SlexAxton/css-colorguard
[`stylelint`]:                  https://github.com/stylelint/stylelint
[`stylefmt`]:                   https://github.com/morishitter/stylefmt
[`cssnano`]:                    http://cssnano.co
[`precss`]:                     https://github.com/jonathantneal/precss
[`doiuse`]:                     https://github.com/anandthakker/doiuse
[`rtlcss`]:                     https://github.com/MohammadYounes/rtlcss
[`short`]:                      https://github.com/jonathantneal/postcss-short
[`lost`]:                       https://github.com/peterramsing/lost

## 语法

PostCSS 可以转化样式到任意语法，不仅仅是 CSS。
如果还没有支持你最喜欢的语法，你可以编写一个解释器以及（或者）一个 stringifier 来拓展 PostCSS。

* [`sugarss`] 是一个以缩进为基础的语法，类似于 Sass 和 Stylus。
* [`postcss-syntax`] 通过文件扩展名自动切换语法。
* [`postcss-html`] 解析类 HTML 文件里`<style>`标签中的样式。
* [`postcss-markdown`] 解析 Markdown 文件里代码块中的样式。
* [`postcss-jsx`] 解析源文件里模板或对象字面量中的CSS。
* [`postcss-styled`] 解析源文件里模板字面量中的CSS。
* [`postcss-scss`] 允许你使用 SCSS *(但并没有将 SCSS 编译到 CSS)*。
* [`postcss-sass`] 允许你使用 Sass *(但并没有将 Sass 编译到 CSS)*。
* [`postcss-less`] 允许你使用 Less *(但并没有将 LESS 编译到 CSS)*。
* [`postcss-less-engine`] 允许你使用 Less *(并且使用真正的 Less.js 把 LESS 编译到 CSS)*。
* [`postcss-js`] 允许你在 JS 里编写样式，或者转换成 React 的内联样式／Radium／JSS。
* [`postcss-safe-parser`] 查找并修复 CSS 语法错误。
* [`midas`] 将 CSS 字符串转化成高亮的 HTML。

[`postcss-less-engine`]: https://github.com/Crunch/postcss-less
[`postcss-safe-parser`]: https://github.com/postcss/postcss-safe-parser
[`postcss-syntax`]:      https://github.com/gucong3000/postcss-syntax
[`postcss-html`]:        https://github.com/gucong3000/postcss-html
[`postcss-markdown`]:    https://github.com/gucong3000/postcss-markdown
[`postcss-jsx`]:         https://github.com/gucong3000/postcss-jsx
[`postcss-styled`]:      https://github.com/gucong3000/postcss-styled
[`postcss-scss`]:        https://github.com/postcss/postcss-scss
[`postcss-sass`]:        https://github.com/AleshaOleg/postcss-sass
[`postcss-less`]:        https://github.com/webschik/postcss-less
[`postcss-js`]:          https://github.com/postcss/postcss-js
[`sugarss`]:             https://github.com/postcss/sugarss
[`midas`]:               https://github.com/ben-eb/midas

## 文章

* [一些你对 PostCSS 可能产生的误解](http://julian.io/some-things-you-may-think-about-postcss-and-you-might-be-wrong)
* [PostCSS 究竟是什么，是做什么的](http://davidtheclark.com/its-time-for-everyone-to-learn-about-postcss)
* [PostCSS 指南](http://webdesign.tutsplus.com/series/postcss-deep-dive--cms-889)

你可以在 [awesome-postcss](https://github.com/jjaderg/awesome-postcss) 列表里找到更多优秀的文章和视频。

## 使用

>每个项目遇到的场景都是不一样，这里会介绍集中常用的插件的使用，通过这几些来了解下postcss的强大之处

1. 在你的构建工具中找到postcss对应的扩展并添加
2. 查找你所需要的postcss插件 添加到postcss处理队列中。

你可以使用webpack gulp fis 或者直接CLI来使用，鉴于前端现在大多用的webpack,我们后面介绍的集中都是基于webpack的,我们的webpack已经有太多东西来处理了，所以postcss我们会单独放到一个文件来做配置 **.postcssrc.js** 或者 **postcss.config.js**（当然你可以命名其他名字，然后修改path，一般我们不会修改）

### postcss-loader
首先是 **postcss-loader** 你需要把post-cssloader加入到你的webpack中去,一般我们不会单独使用，而是结合css-loader style-loader等，注意：**你需要把它放到style-loader css-loader后面，但是要放到一些预处理loader less-loader sass-loader**

> npm install postcss-loader

```js
//webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { importLoaders: 1 } },
          'postcss-loader'
        ]
      }
    ]
  }
}

// postcss.config.js
// 一般配置文件我们只需要关注plugins就好啦，当然还有其他配置项
// https://github.com/michael-ciniawsky/postcss-load-config
module.exports = {
    plugins: {
        "postcss-import": {}, 
        "postcss-url": {}, 
        "autoprefixer": {}
    }
}

```

### postcss-import

> 主要功有是解决@import引入路径问题。使用这个插件，可以让你很轻易的使用本地文件、node_modules或者web_modules的文件。这个插件配合postcss-url让你引入文件变得更轻松。

```css
//xx.css
@import "normalize.css"; /* == @import "../node_modules/normalize.css/normalize.css"; */
```

### postcss-url

>该插件主要用来处理文件，比如图片文件、字体文件等引用路径的处理。

### autoprefixer 

> 自动添加浏览器厂商的私有前缀，它使用 Can I Use 上面的数据。当然你可以根据项目需要，做相应浏览器的兼容，你可以创建 **.browserslistrc** 或者我们更常用的办法是在package.json的 browserslist字段添加。其他工具比如 **babel-preset-env stylelint**等都可以共享此浏览器配置。

```js
    {
        "browserslist": [
            "> 1%",
            "last 2 versions",
            "not ie <= 8",
            "iOS >= 7",
            "Firefox >= 20",
            "Android > 3.2"
        ]
    }
```

还需要注意的一点是由于autoprefixer是css常见的需求，所以很多插件其实已经内置了此功能，比如 **postcss-cssnext postcss-nano post-css-preset-dev** 后面我们在讲这几个插件。

### 未来语法之：postcss-cssnext

>cssnext。该插件可以让我们使用CSS未来的特性，其会对这些特性做相关的兼容性处理。BUT变化太TM快了，目前被不再维护 被[postcss-preset-env](https://github.com/MoOx/postcss-cssnext) 取代
[相关特性 变量 混入 逻辑等](https://cssnext.io/features/#automatic-vendor-prefixes)

```
  plugins: {
    'postcss-cssnext': {},
  }
```

### 未来语法之：postcss-preset-env
> post-cssnext下一代 更加强大。[资料](https://www.npmjs.com/package/postcss-preset-env) BUT假如你有用happypack去做webpack的性能优化的话，请使用post-cssnext。happypack有点“老了”根本配不上postcss-preset-env  2333~

```
  plugins: {
    'postcss-preset-env': {},
  }
```

### cssnano
> 主要用来压缩和清理CSS代码。 在webpack中 css-loader已经具有cssnano功能。你可以在postcss-loader里面显示的使用并配置。
cssnano是一个非常强大的CSS优化的插件包，他汇聚了20几个[插件](https://cssnano.co/guides/optimisations/)，即插即用。你可能根据自己的需求进行配置，甚至是完全禁用。具体参数 见[这里](http://cssnano.co/)
```
  plugins: {
    cssnano: {
      preset: "advanced", //cssnano-preset-advanced
      autoprefixer: false, //比如你一用单独使用了autoprefixer 或者使用了postcss-cssnext等具备autoprefixer功能的plugin
      "postcss-zindex": false  //这里面有坑，他会重新计算页面的z-index,假如你在其他组件里面有设置z-index,会失效。
    }
  }
```

### REM布局方案
> 移动端现在流行的rem布局，我们可以通过 postcss插件来做自动配置。

具体实现不多说，[flexable](https://github.com/amfe/lib-flexible)

**方案1：** 配和sublime插件 [cssrem](https://github.com/flashlizi/cssrem)

sublime配置插件
```
{
    "px_to_rem": 75,
    "max_rem_fraction_length": 6,
    "available_file_types": [".css", ".less", ".sass",".vue"]
}
```
<img src='http://img0.tuicool.com/zauAbqY.gif' width="400" height="150" />

**方案2:** 利用sass等预处理工具，编写pxTorem function等
```css
//css
$brower_default_font_size: 16px !default;
html{
    font-size: $brower_default_font_size;
}
@function pxTorem($px){
    @return $px / $brower_default_font_size * 1rem;
}

container {
    width: pxTorem(200px);
}
```
**方案3：** 也就是我们的主角，postcss插件，我常用的是[postcss-pxtorem](https://www.npmjs.com/package/postcss-pxtorem) 当然还有其他相似插件[postcss-px2rem](https://www.npmjs.com/package/postcss-px2rem)核心配置：

```js
postcss.config.js
module.exports = {
    plugins: {
        "postcss-pxtorem": {
            rootValue: 75,
            unitPrecision: 5,
            propList: ['*'],
            selectorBlackList: [],
            replace: true,
            mediaQuery: false,
            minPixelValue: 12
        }
    }
}
```
从此移动端我们就可以愉快的使用设计稿PX来搞啦~其他交给postcss来搞定。
### vw布局方案

vw布局方案采用的是 [postcss-px-to-viewport](https://www.npmjs.com/package/postcss-px-to-viewport)

```js
module.exports = {
  plugins: {
    "postcss-cssnext": {},
    "postcss-px-to-viewport": {
      viewportWidth: 750, //视窗的宽度，对应的是我们设计稿的宽度，一般是750
      viewportHeight: 1334, // 视窗的高度，根据750设备的宽度来指定，一般指定1334，也可以不配置
      unitPrecision: 3, // 指定`px`转换为视窗单位值的小数位数（很多时候无法整除）
      viewportUnit: "vw", // 指定需要转换成的视窗单位，建议使用vw
      selectorBlackList: [".ignore", ".hairlines"], // 指定不转换为视窗单位的类，可以自定义，可以无限添加,建议定义一至两个通用的类名
      minPixelValue: 1, // 小于或等于`1px`不转换为视窗单位，你也可以设置为你想要的值
      mediaQuery: false // 允许在媒体查询中转换`px`
    },
  }
};

```
从此移动端我们就可以愉快的使用设计稿PX来搞啦~

### 其他

- preCSS预处理器 和sass类似 拥有变量，嵌套，循环，混入等功能
- postcss-sprites  生成雪碧图
- postcss-svgo 给内联SVG做优化
- postcss-modules css modules...
- CSS Grace 修复IE各种bug,兼容旧浏览器的各种 Hack，让你无需担忧兼容性 包括IE6！
- postcss-simple-vars  实现sass类变量
- postcss-mixins [you must set this plugin before postcss-simple-vars and postcss-nested]
- postcss-nested 嵌套


postcss强大的功能不止如此，总之当我们配置好postcss工作流之后，我们之后需要关注css就好了，剩下兼容，优化等问题，我们丢给postcss就好啦

## 开发 PostCSS插件

[相关](https://github.com/postcss/postcss/blob/master/docs/writing-a-plugin.md)

分析依赖和AST



