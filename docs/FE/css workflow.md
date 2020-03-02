## css work flow

### 历史

最原始的预处理： 模板插入

```
.container {
    left: <%= left%>px;
}
```
### css 预处理器

- less
- sass/scss
- stylus

#### 特性：
- variables
- Mixins
- Nesting
- Operations
- Functions
- namespaces
- scope
- import
- ...

#### 实现原理：
- 取到 DSL源代码的分析树
- 将含有动态生成相关节点的分析树转换为静态分析树
- 将静态分析树转换为CSS的静态分析树
- 将CSS的静态分析树转换为CSS 代码

####特点:
逻辑处理能力强，可以优化项目结构，但是采用特殊语法，和预处理框架耦合度高

### css 后处理器
- 压缩
- AntoPrefixer
- ...

#### 实现原理:

- 将源代码做为CSS解析，获得分析树
- 对CSS的分析树进行后处理
- 将CSS的分析树转换为CSS代码

#### 特点：
使用原生语法，更贴近未来标准，但是逻辑处理等方便偏弱


<img src='/img/css1.png' width="80%" />

### postcss 前后通吃

前后通吃，既能实现预处理功能，又能处理后处理器做的事，而且功能不仅如此，采用插件系统，即插即用。
postcss让css 工作流变得更加清晰。未来css工作流可能是 原生css未来标准 + postcss等 处理器。
目前项目中可用预处理+postcss结合使用。

### cssnext  post-preset-env


##  使用CSS绘制图案的Web组件 [css-doodle](https://css-doodle.com/)

[各种酷炫吊炸天有木有](https://codepen.io/collection/XyVkpQ/3/)
[demo](https://codepen.io/airen/pen/vrRMaq)
```
    <css-doodle>
        :doodle{ @grid : 1x10 / 61.8vmin; };
        border-radius: 50%;
        @place-cell:center;
        @size:calc(@index()*10%);
        border-color: hsla(calc(20*@index()), 70%, 68%, calc(3 / @index()*.8));
        border-width:calc(@index()*1vmin);
        border-style: dashed;
        --d: @rand(20s,40s);
        --rf: @rand(360deg);
        --rt: calc(var(--rf) + @pick(1turn,-1turn));
        animation: spin var(--d) linear infinite;
        @keyframes spin {
        from{
        transform: rotate(var(--rf));
        }
        to{
        transform: rotate(var(--rt));
        }
        }
    </css-doodle>
```

[大漠](https://www.w3cplus.com/css/create-patterns-with-css-doodle.html)