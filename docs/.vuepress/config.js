// 引用的资源都放在.vuepress目录下的public文件夹
// 设置侧边栏分组后默认会自动生成 上/下一篇链接
//设置了自动生成侧边栏会把侧边栏分组覆盖掉
//设置PWA记得开启SSL
const glob = require('glob')
let feFiles = []
let arrayFeFiles = []
// glob("./../FE/*.md",{ ignore: './../FE/README.md' },function(err,files){
//     if (err) return
//     let feFiles = files.map(item => item.split('/')[3].split('.')[0])
//     feFiles.forEach(item => {
//         arrayFeFiles.push([item,item])
//     })
//     console.log(arrayFeFiles)
// })
// let files = glob.sync("./../FE/*.md",{ ignore: './../FE/README.md' })
// feFiles = files.map(item => item.split('/')[3].split('.')[0])
//     feFiles.forEach(item => {
//         arrayFeFiles.push([item,item])
//     })
//     console.log(arrayFeFiles)
module.exports = {
    head: [
        ['link', {
            rel: 'icon',
            href: `/favicon.ico`
        }],
        // 增加manifest.json
        ['link', {
            rel: 'manifest',
            href: '/manifest.json'
        }],
    ],
    serviceWorker: true,
    title: 'gblw',
    description: '一个前端小学生',
    // base:'/my-vue-press/',
    configureWebpack: {
        resolve: {
            alias: {
                '@public': 'public'
            }
        },
    },
    markdown: {
        lineNumbers: false //行号
    },
    // theme: 'foo',
    themeConfig: {
        repo: '501981732/my-vuepress',
        // repoLabel: '查看源码',
        // docsDir: 'docs',
        // editLinks: true,
        // editLinkText: '改善此页'
        nav: [{
                text: '主页',
                link: '/'
            },
            {
                text: '前端相关',
                link: '/FE/'
            },
            {
                text: '后端相关',
                link: '/RD/'
            },
            {
                text: '环境相关',
                link: '/utils/'
            },
            {
                text: '数据库相关',
                link: '/DB/'
            },
            // {
            //     text: 'github',
            //     link: 'https://github.com/501981732/my-vue-press'
            // }
            // 下拉列表的配置
            {
                text: 'npm包',
                items: [
                    { text: 'koa工程生成器', link: 'https://www.npmjs.com/package/generator-easy-koa' },
                    { text: 'vue多功能搬砖器', link: 'https://www.npmjs.com/package/generator-easy-vue' },
                    { text: '图片转base64组件', link: 'https://www.npmjs.com/package/vue-image-base64' },
                    { text: 'vue插件@gblw/vue-x-ui', link: 'https://www.npmjs.com/package/@gblw/vue-x-ui' },
                ]
            }
        ],
        sidebar: {
            '/FE/': [
                '',
                ['代码规范', '代码规范'],
                ['性能优化', '性能优化'],
                ['GPU加速原理', 'GPU加速原理'],
                ['cache', '前端缓存'],
                ['image转base64插件', 'image转base64插件'],
                ['webpack原理', 'webpack原理'],
                ['FLIP动画','FLIP动画'],
                ['Promise原理','Promise原理'],
                ['前端路由原理','前端路由原理'],
                ['css workflow','css workflow'],
                ['postcss了解下~','postcss了解下~'],
                ['设计模式','设计模式'],
                ['数据结构与算法','数据结构与算法'],
                {
                    title: 'vue相关',
                    collapsable: true,
                    children: [
                        ['vue/v-model指令', 'v-model指令'],
                        ['vue/vue插件开发', 'vue插件开发'],
                        ['vue/自动注入组件', '自动注入插件'],
                        ['vue/从0到1vue组件库X-UI', '从0到1vue组件库X-UI'],
                        ['vue/keep-alive解读', 'keep-alive解读'],
                        ['vue/同构之vue SSR', '同构之vue SSR'],
                    ]
                },
                {
                    title: '日记杂七乱八',
                    collapsable: true,
                    children: [
                        ['note/1-6春运优化', '1-6春运优化'],
                    ]
                },
            ],
            // '/FE/':  arrayFeFiles,
            '/RD/': [{
                    title: 'node',
                    collapsable: true,
                    children: [
                        ['<<Node.js实战>>.md', '<<Node.js实战>>']
                    ]
                },
                ['RESTful', 'RESTful'],
                ['AOP面向切面编程','AOP面向切面编程'],
                ['IOC','I0C'],
                ['Node上线相关','Node上线相关']
            ],
            '/utils/': [
                ['ssh-key', 'MAC管理多个ssh key'],
                ['yoman创建脚手架.md','yoman创建脚手架.md'],
                ['gentrator-easy-koa', 'gentrator-easy-koa KOA脚手架'],
                ['gentrator-easy-vue', 'gentrator-easy-vue VUE脚手架'],
                ['jsdoc自动构建项目接口文档', 'jsdoc自动构建项目接口文档'],
                ['构建超溜的代码检查工作流', '构建超溜的代码检查工作流'],
                ['持续集成CI与持续部署CD','持续集成CI与持续部署CD'],
                ['jenkins', 'jenkins'],
                ['docker', 'docker'],
            ],
            '/DB/': [
                ['HTTP从入门到放弃', 'HTTP从入门到放弃'],
                ['MySQL从入门到放弃', 'MySQL从入门到放弃'],
                ['mongoDB从入门到放弃', 'mongoDB从入门到放弃'],
            ],
            // 回退(fallback)侧边栏配置
            '/': [
                '', /* / */
                // 'contact', /* /contact.html */
                // 'about' /* /about.html */
            ]
        },
        activeHeaderLinks: true,
        displayAllHeaders: false, //侧边栏标题链接
        //搜索
        search: true,
        searchMaxSuggestions: 10,
        sidebarDepth: 2,
        lastUpdated: 'Last Updated',
        //刷新内容的弹窗
        serviceWorker: {
            updatePopup: true // Boolean | Object, 默认值是 undefined.
            // 如果设置为 true, 默认的文本配置将是: 
            // updatePopup: { 
            //    message: "New content is available.", 
            //    buttonText: "Refresh" 
            // }
        }
    },

}