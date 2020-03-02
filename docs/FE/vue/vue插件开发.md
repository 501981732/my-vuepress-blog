## vue插件开发

用过vue的童靴对vue组件肯定都很熟悉，一般我们在开发中会根据具体情况来封装一些可复用的组件。想loading alert等等。我们会在页面中引入，并通过components注册来实现复用。通过props传值和$emit自定义事件来完成数据传递。

### vue插件

像一些常用的组件我们想通过全局注册来实现更方便的使用，比如vux elementUI等UI库，既提供了一些组件也提供了一些常用插件。**插件可以封装组件，组件可以暴露数据给插件。**

### 插件分类

1. 添加全局方法或者属性，如: ‘vue-custom-element’

2. 添加全局资源：指令/过滤器/过渡等，如 ‘vue-touch’

3. 通过全局 mixin 方法添加一些组件选项，如: ‘vue-router’

4. 添加 Vue 实例方法，通过把它们添加到 ‘Vue.prototyp’e 上实现。

5. 一个库，提供自己的 API，同时提供上面提到的一个或多个功能，如 ’vue-router‘

### 插件的使用

```
import MyPlugin from 'xxx'
Vue.use(MyPlugin)   or
Vue.use(MyPlugin, { someOption: true })
```
Vue.use 会自动阻止多次注册相同插件，届时只会注册一次该插件。


### 插件的开发
首先插件应该有一个公开方法 install。这个方法的第一个参数是 Vue 构造器，第二个参数是一个可选的选项对象

```
export default {
    install(Vue, options) {
        Vue.myGlobalMethod = function () {  // 1. 添加全局方法或属性，如:  vue-custom-element
            // 逻辑...
        }
        Vue.directive('my-directive', {  // 2. 添加全局资源：指令/过滤器/过渡等，如 vue-touch
            bind (el, binding, vnode, oldVnode) {
                // 逻辑...
            }
            ...
        })
        Vue.mixin({
            created: function () {  // 3. 通过全局 mixin方法添加一些组件选项，如: vuex
                // 逻辑...
            }
            ...
        })
        Vue.prototype.$myMethod = function (options) {  // 4. 添加实例方法，通过把它们添加到 Vue.prototype 上实现
            // 逻辑...
        }
    }
}

```

:::info
社区里公认的做法是：添加在Vue prototype里的任何属性都要以美元符$作为其前缀
:::

### toast简单插件开发
最简单的toast插件

```
// toast.js
var Toast = {};
Toast.install = function (Vue, options) {
    Vue.prototype.$toast = (tips) => {
        let toastTpl = Vue.extend({     // 1、创建构造器，定义好提示信息的模板
            template: '<div class="vue-toast">' + tips + '</div>'
        });
        let tpl = new toastTpl().$mount().$el;  // 2、创建实例，挂载到文档以后的地方
        document.body.appendChild(tpl);     // 3、把创建的实例添加到body中
        setTimeout(function () {        // 4、延迟2.5秒后移除该提示
            document.body.removeChild(tpl);
        }, 2500)
    }
}
module.exports = Toast;

//useage
this.$toast('haha')
```
> 增加添加弹出位置
```
var Toast = {};
Toast.install = function (Vue, options) {
    let opt = {
        defaultType:'bottom',   // 默认显示位置
        duration:'2500'         // 持续时间
    }
    for(let property in options){
        opt[property] = options[property];  // 使用 options 的配置
    }
    Vue.prototype.$toast = (tips,type) => {
        if(type){
            opt.defaultType = type;         // 如果有传type，位置则设为该type
        }
        if(document.getElementsByClassName('vue-toast').length){
            // 如果toast还在，则不再执行
            return;
        }
        let toastTpl = Vue.extend({
            template: '<div class="vue-toast toast-'+opt.defaultType+'">' + tips + '</div>'
        });
        let tpl = new toastTpl().$mount().$el;
        document.body.appendChild(tpl);
        setTimeout(function () {
            document.body.removeChild(tpl);
        }, opt.duration)
    }
    ['bottom', 'center', 'top'].forEach(type => {
        Vue.prototype.$toast[type] = (tips) => {
            return Vue.prototype.$toast(tips,type)
        }
    })
}
module.exports = Toast;


// useage
this.$toast.top('top')
```



### alert插件封装组件实例

```
//alert.vue组件
<template>
    <transition name='fade'>
        <div class="alert-box" v-show='show'>
            <div class='alert-title'>
                {{title}}
            </div>            
            <div class='alert-subtitle' v-if='subtitle'>
                {{subtitle}}
            </div>
            <div class='alert-body' v-if='body'>
                {{body}}
            </div>
            <slot></slot>
        <div class="close icon" @click='close'></div>
        </div>
    </transition>
</template>
<script>
    
    export default {
        name: 'x-alert',
        components: {},
        props:{
            // 父组件v-model='xxx'
            value: {
                type: Boolean,
                default: false
            },
            title: {
                type: String,
                default:''
            },
            subtitle: {
                type: String,
                default:''
            },
            body: {
                type: String,
                default:''
            }
        },
        data() {
            return {
                show: this.value
            }
        },
        mounted() {

        },
        methods: {
            close() {
                this.show = false 
                this.$emit('close')
            }
        },
        watch: {
            value(val) {
                this.show = val;
            },
            show(val) {
            <!--v-model -->
                this.$emit('input', val);
            }
        },
        computed: {

        }
    }
</script>
```

```
//alert.js插件
import Alert from './alert.vue';

const plugin = {
	install(vue, props = {}) {
		const AlertPlugin = Vue.extend(Alert);

		let $vm = new AlertPlugin({
			el: document.createElement('div')
		});
		document.body.appendChild($vm.$el);

		function alert(options = {}) {
			if ($vm.show) return;
			// 如果传参为字符串，则直接显示body 的文本
			if (typeof options === 'string') {
				options = {
					body: arguments[0]
				};
			}
			//配置优选级：实例配置 > 全部配置 > 默认配置
			$vm = Object.assign($vm, props, options,{delayed: true});

			$vm.show = true;
			// 支持延时消失 默认支持
			if ($vm.delayed) {
				setTimeout(_=>{
					$vm.show = false
				},3000)
			}
			return new Promise((resolve, reject) => {
				$vm.$watch('show', val => {
					resolve();
				});
			});
		}

		if (!vue.$x) {
			vue.$x = {
				alert
			};
		} else {
			vue.$x.alert = alert;
		}
		vue.mixin({
			created: function() {
				this.$x = vue.$x;
			}
		});
	}
};
export default plugin;
```
### alert插件用法useage
```
import AlertPlugin from './alert.js'
Vue.use(AlertPlugin)
```
1.
```
this.#x.alert('呵呵') // 字符串的话则只默认显示body部分
```
2.
```
this.$x.alert({
    title: '你好',
    subtitle: '我是副标题',
    body:'呵呵',
    delayed: false, //取消延时消失
})
```
3.
```
this.#x.alert('hehe').then(_=> console.log('显隐时触发回调'))
```




### 自动安装插件
对于那些没有在应用中使用模块化系统的用户，他们往往将通过script标签引用你的插件，并期待插件无需调用Vue.use()便会自动安装 。你可以在插件最后添加如下几行代码来实现自动安装：


```
// 如果Vue是全局对象自动安装插件
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(MyPlugin)
}
```

### npm 发布插件
不多说

```
npm login
cd 目录
npm publish

```

说下简单的目录结构

```
├── lib // 插件源码
│   ├── components // 组件目录
│   │   └── loading.vue // 组件文件
│   └── index.js  // 插件入口文件
├── index.js // 入口文件
└── package.json  // 包管理文件

```

可以向[Awesome-Vue](https://github.com/vuejs/awesome-vue)提交PR。很多人会来这里寻找插件。or Vue论坛，Vue Gitter Channel，或者在Twitter上@ #vuejs。
