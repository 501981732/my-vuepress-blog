## 理解v-model

::: tip
v-model一般作为表单里面做双向数据绑定，but其实是个语法糖。通过下面几个例子理解下。
:::

### 1. 元素的v-model 输入框(text)

```

<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>v-model指令</title>
        <script src="https://cdn.bootcss.com/vue/2.3.4/vue.js"></script>
    </head>
    <body>
        <div id="app">
            {{price}}<br>
            <input v-model="price"><!-- 下行注释的语法糖 -->
            <!-- <input :value="price" @input="price = $event.target.value"> -->
        </div>
        <script>
            new Vue({
                el: '#app',
                data: {
                    price: '20'
                }
            });
        </script>
    </body>
</html>
```

### 2. 组件v-model 输入框(text)

```
<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>v-model指令</title>
        <script src="https://cdn.bootcss.com/vue/2.3.4/vue.js"></script>
    </head>
    <body>
        <div id="app">
            {{price}}
            <my-input v-model="price"></my-input><!-- 下行注释的语法糖 -->
            <!-- <my-input :value="price" @input="val => {price = val}"></my-input> -->
        </div>
        <script>
            Vue.component('my-input', {
                template: '<div><input type="text" ref="input" :value="value" @input="doThis"/></div>',
                props: {
                    value: String
                },
                methods: {
                    doThis() {
                        this.$emit('input', this.$refs.input.value);
                    }
                }
            });
            new Vue({
                el: '#app',
                data: {
                    price: '10'
                }
            });
        </script>
    </body>
</html>
```

### 3. 组件v-model 复选框(checkbox) 

```
 <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>v-model指令</title>
            <script src="https://cdn.bootcss.com/vue/2.3.4/vue.js"></script>
        </head>
        <body>
            <div id="app2">
                {{fruit}}<!-- 观测数据变化 -->
                <my-checkbox v-model="fruit.apple" value="apple"></my-checkbox><!-- 下行注释的语法糖 -->
                <!-- <my-checkbox :checked="fruit.apple" @change="val => {fruit.apple = val}" value="apple"></my-checkbox> -->
            
                <my-checkbox v-model="fruit.peach" value="peach"></my-checkbox><!-- 下行注释的语法糖 -->
                <!-- <my-checkbox :checked="fruit.peach" @change="val => {fruit.peach = val}" value="peach"></my-checkbox> -->
            </div>
            <script>
                Vue.component('my-checkbox', {
                    template: '<div><span>{{value}}</span><input type="checkbox" :checked="checked" @change="doThis" :value="value"/></div>',
                    model: {
                        prop: 'checked',
                        event: 'change'
                    },
                    props: {
                        checked: Boolean,
                        value: String
                    },
                    methods: {
                        doThis() {
                            this.$emit('change', !this.checked);
                        }
                    }
                });
                new Vue({
                    el: '#app2',
                    data: {
                        fruit: {//数据
                            apple: true,
                            peach: false
                        }
                    }
                });
            </script>
        </body>
    </html>
```

### 4. 组件v-model 单选框(radio)

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>v-model指令</title>
    <script src="https://cdn.bootcss.com/vue/2.3.4/vue.js"></script>
</head>
<body>
    <div id="app">
        {{fruit}}<!-- 观测数据变化 -->
        <my-radio v-model="fruit" value="apple" name="myFruit"></my-radio><!-- 下行注释的语法糖 -->
        <!-- <my-radio :checked="fruit" @change="val => {fruit = val}" value="apple"></my-radio> -->
        
        <my-radio v-model="fruit" value="peach" name="myFruit"></my-radio><!-- 下行注释的语法糖 -->
        <!-- <my-radio :checked="fruit" @change="val => {fruit = val}" value="peach"></my-radio> -->
    </div>
    <script>
        Vue.component('my-radio', {
            template: '<div><span>{{value}}</span><input :name="name" type="radio" ref="radio" :checked="checked===value" @change="doThis" :value="value"/></div>',
            model: {
                prop: 'checked',
                event: 'change'
            },
            props: {
                checked: String,
                value: String,
                name: String
            },
            methods: {
                doThis() {
                    this.$emit('change', this.$refs.radio.value);
                }
            }
        });
        new Vue({
            el: '#app',
            data: {
                fruit: 'peach'//数据
            }
        });
    </script>
</body>
```
