
首先看我们**Node.js实战第二章**

### 模块最终导出的是什么

- 最终导出的是module.exports exports只是对module.exports的一个全局引用，一个可以添加属性的空方法,module.exports 初始值为一个空对象 {}。
- 假如exports = xxx 这样设定为别的，就打破了module.exports 和exports的**引用关系** 那么就不再指向nodule.exports了，but可以这样让module.exports再次引用exports
- module.exports = exports = xxx   
- require() 返回的是 module.exports 而不是 exports

[接下来看下cnode的精华帖](https://cnodejs.org/topic/5231a630101e574521e45ef8)


js基础：

```
var a = {name: 1};
var b = a;

console.log(a);
console.log(b);

b.name = 2;
console.log(a);
console.log(b);

var b = {name: 3};
console.log(a);
console.log(b);

运行 test.js 结果为：

{ name: 1 }
{ name: 1 }
{ name: 2 }
{ name: 2 }
{ name: 2 }
{ name: 3 }
```

**解释：** a 是一个对象，b 是对 a 的引用，即 a 和 b 指向同一块内存，所以前两个输出一样。当对 b 作修改时，即 a 和 b 指向同一块内存地址的内容发生了改变，所以 a 也会体现出来，所以第三四个输出一样。当 b 被覆盖时，b 指向了一块新的内存，a 还是指向原来的内存，所以最后两个输出不一样。