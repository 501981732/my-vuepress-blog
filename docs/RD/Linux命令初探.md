### Linux

### 操作系统概述
- 适合工作和娱乐的windows
- Linux开源 适合开发
- unix商业
- 好用的macOS
ubuntu centOS(推荐) Fedora redhat Debian

### 远程登录操作系统
windows下
 - Xshell
 - putty
 - cmder下的ssh
mac下 ssh
```
ssh root@192.xxx.xx.xx
第一次会有提示，点yes 保持指纹
输入密码
```

### 常用重要操作系统命令
    - ls (-a 显示隐藏文件)
    - pwd
    - cp aa  bb/aa 复制
    - cp -R aa bb/aa
    - 

#### 行编辑命令 vi/vim
    - vi a.txt 查看没有则创建，默认只读模式
    - i/a （insert/append）修改模式可编辑
    - esc + :wq (write+quit) 保存退出
    - esc + q! 强制退出不保存
    - / + xx  查找命令之后 n （next）查找的下一个匹配项 p (prev)查找的上一个匹配项

#### 服务管理命令
    - systemctl status mongodb（要查看的命令）
    - systemctl stop xx
    - systemctl start xx
    - systemctl enable xx 设置开机启动xx服务
    - systemctl disenable xx 取消开机启动xx服务

#### 网络管理命令 ifconfig ip router
	centOS 7.0以下老命令 *ifconfig* *router* ,新命令 ip

#### 命令行下载curl,wget

	- yum install curl
	- curl
	- wget

#### 怎么查看liunx命令下的帮助
	- wget -h/--help
	- man
#### 上传
    - scp -r xx/ root@101.200.185.250:/opt/:/h/www/static/
    - ssh-copy -i xx 用户名@服务器ip或者域名
#### 在终端下不小心按了 ctrl + s (这里是sleep的意思)？
	- ctrl + p
	
#### 常用快捷键
	- ctrl + c 结束正在运行的程序 [ping telnet]
	- ctrl + d 结束输入或者
	- ctrl + a 暂停屏幕输出
	- ctrl + q 回复屏幕输出
	- ctrl + l 清屏 等于clear
	- ctrl + a/e 快速移动光标到行首/尾
	
### 进程与线程
	- ps aux | grep node 查看node进程
	- lsof - i :8080 查看8080端口信息 pid等
	- top命令
	- kill pkill 杀死进程     kill (-9表示强制) tcp:8080 pkill + 具体程序名称
	- w
	- 进程的目的就是担当分配系统资源（CPU时间 内存）
	- 进程是操作系统能够进行运算调度的最小单位
	- 协程是一种用户态的轻量级线程，无法利用多核资源
	- IO密集型应用的发展：多进程 ->多线程 ->事件驱动 -> 协程
	- CPU密集型应用的发展： 多进程 -> 多线程
	- 调度和切换的时间：进程 > 线程 > 携程 
	- 操作系统的设计可以归纳三点：
		1. 以多进程形式，允许多个任务同时进行
		2. 以线程形式，允许单个任务分成不同的部分进行
		3. 提供协程机制，一方面允许进程之间和线程之间发生冲突，一方面进程之间和线程之间共享资源。

### Liunx网络的坑
	- 查看和配置网络基本信息 ifconfig ip
	- 重启网卡  （云服务器不要搞）
	- 查看路由配置信息 router
	- 排查网络故障 tracerout
	- 找到占用网络端口的进程
		- ss -p | grep 8080
		- netstat命令

### 免密登录
#### 免密登录原理

> 把密码以文件的形式生成，以公钥和私钥的形式来比对，比对成功就登录成功。

#### 配置免密登录步骤
	1. 生成秘钥对
		- ssh-keygen -t rsa -C "你自己的名字" -f "你自己的名字_rsa"
	2. 上传配置公钥
        - 上传到服务器对应账号的home路径下的 ./ssh中(ssh-copy -i '公钥文件名' 用户名@服务器ip或者域名) 或者 scp命令
        - 配置公钥文件访问 权限为600 （chmod 600 文件名）
	3. 配置本地私钥(相当于密码)
        - 把第一步生成的吧秘钥复制到你的home目录下的.ssh/目录下
        配置你的私钥文件访问权限为600  （chmod 600 文件名）
	4. 免密登录功能的本地配置文件
        - 编辑自己home下.ssh目录下的config文件
        - 配置config文件的访问权限为644
        - 假若不依赖配置文件的话,需要制定私钥文件 ssh -i 私钥文件路径 root@xx.xx.xx
	

#### config文件
```
User root  //用户名
Host gblw    //别名
HostName www.xx.xx // 服务器IP/服务器IP解析的网址
Port 22     //端口 默认22
StricHostKeyChecking no  //热键检测
IdentityFile ~/.ssh/id_rsa //私钥文件路径
IdentitiesOnly yes
Protocol 2 //协议版本
Compression yes
SwrverAliveInterval 60
SwrverAliveCountMax 20
LogLevel INFO
```
配置完之后 再次登录的话就是

    ssh gblw 就好啦
    之前是 ssh root@xxxx 回车 在输入密码

### liunx安装node

1. 安装V8.x: 
    - #curl --silent --location https://rpm.nodesource.com/setup_8.x | bash -
V7.x:

2.yum安装node.js

    yum install -y nodejs

3.查看node.js版本

    node -v