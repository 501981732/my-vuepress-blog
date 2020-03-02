### node调试

https://chenshenhai.github.io/koa2-note/note/debug/info.html

    - 可以通过chrome插件来调试
        - 浏览器打开chrome://inspect配置目标宿主和端口号
        - [chrome插件](https://chrome.google.com/webstore/detail/nim-node-inspector-manage/gnhhdgbaldcilmgcpfddgdbkhjohddkj)
        - node inspect myscript.js   or node-inspect myscript.js
        - 点击调试器中的图标~
    - 可以使用IDE VScode调试
        - 左侧的小爬虫~
        - 断点调试~


- stream 写日志, redis 存session
- 记录/存储/分析日志   PV  UV等
- 安全
    - 越权操作/数据库攻击
    - 登录验证 /XSS攻击 /sql注入
- 扩展机器或服务器 承载大流量