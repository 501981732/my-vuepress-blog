<template>
    <div class="container">
        <!-- <img src="./../public/img/hero.jpeg" alt="" class="hero"> -->
        <div class="submit-btn" @mousemove='btnMousemove' @click='submit'><span>{{message}}</span></div>
    </div>
</template>

<script>
    export default {
        name: 'buttonComponent',
        components: {},
        props: {
            message: {
                type: String,
                default: '提交'
            }
        },
        data() {
            return {

            }
        },
        mounted() {

        },
        methods: {
            submit() {
                console.log(this.$router.push({path:'/FE/'}))
            },
            btnMousemove(e) {
                const {left,top} = e.target.getBoundingClientRect()
                const x = e.pageX - left
                const y = e.pageY - top
                e.target.style.setProperty('--x', `${ x }px`)
                e.target.style.setProperty('--y', `${ y }px`)
            }
        },
        watch: {

        },
        computed: {

        }
    }
</script>

<style lang='less' scoped>
:root {
   --pink: #ff1ac6;
   --btnColor: #F1C967;
   // #3eaf7c
}
h2 {
    border: 0;
    color: #ff1ac6;
}
    .container {
        position: relative;
        text-align: center;
        img {
            height: 100px;
            width: 200px;
        }
    }
    .submit-btn {
        position: relative;
        overflow: hidden;
        width: 200px;
        height: 50px;
        border-radius: 10px;
        background-color: #F1C967;
        text-align: center;
        margin: 0 auto 50px;
        cursor: pointer;
        span {
            font-size: 22px;
            font-weight: 500;
            line-height: 50px;
            color: #FFF;
            position: relative;
            pointer-events: none;
        }
      &::before {
        --size: 0;  
        content: '';
        position: absolute;
        left: var(--x);
        top: var(--y);
        width: var(--size);
        height: var(--size);
        // background: radial-gradient(circle closest-side,var(--pink), transparent);
        // background: radial-gradient(circle closest-side, #4405f7, transparent);
        background: radial-gradient(circle closest-side, #ff1ac6, transparent);
        transform: translate(-50%, -50%);
        transition: width .2s ease, height .2s ease;
      }
      &:hover {
        span{
            // color: #fff;
        }
      }
      &:hover::before {
        --size: 500px;
      }
    }
</style>