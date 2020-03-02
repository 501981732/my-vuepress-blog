- 安装brew https://brew.sh/index_zh-cn
- brew search nginx  brew install nginx
- brew info nginx
- nginx -v
- 启动sudo brew services start nginx (默认8080)
- 如果安装过Jenkins的话这里失败 sudo jaunchctl unload /Library/LaunchDaemons/org.jenkins-cj.plist
- Systemctl start jenkins
- 关闭 sudo brew services stop nginx/nginx/
- 启动nginx 重启nginx -s reload 关闭nginx -s stop
- nginx 位置/usr/local/etc/
- 验证配置文件是否生效 nginx -t
- nginx -c xxx.conf 对那个文件生效
- 拷贝配置文件到node目录重新修改
- xxx服务器端的nginx地址 /usr/local/nginx/sbin/
- 几条绝学
    1. px aux | grep node
    2. lsof -i tcp:8080
    3. kill -9 你的pid
    4. ssh 用户名@地址 (免密码登录)
    5. scp course-map json root@IP地址:/路径
    6. scp -r dist.zip root@101.200.185.250:/opt/:/h/www/static/
    7. zip dist.zip dist /  unzip dist.zip
    8. npm install --production
    9. pm2 start pm2.json

- [pm2动态监控文件](http://pm2.keymetrics.io/)
    1. 能够动态监控文件上传 0秒热启
    2. 能负载均衡 CPU
    3. 内存使用过多 CPU调度台频繁 重启
    4. 看 restart个数
    5. pm2 start pm2.json

1. nginx主要是配置 upstream 和proxy_pass
```
worker_processes  1;

events {
    worker_connections  1024;
}
http {
    #gzip  on;
    # 负载均衡
    upstream mynode {
        ip_ip_hash;
        #server 0.0.0.0;
        #server 0.0.0.0;
    }
    server {
        listen       8080;
        server_name  localhost;

        location / {
            #反向代理
            proxy_pass http://mynode
        }
        #error_page  404              /404.html;
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }

}
```
2. [pm2]((http://pm2.keymetrics.io/)
```
{
  "apps" : [{
    "script"    : "app.js",
    "instances" : "max",
    "exec_mode" : "cluster",
    "watch": true
  }]
}
```


3. 