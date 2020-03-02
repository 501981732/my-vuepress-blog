

[jsdocgitbook](https://www.css88.com/doc/jsdoc/index.html)
[jsdoc](http://usejsdoc.org/)
## JsDoc可以根据规范化的注释、自动生成接口文档。包括参数说明、示例等等。

### 常见命令行
| 选项        | 描述           
| ------------- |:-------------:
| -d \<value\>, --destination \<value\>      | 输出文档路径
| -P, --package      | 包含项目名称，版本，和其他细节的package.json文件。默认为在源路径中找到的第一个package.json文件。
| -r, --recurse | 扫描源文件和导览时递归到子目录。
| -R, --readme  | 用来包含到生成文档的README.md文件。默认为在源路径中找到的第一README.md 文件。
| -h, --help    | 显示JSDoc的命令行选项的信息，然后退出。
| -c \<value\>, --configure \<value\>|JSDoc配置文件的路径。默认为安装JSDoc目录下的conf.json或conf.json.EXAMPLE。
...
1. 想包含package文件信息 ？
```
sdoc --package ./package.json  OR -P命令
```
2. 想包含READEME信息？
```
jsdoc --readme path/to/readme/README   OR -R命令
```
3. 输入文件和输出文件位置？
```
jsdoc  ./src/**/*.js -d ./docs/ 
前者是想要解析的文件位置 后者是输出的位置
```
#### 用conf.json配置JSDoc

```
{
    "tags": {
        "allowUnknownTags": true,//JSDoc允许您使用无法识别的标签
        "dictionaries": ["jsdoc","closure"] 
    },
    "source": {
        "include": ['./src/utils/*.js'],//指定输入文件位置
        "exclude": [], //排除位置，可以是include的子目录
        "includePattern": ".+\\.js(doc)?$", //.js .jsdoc 文件被处理
        "excludePattern": "(^|\\/|\\\\)_"   //以下划线开头的文件或目录被忽略
    },
    "plugins": [],  //插件
    "templates": {
        "cleverLinks": false,  //@link标签呈现在纯文本
        "monospaceLinks": false
        "default": {
            "outputSourceFiles": true,
            "staticFiles": {  //复制图片目录到输出目录 您可以通过HTML标签 <img src="img/screen.png">在您的文档中显示该图片。
                "include": [
                    "./src/assets/image"
                ]
            }
        }
    },
    "opts": { //合并命令行到配置文件
        "template": "templates/default",  // same as -t templates/default
        "encoding": "utf8",               // same as -e utf8
        "destination": "./docs/",          // same as -d ./out/
        "recurse": true,                  // same as -r
        "tutorials": "path/to/tutorials", // same as -u path/to/tutorials
        "package": "./package.json",  // --p
        "reademe": "./READEME.md"      // -R 这个命令测试没生效 建议在命令行中 -R指定reademe文件
    }
}
```
### 常用标签
```
1. author <name> [<address>]  如 @author wm <18103332123@163.com>
2. @callback <namepath>  描述一个回调函数
3. @class [<type> <name>]/ @constructor 类
4. @classdesc <some description>描述类
5. @constant [<type> <name>] 指定一个常量
6. @copyright <some copyright text> 版权信息
7. @default [<some value>] 描述默认值
8. @description <some description> @desc  描述一个标识符 若在注释开始的时候写描述可省略
9. @enum [<type>] 相关属性的集合
10. @event <className>#[event:]<eventName>  描述一个时间
11. @example 提供一个如何使用描述项的例子。
12. @exports <moduleName> 标识一个由JavaScript模块导出的成员。
13. @file @fileoverview @overview 描述一个文件
14. @function @func @method 描述一个函数或方法
15. @global 记录一个全局对象。
16. @ignore 忽略
17. @license 代码协议
18. @member 标签记录成员基本种类（kind）
19. @module 记录js模块
20. @name 距离一个对象名称
21. @param @arg @argument 参数
22. @returns 记录返回值
23. @throws 可能会抛出的异常
24. @todo 记录将要做的任务
25. @type {typeName} 记录类型
26. @version 描述版本
...
还有 @intreface 接口 @instance 实例  @static @private @protected @public @property等

```
### 实例
```
/**
 * This is a description of the MyClass constructor function.
 * @class
 * @classdesc This is a description of the MyClass class.
 */
function MyClass() {
}

/**
 *  @constant
 *  @default
 */
const RED = 0xff0000;

/**
 * Returns the sum of a and b
 * @param {Number} a
 * @param {Number} b
 * @returns {Number}
 */
function sum(a, b) {
    return a + b;
}


/** @module myModule */

/** will be module:myModule~foo */
var foo = 1;

/** will be module:myModule.bar */
var bar = function() {};
```

::: tip
JSDoc支持两种类型标签
- 块标签： 提供有关您的代码的详细信息，如一个函数接受的参数
- 内联标签 链接到文件的其他部分，类似于HTML中的锚标记（a）。
:::

### [jsdoc-vue](https://github.com/Konata9/jsdoc-vue)

经常写vue的肯定会经常写 .vue文件 jsdoc-vue插件可以完成对.vue的文件的解析
#### 原理很简单: 编译前用 vue-template-compiler处理 .vue文件

```
var compiler = require('vue-template-compiler');

exports.handlers = {
  beforeParse: function (e) {
    if (/\.vue$/.test(e.filename)) {
      var output = compiler.parseComponent(e.source);

      e.source = output.script ? output.script.content : '';
    }
  }
};
```

