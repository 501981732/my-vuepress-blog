<template>
    <div class="special-layout">
        <background-component />
        <p class="desc">一个FE界小学生</p>
        <btn-component message='隔壁老王欢迎您~' :key='1'/>
        <btn-component message='hello world'  :key='2'/>
    </div>
</template>

<script>
    import BackgroundComponent from './backgroundComponent.vue'
    import BtnComponent from './BtnComponent.vue'
    export default {
        name: '',
        components: {
            BackgroundComponent,
            BtnComponent
        },
        data() {
            return {

            }
        },
        mounted() {

        },
        methods: {

        },
        watch: {

        },
        computed: {

        }
    }
</script>

<style lang='less' scoped>
    .special-layout {
        text-align: center;
        position: relative;
        .desc {
            position: relative;
            font-size: 20px;
            color: #6a8bad;
            margin: 0;
            padding: 30px;
        }
    }
</style>