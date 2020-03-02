> 最近在搞一个库，需要babel转移，就顺便把babel文档和相关资料撸了一下

### babel是啥

Babel 是一个工具链，主要用于将 ECMAScript 2015+ 版本的代码转换为向后兼容的 JavaScript 语法，以便能够运行在当前和旧版本的浏览器或其他环境中

### babel作用

- 语法转换
- 通过 Polyfill 方式在目标环境中添加缺失的特性 (通过 @babel/polyfill 模块)
- 源码转换 (codemods)
- more

### Presets
不想手动一个个安装插件，babel有提供一些插件组合

```
@babel/preset-env
@babel/preset-flow
@babel/preset-react
@babel/preset-typescript
```
### plugins

babel的一大特点是插件化：使用现有的或者自己编写的插件可以组成一个转换管道。通过使用或创建一个 preset 即可轻松使用一组插件。

### babel设置

可用四种方式
- .babelrc 
- .babelrc.js 
- babel.config.js  
- package.json中的babel字段

```
{
  "presets": [...],
  "plugins": [...]
}
```

### @babel/preset-env
babel推荐使用 **@babel/preset-env**套件来处理编译需求，包含了各种可能用到的转译工具。**之前的以年份为准的 preset 已经废弃了(babel-preset-2015)，现在统一用这个总包**。

#### targets browserslist
@babel/preset-env的target可以指定目标浏览器环境来处理哪些feature需要转义，哪些不需要。
targets使用browserslist类筛选浏览器环境。当然你也可以配置在package.json browerslist字段， 或者单独配置 .browserslistrc
```
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": {
            "targets": {
                "chrome": "58",
                "ie": "11"
            }
        }
      }
    ]
  ],
}

```

#### browserslist
browserslist配置能够分享目标浏览器和nodejs版本在不同的前端工具。这些工具能根据目标浏览器自动来进行配置

**设置途径**

- package.json browerslist字段
```
{
  "browserslist": [
    "last 1 version",
    "> 1%",
    "maintained node versions",
    "not dead"
  ]
}
```

- .browserslistrc
```
# Browsers that we support 
 
last 1 version
> 1%
maintained node versions
not dead
```

**作用范围**
(browerlist)[https://github.com/browserslist/browserslist-example]
- developers
- Autoprefixer
- Babel
- postcss-preset-env
- postcss-normalize
- ESLint
- Stylelint

#### useBuiltIns
这个属性决定是否引入 polyfill,有三个属性
- false 不引入
- usage 按需引入
- entry 全部引入

后面会根据@babel/polyfill具体阐述

### core-js2 与core-js3

core-js 2 封版于 一年半之前，所以里面只有对 一年半之前 feature 的 polyfill，最近 1.5 年新增的 feature 都不支持，也就存在因为新功能没有 polyfill 于是在旧浏览器里失败的风险。

所以我们应当升级到最新版，**npm i core-js@3 -D** 然后修改 babel 配置：

```
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "useBuiltIns": "usage",
        "corejs": 3
      }
    ]
  ],
}
```

**注意**：目前 Vue Cli 3 集成了 core-js 2，不支持升级到 v3，无法手动升级。需要等待 Vue Cli 4

### @babel/runtime

> 假如我们开发的类库给别人用，我们自己有引用polyfill 的promise，而使用方本地也有封装primise，就会爆炸

- 开发类库 （生成不污染全局空间和内置对象原型的代码）
- 借助 @babel/runtime 中帮助函数（helper function）移除冗余工具函数

### polyfill
babel会转换新的语法，但是不会转换新的API和static methods，像 promise Array.from等这些需要我们用polyfill垫片来处理

>Babel includes a polyfill that includes a custom regenerator runtime and core-js


整个polyfill非常庞大的，我们不可能全部引入，这就需要配合useBuiltIns来处理。配合引入垫片polyfill的方式根据useBuiltIns的不同可以分为三种，即 entry, usage 和 false。（defaults to false）

- 在入口文件中手动 import '@babel/polyfill'
    这种方法会引入全部的polyfill，导致我们的打包文件非常大

- useBuiltIns: 'usage' 这时候需要注意 **把入口文件的手动import去掉**
```
 When setting `useBuiltIns: 'usage'`, polyfills are automatically imported when needed.
  Please remove the direct import of `core-js` or use `useBuiltIns: 'entry'` instead.
```
这时 会根据我们的 **targets** 或 **browserslist** 配置来转换，而且或  会 **自动检测代码中用到的功能**自动引入模块假如目标文件不支持需要的feature，那么就引入polyfill

- babel7.4之后

@babel/polyfill 是对 core-js 的封装，引用了 core-js的内容和生成器（regenerator-runtime)。 v7.4 之后，这个仓库就被废弃了，希望用户自己选择使用哪个兼容库。
**之前**

```
import "@babel/polyfill" or useBuildtIns:'usage'
```

**之后**
```
import "core-js/stable";
import "regenerator-runtime/runtime"; //会在我们安装 @babel/runtime 时自动安装
```

但是测试中结合useBuildIns 并未实现按需加载

总结： 目前我认为最好的选择还是 **useBuiltIns: 'usage'** 入口文件不需要手动引入

```
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "useBuiltIns": "usage",
        "corejs": 3
      }
    ]
  ],
    "plugins": ["@babel/plugin-transform-runtime"]
}
```


(1)[https://juejin.im/post/5d0373a95188251e1b5ebb6c]
(2)[https://blog.meathill.com/js/some-tips-of-babel-preset-env-config.html]



