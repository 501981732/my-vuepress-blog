```
<li class="list-item" v-for="(item, index) in rankList" :key="item.id">
    <img :src="'../imgs/rank' + (index+1) + '.png'">
```
### 原因：
webpack在静态编译阶段就已经将图片打包了，上面这时样的写法使得图片路径在项目运行时才拼接完毕，会导致图片404。或者在js中添加的图片也会有这种问题。

### 解决方案：
1. 把图片上传到服务器，直接用线上路径
2. 可以用import导入图片
3. require导入图片

#### 区别：

import必须写在代码开头，如果有10张图片，就要import10次；而require可以写在代码块中，用循环来完成图片引入。

