### canvas 

- 如果使用 CSS 来设置宽高的话，画布就会按照 300 * 150 的比例进行缩放，也就是将 300 * 150 的页面显示在 400 * 400 的容器中,通常通过js来控制

### canvas画圆

```
<canvas id="canvas">

</canvas>

<script>
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d"); //获取到这个 Canvas 的上下文对象
    var cx = canvas.width = 400;
    var cy = canvas.height = 400;

    context.beginPath();
    context.arc(100, 100, 50, 0, Math.PI * 2, true);
    context.closePath();
    context.fillStyle = 'rgb(255,255,255)';
    context.fill();
</script>
```
### canvas画点
步骤
1. 创建路径 beginPath()
2. 绘制路径
3. 关闭路径 context.closePath()
4. 设置填充颜色或描边颜色
5. 填充颜色或者描边

```
context.beginPath();       // 起始一条路径，或重置当前路径
context.arc(100, 100, 1, 0, Math.PI * 2, true);  // 创建弧/曲线
context.closePath();       // 创建从当前点回到起始点的路径
context.fillStyle = 'rgb(255,255,255)'; // 设置或返回用于填充绘画的颜色、渐变或模式
context.fill();            // 填充当前绘图（路径）
```

### canvas 绘制/曲线

    context.arc(x,y,r,sAngle,eAngle,counterclockwise); //arc() 方法创建弧/曲线（用于创建圆或部分圆）
    
- x：圆心的 x 坐标
- y：圆心的 y 坐标
- r：圆的半径
- sAngle：起始角，以弧度计（弧的圆形的三点钟位置是 0 度）
- eAngle：结束角，以弧度计
- counterclockwise：可选。规定应该逆时针还是顺时针绘图。false 为顺时针，true 为逆时针

```
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");
    var cx = canvas.width = 400;
    var cy = canvas.height = 400;

    context.beginPath();
    context.arc(100, 100, 50, 0, Math.PI * 0.5, false);
    <!--假如设置beginPath就是闭合的了-->
    context.strokeStyle="white";
    context.stroke();
```
- stroke() ：描边
- fill() ：填充


### canvas绘制直线

```
    context.beginPath();
    context.moveTo(50,50);
    context.lineTo(100,100);
  context.lineWidth = 10;
    context.lineCap = 'round';
    context.strokeStyle = '#fff';
    context.stroke();
```
- moveTo(x,y)：把路径移动到画布中的指定点，不创建线条
- lineTo(x,y)：添加一个新点，然后在画布中创建从该点到最后指定点的线条

- 如果没有 moveTo，那么第一次 lineTo 的就视为 moveTo
- 每次 lineTo 后如果没有 moveTo，那么下次 lineTo 的开始点为前一次 lineTo 的结束点。


- lineCap	设置或返回线条的结束端点样式
- lineJoin	设置或返回两条线相交时，所创建的拐角类型
- lineWidth	设置或返回当前的线条宽度
- miterLimit	设置或返回最大斜接长度


### 绘制矩形

```
    context.beginPath();
    context.fillStyle = '#fff';
    context.fillRect(10, 10, 100, 100);
    context.strokeStyle = '#fff';
    context.strokeRect(130, 10, 100, 100);
```
- fillRect(x,y,width,height)：绘制一个实心矩形
- strokeRect(x,y,width,height)：绘制一个空心矩形


### 颜色、样式和阴影

- fillStyle 设置或返回用于填充绘画的颜色、渐变或模式

- strokeStyle 设置或返回用于笔触的颜色、渐变或模式

- shadowColor 设置或返回用于阴影的颜色

- shadowBlur 设置或返回用于阴影的模糊级别

- shadowOffsetX 设置或返回阴影距形状的水平距离

- shadowOffsetY 设置或返回阴影距形状的垂直距离

- fillStyle 和 strokeStyle 这两个属性我们一直在使用，所以对于它们我们不再作过多的介绍。


### 渐变

- createLinearGradient(x0,y0,x1,y1) 创建线性渐变（用在画布内容上）

x0：开始渐变的 x 坐标
y0：开始渐变的 y 坐标
x1：结束渐变的 x 坐标
y1：结束渐变的 y 坐标

- createPattern() 在指定的方向上重复指定的元素

- createRadialGradient() 创建放射状/环形的渐变（用在画布内容上）

- addColorStop() 规定渐变对象中的颜色和停止位置

```
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");
    var cx = canvas.width = 400;
    var cy = canvas.height = 400;

    var grd = context.createLinearGradient(100,100,100,200);
    grd.addColorStop(0,'pink');
    grd.addColorStop(1,'white');

    context.fillStyle = grd;
    context.fillRect(100,100,200,200);
```

### 图形转换

    在进行图形变换的时候，我们需要画布旋转，然后再绘制图形。
    这样的结果是，我们使用的图形变换的方法都是作用在画布上的，既然对画布进行了变换，那么在接下来绘制的图形都会变换。这点是需要注意的。
    
scale()缩放当前绘图至更大或更小

rotate()旋转当前绘图

translate()重新映射画布上的 (0,0) 位置

transform()替换绘图的当前转换矩阵

setTransform()将当前转换重置为单位矩阵，然后运行 transform()

```
    context.strokeStyle = 'white';
    context.strokeRect(5,5,50,25);
    context.scale(2,2);
    context.strokeRect(5,5,50,25);
    context.scale(2,2);
    context.strokeRect(5,5,50,25);

```
- 在设置 scale() 方法之后再设置的矩形，无论是线条的宽度还是坐标的位置，都被放大了
- scale() 的效果是可以叠加的,我们在上面的例子中使用了两次 scale(2,2) 那么，最后一个矩形相对于第一个矩形长和宽，以及坐标的位置就放大了 4 倍。

### 图形绘制

    context.drawImage(img,sx,sy,swidth,sheight,x,y,width,height);

img：规定要使用的图像、画布或视频
sx：可选。开始剪切的 x 坐标位置
sy：可选。开始剪切的 y 坐标位置
swidth：可选。被剪切图像的宽度
sheight：可选。被剪切图像的高度
x：在画布上放置图像的 x 坐标位置
y：在画布上放置图像的 y 坐标位置
width：可选。要使用的图像的宽度（伸展或缩小图像）
height：可选。要使用的图像的高度（伸展或缩小图像）



### 酷炫背景效果通性

- 背景 --- 纯色、渐变或可平铺的图形
- 炫酷 --- 动 随机
- 效果 --- 与鼠标的交互（鼠标跟随 视觉差）

### 怎么实现随机粒子

- 粒子
- 规则图形
- 随机
- 数量多

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <style>
        html,body {
            margin:0;
            overflow:hidden;
            width:100%;
            height:100%;
            cursor:none;
            background:black;
        }
    </style>
</head>
<body>
<canvas id="canvas"></canvas>

<script>
    var ctx = document.getElementById('canvas'),
        content = ctx.getContext('2d'),
        round = [],
        WIDTH,
        HEIGHT,
        initRoundPopulation = 80;


    WIDTH = document.documentElement.clientWidth;
    HEIGHT = document.documentElement.clientHeight;

    ctx.width = WIDTH;
    ctx.height = HEIGHT;

    function Round_item(index,x,y) {
        this.index = index;
        this.x = x;
        this.y = y;
        this.r = Math.random() * 2 + 1;
        var alpha = (Math.floor(Math.random() * 10) + 1) / 10 / 2;
        this.color = "rgba(255,255,255," + alpha + ")";
    }

    Round_item.prototype.draw = function () {
        content.fillStyle = this.color;
        content.shadowBlur = this.r * 2;
        content.beginPath();
        content.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
        content.closePath();
        content.fill();
    };

    function init() {
        for(var i = 0; i < initRoundPopulation; i++ ){
            round[i] = new Round_item(i,Math.random() * WIDTH,Math.random() * HEIGHT);
            round[i].draw();
        }

    }

    init();
</script>
</body>
</html>
```
### 使你的随机粒子效果动起来

    Canvas 制作动画是一个不断擦除再重绘的过程，跟最原始实现动画的方式类似。在纸片上画每一帧，然后以很快的速度翻动小本本，就会有动画的效果。
    现在我们实现动画需要在很短的时间内不断的清除内容再重新绘制，新的图形和原先清除的图形之间有某种位置关系，速度足够快的话，我们就会看到动画的效果

    context.clearRect(x,y,width,height);
    
- x：要清除的矩形左上角的 x 坐标
- y：要清除的矩形左上角的 y 坐标
- width：要清除的矩形的宽度，以像素计
- height：要清除的矩形的高度，以像素计

setTimeout 和 setInterval 的问题是，它们都不精确。它们的内在运行机制决定了时间间隔参数实际上只是指定了把动画代码添加到浏览器 UI 线程队列中以等待执行的时间。如果队列前面已经加入了其他任务，那动画代码就要等前面的任务完成后再执行。

```
    function animate() {
        content.clearRect(0, 0, WIDTH, HEIGHT);

        for (var i in round) {
            round[i].move();
        }
        requestAnimationFrame(animate)
    }
    Round_item.prototype.move = function () {
        this.y -= 0.15;
        if (this.y <= -10) {
            this.y = HEIGHT + 10;
        }
        this.draw();
    };
我们只需要改变 round 的 y 坐标即可，并且设置边界条件，当 y 坐标的值小于 -10（也可以是其他负值），代表该 round 已经超出了屏幕，这个时候我们要将其移动到屏幕的最底端，
```

### 使你的鼠标和屏幕互动

分析：鼠标移动，会在经过的地方创建一个圆，圆的半径由小变大，达到某个固定大小时该圆消失。圆的颜色也是在随机变化的。
```
<script>


        var canvas = document.getElementById('canvas'),
            ctx = canvas.getContext('2d'),
            WIDTH = canvas.width = document.documentElement.clientWidth,
            HEIGHT = canvas.height = document.documentElement.clientHeight,
            para = {
                num: 100,
                color: false,    //  颜色  如果是false 则是随机渐变颜色
                r: 0.9,
                o: 0.09,         //  判断圆消失的条件，数值越大，消失的越快
                a: 1,

            },
            color,
            color2,
            round_arr = [];





        window.onmousemove = function (event) {

            mouseX = event.clientX;
            mouseY = event.clientY;

            round_arr.push({
                mouseX: mouseX,
                mouseY: mouseY,
                r: para.r,
                o: 1
            })
        };


        // 判断参数中是否设置了 color，如果设置了 color，就使用该值、
        // 如果参数中的 color 为 false，那么就使用随机的颜色
        if (para.color) {
            color2 = para.color;
        } else {
            color = Math.random() * 360;
        }

        function animate() {

            if (!para.color) {
                color += .1;
                color2 = 'hsl(' + color + ',100%,80%)';
            }

            ctx.clearRect(0, 0, WIDTH, HEIGHT);

            for (var i = 0; i < round_arr.length; i++) {

                ctx.fillStyle = color2;
                ctx.beginPath();
                ctx.arc( round_arr[i].mouseX ,round_arr[i].mouseY,round_arr[i].r,0, Math.PI * 2);
                ctx.closePath();
                ctx.fill();
                round_arr[i].r += para.r;
                round_arr[i].o -= para.o;

                if( round_arr[i].o <= 0){
                    round_arr.splice(i,1);
                    i--;
                }
            }

            window.requestAnimationFrame(animate);
        };

        animate();
</script>
```
### 更优雅

- 避免浮点数的坐标点

绘制图形时，长度与坐标应选取整数而不是浮点数，原因在于 Canvas 支持半个像素绘制。

会根据小数位实现插值算法实现绘制图像的反锯齿效果，如果没有必要请不要选择浮点数值。

- 使用多层画布去画一个复杂的场景
比如在游戏中，背景不经常变换和人物这些经常变换的元素分成不同的层，这样需要重绘的资源就会少很多。

- 用 CSS transform 特性缩放画布

如果你使用 left、top 这些 CSS 属性来写动画的话，那么会触发整个像素渲染流程 —— paint、layout 和 composition。

但是使用 transform 中的 translateX/Y 来切换动画，你将会发现，这并不会触发 paint 和 layout，仅仅会触发 composition 的阶段。

这是因为 transform 调用的是 GPU 而不是 CPU

- 离屏渲染

其实就是设置缓存，绘制图像的时候在屏幕之外的地方绘制好，然后再直接拿过来用，这不就是缓存的概念吗?!︿(￣︶￣)︿.

建立两个 Canvas 标签，大小一致，一个正常显示，一个隐藏（缓存用的，不插入 DOM 中）。先将结果 draw 到缓存用的 canvas 上下文中，因为游离 Canvas 不会造成 UI 的渲染，所以它不会展现出来；再把缓存的内容整个裁剪再 draw 到正常显示用的 Canvas 上，这样能优化不少。


一个一个的粒子先在屏幕之外创建出来，然后再使用 drawImage() 方法将其“放入”到我们的主屏幕中

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <style>
        html, body {
            margin: 0;
            overflow: hidden;
            width: 100%;
            height: 100%;
            cursor: none;
            background: black;
        }
    </style>
</head>
<body>
<canvas id="canvas"></canvas>

<script>
    var ctx = document.getElementById('canvas'),
        content = ctx.getContext('2d'),
        round = [],
        WIDTH,
        HEIGHT,
        initRoundPopulation = 80,
        useChache = true;



    WIDTH = document.documentElement.clientWidth;
    HEIGHT = document.documentElement.clientHeight;

    ctx.width = WIDTH;
    ctx.height = HEIGHT;

    function Round_item(index, x, y) {
        this.index = index;
        this.x = x;
        this.y = y;
        this.useCache = useChache;
        this.cacheCanvas = document.createElement("canvas");
        this.cacheCtx = this.cacheCanvas.getContext("2d");

        this.cacheCtx.width = 6 * this.r;
        this.cacheCtx.height = 6 * this.r;
        this.r = Math.random() * 2 + 1;
        var alpha = (Math.floor(Math.random() * 10) + 1) / 10 / 2;
        this.color = "rgba(255,255,255," + alpha + ")";

        if(useChache){
            this.cache();
        }
    }

    Round_item.prototype.draw = function () {

        if( !useChache){
            content.fillStyle = this.color;
            content.shadowBlur = this.r * 2;
            content.beginPath();
            content.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
            content.closePath();
            content.fill();
        }else{
            content.drawImage(this.cacheCanvas, this.x - this.r, this.y - this.r);
        }

    };

    Round_item.prototype.cache = function () {
        this.cacheCtx.save();
        this.cacheCtx.fillStyle = this.color;
        this.cacheCtx.shadowColor = "white";
        this.cacheCtx.shadowBlur = this.r * 2;
        this.cacheCtx.beginPath();
        this.cacheCtx.arc(this.r * 3, this.r * 3, this.r, 0, 2 * Math.PI);
        this.cacheCtx.closePath();
        this.cacheCtx.fill();
        this.cacheCtx.restore();
    };
    function animate() {
        content.clearRect(0, 0, WIDTH, HEIGHT);

        for (var i in round) {
            round[i].move();
        }
        requestAnimationFrame(animate)
    }

    Round_item.prototype.move = function () {
        this.y -= 0.15;
        if (this.y <= -10) {
            this.y = HEIGHT + 10;
        }
        this.draw();
    };


    function init() {
        for (var i = 0; i < initRoundPopulation; i++) {
            round[i] = new Round_item(i, Math.random() * WIDTH, Math.random() * HEIGHT);
            round[i].draw();
        }
        animate();

    }

    init();
</script>
</body>
</html>
```

[各种效果](https://github.com/sunshine940326/canvas)


