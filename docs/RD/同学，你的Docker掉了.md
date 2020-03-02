
## 什么是docker

Docker是一个开源的引擎，可以轻松的为任何应用创建一个轻量级的、可移植的、自给自足的容器。开发者在笔记本上编译测试通过的容器可以批量地在生产环境中部署。

Docker 是个划时代的开源项目，它彻底释放了计算虚拟化的威力，极大提高了应用的维护效率，降低了云计算应用开发的成本！使用 Docker，可以让应用的部署、测试和分发都变得前所未有的高效和轻松！

Docker Go 语言 进行开发实现，基于 Linux 内核的 cgroup，namespace，以及 AUFS 类的 Union FS 等技术，对进程进行封装隔离，属于 操作系统层面的虚拟化技术。由于隔离的进程独立于宿主和其它的隔离的进程，因此也称其为容器。

**容器 = image-spec + runtime-spec**

**image-spec重点是分层文件系统**

**runtime-spec重点是namespace和cgroup**

Docker 将应用程序与该程序的依赖，打包在一个文件里面。运行这个文件，就会生成一个虚拟容器。程序在这个虚拟容器里运行，就好像在真实的物理机上运行一样。有了 Docker，就不用担心环境问题。


总体来说，Docker 的接口相当简单，用户可以方便地创建和使用容器，把自己的应用放入容器。容器还可以进行版本管理、复制、分享、修改，就像管理普通的代码一样。

Docker 在容器的基础上，进行了进一步的封装，从文件系统、网络互联到进程隔离等等，极大的简化了容器的创建和维护。使得 Docker 技术比虚拟机技术更为轻便、快捷。

下面的图片比较了 Docker 和传统虚拟化方式的不同之处。传统虚拟机技术是虚拟出一套硬件后，在其上运行一个完整操作系统，在该系统上再运行所需应用进程；而容器内的应用进程直接运行于宿主的内核，容器内没有自己的内核，而且也没有进行硬件虚拟。因此容器要比传统虚拟机更为轻便。


![image](//pic1.58cdn.com.cn/nowater/cxnomark/n_v2e98233d419ea498794cbbb431c326ec4.png)

## 产生原因

软件开发的问题之一：环境配置问题，我们必须确保在不同的机器上操作系统的设置，各种依赖包和组件的安装都是一样的，假如我们好不容易配置好环境，在换一个机器还要重新配置。可不可以安装软件的时候把原始环境一摸一样复制过来？

**虚拟机**就是带环境安装的一种解决方案。它可以在一种操作系统里面运行另一种操作系统。但是
- 占用资源多：我们真正需要的只有很少的内存，但是还是虚拟机还是需要至少几百MB运行。
- 步骤冗余
- 启动慢

**Linux 容器** 解决了虚拟机的弊端，相当于轻量级的虚拟机。Linux 容器不是模拟一个完整的操作系统，而是对进程进行隔离。属于进程级别的容器。

Docker 在容器的基础上，进行了进一步的封装，从文件系统、网络互联到进程隔离等等，极大的简化了容器的创建和维护。使得 Docker 技术比虚拟机技术更为轻便、快捷。

## 为什么用docker

- 更高效的使用系统资源

不需要进行硬件虚拟以及运行完整操作系统等额外开销，Docker 对系统资源的利用率更高
- 更快速的启动时间

由于直接运行于宿主内核，无需启动完整的操作系统，因此可以做到秒级、甚至毫秒级的启动时间。大大的节约了开发、测试、部署的时间。

- 一致的运行环境

杜绝“这段代码在我机器上没问题啊”的问题
- 持续交付和部署

使用 Docker 可以通过定制应用镜像来实现持续集成、持续交付、部署。开发人员可以通过 Dockerfile 来进行镜像构建，并结合 持续集成(Continuous Integration) 系统进行集成测试，而运维人员则可以直接在生产环境中快速部署该镜像，甚至结合 持续部署(Continuous Delivery/Deployment) 系统进行自动部署

- 更轻松的迁移

由于 Docker 确保了执行环境的一致性，使得应用的迁移更加容易。Docker 可以在很多平台上运行，无论是物理机、虚拟机、公有云、私有云，甚至是笔记本，其运行结果是一致的。因此用户可以很轻易的将在一个平台上运行的应用，迁移到另一个平台上，而不用担心运行环境的变化导致应用无法正常运行的情况。
- 更轻松的维护和扩展

Docker 使用的分层存储以及镜像的技术，使得应用重复部分的复用更为容易，也使得应用的维护更新更加简单，基于基础镜像进一步扩展镜像也变得非常简单。此外，Docker 团队同各个开源项目团队一起维护了一大批高质量的 官方镜像，既可以直接在生产环境使用，又可以作为基础进一步定制，大大的降低了应用服务的镜像制作成本

- 对比虚拟机

特性 | 容器 | 虚拟机
---|---|---
启动 | 秒级 | 分钟级
硬盘使用 |  一般为 MB |    一般为 GB
性能 |    接近原生 |  弱于
系统支持量 | 单机支持上千个容器 | 一般几十个


## docker的用途

- web应用的自动化打包和发布；
- 自动化测试和持续集成、发布；
- 在服务型环境中部署和调整数据库或其他的后台应用；
- 从头编译或者扩展现有的OpenShift或Cloud； 
- Foundry平台来搭建自己的PaaS环境。

## docker基本概念

### 镜像 Image
操作系统分为内核和用户空间。对于 Linux 而言，内核启动后，会挂载 root 文件系统为其提供用户空间支持。而 Docker 镜像（Image），就相当于是一个 root 文件系统。

比如官方镜像 ubuntu:18.04 就包含了完整的一套 Ubuntu 18.04 最小系统的 root 文件系统。在比如node....

Docker 镜像是一个特殊的文件系统，除了提供容器运行时所需的程序、库、资源、配置等文件外，还包含了一些为运行时准备的一些配置参数（如匿名卷、环境变量、用户等）。镜像不包含任何动态数据，其内容在构建之后也不会被改变。

Docker 设计时，就充分利用 Union FS 的技术，将其设计为**分层存储**的架构。
镜像构建时，会一层层构建，前一层是后一层的基础。每一层构建完就不会再发生改变，后一层上的任何改变只发生在自己这一层。

分层存储的特征还使得镜像的复用、定制变的更为容易。甚至可以用之前构建好的镜像作为基础层，然后进一步添加新的层，以定制自己所需的内容，构建新的镜像。


### 容器 Container
镜像和容器的关系，就像是面向对象程序设计中的 类 和 实例 一样，镜像是静态的定义，容器是镜像运行时的实体。容器可以被创建、启动、停止、删除、暂停等。

容器的实质是进程，但与直接在宿主执行的进程不同，容器进程运行于属于自己的独立的 命名空间。因此容器可以拥有自己的 root 文件系统、自己的网络配置、自己的进程空间，甚至自己的用户 ID 空间。

每一个容器运行时，是以镜像为基础层，在其上创建一个当前容器的存储层，我们可以称这个为容器运行时读写而准备的存储层为 **容器存储层**。

镜像是多层存储，每一层是在前一层的基础上进行的修改；而容器同样也是多层存储，是在以镜像为基础层，在其基础上加一层作为容器运行时的存储层。

容器存储层的生存周期和容器一样，容器消亡时，容器存储层也随之消亡。因此，任何保存于容器存储层的信息都会随容器删除而丢失。

### 仓库 Repository

镜像构建完成后，就在当前宿主机上运行，但是，如果需要在其它服务器上使用这个镜像，我们就需要一个集中的存储、分发镜像的服务，Docker Registry 就是这样的服务。

一个 Docker Registry 中可以包含多个 仓库（Repository）；每个仓库可以包含多个 标签（Tag）；每个标签对应一个镜像。**<仓库名>:<标签>**


## docker 安装

mac: Homebrew

    brew cask install docker
https://docs.docker.com/docker-for-mac/install/#install-and-run-docker-for-mac
https://yeasy.gitbooks.io/docker_practice/content/install/mac.html

cenOS:

    yum update -y

    yum install docker
    
检查安装版本
```
$ docker --version
Docker version 19.03.1, build 74b1e89
$ docker-compose --version
docker-compose version 1.24.1, build 4667896b
$ docker-machine --version
docker-machine version 0.16.1, build cce350d7
```

尝试运行一个nginx服务

```
docker run -d -p 80:80 --name webserver nginx
访问http://localhost
```

停止nginx并删除

```
$ docker stop webserver
$ docker rm webserver
```

## docker使用

### docker 常用命令解析

### 1.镜像

1.获取镜像 

    docker pull [选项] [Docker Registry 地址[:端口号]/]仓库名[:标签]
    -it -i：交互式操作，一个是 -t 终端。
    --rm: 容器退出后将其删除。
2.我们就能够以这个镜像为基础启动并运行一个容器
    
    docker run 

3.列出镜像

    docker image ls
    docker image ls -a 显示所有
    docker image ls [nginx] 根据仓库名列出镜像
    
4.删除镜像  

    docker image rm [选项] <镜像1> [<镜像2> ...]
    这里的镜像可以使镜像端id,长id,镜像名，镜像摘要等
    docker image rm 501
    docker image rm centos
    docker image rm node@sha256:b4f0e0bdeb578043c1ea6862f0d40cc4afe32a4a582f3be235a3b164422be228
    配合ls命令
    docker image rm $(docker image ls -q redis) 删除所有有仓库名为redis的镜像
    docker image rm $(docker image ls -q -f before=mongo:3.2)删除3.2版本之前的

5.定制镜像

    - docker commit 一般很少使用
    - Dockerfile定制 **Dockerfile是我们定制镜像常用的，单独拿出来讲**
6.构建镜像

    - docker build -t <name> .
    - -t参数用来指定 image 文件的名字，后面还可以用冒号指定标签。如果不指定，默认的标签就是latest。最后的那个点表示 Dockerfile 文件所在的路径,.实际上是在指定上下文的目录。  
### 2.容器

1. 查看
    
    docker container ls
    docker container ls -a

1.启动容器

    docker run 基于镜像新建一个容器并启动
    docker container start 直接将一个已经终止的容器启动
    --name命名
    eg:docker run -d -p 80:80 --name webserver nginx

2.后台运行 -d 
    
    需要让 Docker 在后台运行而不是直接把执行命令的结果输出在当前宿主机下。此时，可以通过添加 -d 参数来实现,会返回一个id
3.获取容器的输出信息 

    docker container logs [container ID or NAMES]
4.终止容器

    docker container stop [container ID or NAMES]
5.重启容器

    docker container restart [container ID or NAMES]
6.进入容器

    docker exec 配合 -i -t命令
    //-i -t 一起使用时，可以看到我们熟悉的 Linux 命令提示符
    docker run -dit nginx
    docker container ls
    docker exec -it 69d1 bash
7.删除容器
    
    //删除一个终止的容器
    docker container rm  [container ID or NAMES]
    //删除一个正在运行的容器
    docker container rm  -f [container ID or NAMES]
    //清除所有终止容器
    //docker container prune
7.导入导出

    docker export 7691a814370e > ubuntu.tar
    docker import - test/ubuntu:v1.0

### 3.仓库

1.注册https://hub.docker.com 

2.登录 docker login

3.查找 docker search [xxx] 

4.拉取 docker pull [xxx] 

5.推送  docker tag [xxx] username/[xxx] 然后  docker push username/[xxx]

5.自动构建 Docker Hub 指定跟踪一个目标网站（支持 GitHub 或 BitBucket）上的项目，一旦项目发生新的提交 

6.私有仓库 ...

## docker三剑客

### 1. Compose定义和运行多个 Docker 容器的应用

>场景：工作中很少单独使用一个容器，多容器相互配合来完成某项任务，比如一个web项目，除了web服务容器本身，还需要加上后端的数据库服务容器，负载均衡服务。需要编写docker-compose.yml来定义一组相关联的应用容器为一个项目。

**术语：**

服务 (service)：一个应用容器，实际上可以运行多个相同镜像的实例。

项目 (project)：由一组关联的应用容器组成的一个完整业务单元。
一个项目可以由多个服务（容器）关联而成，Compose 面向项目进行管理。

实例：

```
version: '3' //版本
services:

  web:
    build: . //指定 Dockerfile 所在文件夹的路径,Compose 将会利用它自动构建这个镜像，然后使用这个镜像。
    ports: //映射端口
     - "5000:5000"

  redis:
    image: "redis:alpine" //指定镜像名
```
### 2. Machine
负责在多种平台上快速安装 Docker 环境。
### 3. Swarm
提供 Docker 容器集群服务，是 Docker 官方对容器云生态进行支持的核心方案。

使用它，用户可以将多个 Docker 主机封装为单个大型的虚拟 Docker 主机，快速打造一套容器云平台。

## docker部署实战

1.更新软件库

    yum update -y

2.安装docker

    yum install docker

3.启动docker服务

    service docker start
    
4.设置docker开机启动

    chkconfig docker on
    
5.开发node应用

6.创建Dockerfile .dockerignore文件

7.开发文件拷贝到开发机

    scp hellodocker.zip root@124.156.110.41:/webapp/
    
8. 将文件打包[构建 image 文件]
> docker build 命令会将该目录下的内容打包交给 Docker 引擎以帮助构建镜像

    docker [image] build -t hellodocker .

    
9.查看端口占用

    #netstat -lnp|grep 8080
    lsof -i :8080
    ps pid
    kill -9 pid

10. 生成docker实例[生成容器]
>docker container run命令会从 image 文件生成容器。

    sudo docker build -t hellodocker .
    docker ps -a 查看container状态
    docker stop xx
    //删除实例
    docker rm hellodocker
    docker rmi hellodocker

11.开启实例

    后台开启
    sudo docker run -d --name hellodocker -p 80:8081 hellodocker
    进入容器
    docker container run -p 8000:3000 -it hellodocker /bin/bash
    
**参数解读** -p:端口映射把容器的8081端口映射到本机的80端口

**doker pm2集成**: 
pm2改为pm2-docker
http://pm2.keymetrics.io/docs/usage/docker-pm2-nodejs/

12.进入docker容器

    sudo docker [container] exec -it [containerID] /bin/bash 
    
**参数解读**-it:容器的 Shell 映射到当前的 Shell，然后你在本机窗口输入的命令，就会传入容器。
/bin/bash：容器启动以后，内部第一个执行的命令

13.从正在运行的docker容器里面，把文件拷贝到本机

    docker container cp [containID]:[/path/to/file] 


## Dockerfile定制镜像

>镜像的定制实际上就是定制每一层所添加的配置、文件。如果我们可以把每一层修改、安装、构建、操作的命令都写入一个脚本，用这个脚本来构建、定制镜像。

Dockerfile 中每一个指令都会建立一层,应该尽量减少层数，可以使用&& 串联命令 最多不超过127层。

## 指令详解

- FROM指定基础镜像

>定制镜像一定是以一个镜像为基础，docker hub上有很多高质量的官方镜像，服务类：nginx redis mysql php,语言类的node python golang等，更为基础的操作系统镜像ubuntu centos等 scratch表示空白镜像。使用 Go 语言 开发的应用很多会使用这种方式来制作镜像，这也是为什么有人认为 Go 是特别适合容器微服务架构的语言的原因之一。

- RUN执行命令
    - shell 格式：  RUN <命令>
    ```
    RUN echo '<h1>Hello, Docker!</h1>' > /usr/share/nginx/html/index.html
    ```
    - exec格式： RUN ['可执行文件','参数1','参数2']
    ```
    RUN 
    ```
- COPY 指令将从构建上下文目录中 <源路径> 的文件/目录复制到新的一层的镜像内的 <目标路径> 位置。

    ```
    - COPY [--chown=<user>:<group>] 源路径... <目标路径>
    - COPY [--chown=<user>:<group>] ["<源路径1>",... "<目标路径>"]
    <源路径> 可以是多个 或通配符，目标路径可以是容器内的绝对路径，或者工作目录（WORKDIR）的相对路径
    COPY package.json /usr/src/app/
    ```
- WORKDIR 指定工作目录
>使用 WORKDIR 指令可以来指定工作目录（或者称为当前目录），以后各层的当前目录就被改为指定的目录。

**如果需要改变以后各层的工作目录的位置，使用 WORKDIR 指令。**

**不要把Dockerfile 当成 Shell 脚本来书写!!**

eg:

```
每一个 RUN 都是启动一个容器、执行命令、然后提交存储层文件变更
RUN cd /app
RUN echo "hello" > world.txt
```
    并不会在/app/world.txt修改hello，在 Shell 中，连续两行是同一个进程执行环境，因此前一个命令修改的内存状态，会直接影响后一个命令；而在 Dockerfile 中，这两行 RUN 命令的执行环境根本不同，是两个完全不同的容器
    
- ADD 更高级的复制文件

>ADD 指令会令镜像构建缓存失效，从而可能会令镜像构建变得比较缓慢。,仅在需要自动解压缩的场合使用 ADD

- CMD 容器启动命令 用于指定默认的容器主进程的启动命令的
    - shell 格式：CMD <命令>
    - exec 格式：CMD ["可执行文件", "参数1", "参数2"...]
    ```
    CMD ["npm","start"]
    CMD npm install
    ```
    **CMD和RUN 区别**
    RUN命令在 image 文件的构建阶段执行，执行结果都会打包进入 image 文件；CMD命令则是在容器启动后执行。另外，一个 Dockerfile 可以包含多个RUN命令，但是只能有一个CMD命令。
    
- ENV 设置环境变量
```
    - ENV <key> <value>
    - ENV <key1>=<value1> <key2>=<value2>...
```
设置环境变量之后，后续指令就可以使用该环境变量，便于管理。

- EXPOSE 声明运行时容器提供服务端口。
    >只是**声明**，运行时并不会因为这个声明应用就会开启这个端口服务。1帮助镜像使用者理解这个镜像服务的守护端口，以方便配置映射；2运行时使用随机端口映射时，会自动随机映射EXPOSE的端口(docker run -p)
    
    **EXPOSE和-p 宿主端口:容器端口 区别** -p是映射宿主端口和容器端口，EXPOSE仅仅是声明容器打算使用什么端口，并不会自动在宿主端口映射。

- USER 指定当前用户
- HEALTHCHECK 健康检查
- ARG 构建参数
- ONBUILD <其它指令> 不会构建当前镜像，只有被当成"父类"去苟江下一级镜像时才会执行。




node官方镜像

    ```
    ENV NODE_VERSION 7.2.0
    
    RUN curl -SLO "https://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-linux-x64.tar.xz" \
      && ...
    ```

```
#该 image 文件继承官方的 node image。
FROM node:12
#将当前目录下的所有文件（除了.dockerignore排除的路径），都拷贝进入 image 文件的/app目录
COPY . /app
#指定接下来的工作路径为/app
WORKDIR /app
#在/app目录下，运行npm install命令安装依赖。注意，安装后所有的依赖，都将打包进入 image 文件
RUN npm install --registry=https://registry.npm.taobao.org
#将容器 3000 端口暴露出来
EXPOSE 3000
CMD node demos/01.js

```






```
#设置基础镜像,如果本地没有该镜像，会从Docker.io服务器pull镜像
#该镜像继承与官方的node image

FROM index.tenxcloud.com/docker_library/alpine:edge

#Install nodejs
RUN echo '@edge http://nl.alpinelinux.org/alpine/edge/main' >> /etc/apk/repositories
RUN apk update
RUN apk add --no-cache nodejs-lts@edge

#创建你的工作文件夹+应用程序文件夹
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

#安装依赖
COPY  package.json /usr/src/app
RUN npm config set registry https://registry.npm.taobao.org
RUN npm install

#编译运行node项目
COPY  . /usr/src/app

#暴露容器端口
EXPOSE 8081
CMD ["npm","start"]
```

## 架构演变

docker创建微服务人话版

    1. 传统MVC 
    2. 通过 **依赖注入**（Dependency Injection，简称DI）实现 控制反转(Inversion of Control)IOC M自动注入C
    3. 把servers分布到各个docker容器里面去,本来是你自己项目里面自己的某个服务，放到容器里面去后，就是谁都可以用的对外服务
    
**RPC(Remote Procedure Calls)远程过程调用**

**RabbitMQ 实现RPC(message queue)**

**node微服务框架seneca:向外暴露规则，一问一答的形式**

## 微服务注册发现集群搭建
>成百上千的微服务而且还要动态伸缩，如果以人工写port host的硬编码方式肯定不行，
微服务应该做到ip和port自动分配，减少人工干预，我们需要每个服务能动态的创建地址，而且调用方要能感知地址变化。

1.轻量级: registator --> consul --> consul_template --> nginx --> docker

![image](//pic1.58cdn.com.cn/nowater/cxnomark/n_v2a32aaf284f0c4ef5a678a97c2aa3e8b2.png)

2.kubernetes(k8s)搭建docker集群

![image](https://pic4.zhimg.com/80/v2-8cb338cd8923fa0e6857f45facc8f00f_hd.jpg)






[10分钟看懂Docker和K8S](https://zhuanlan.zhihu.com/p/53260098)

[基于Consul+Registrator+Nginx实现容器服务自动发现的集群框架](https://blog.51cto.com/ganbing/2086851)

[docker 入门阮一峰](http://www.ruanyifeng.com/blog/2018/02/docker-tutorial.html)

[docker微服务教程](http://www.ruanyifeng.com/blog/2018/02/docker-wordpress-tutorial.html)

[docker从入门到实战](https://yeasy.gitbooks.io/docker_practice/content/)

[docker入门实战](https://yuedu.baidu.com/ebook/d817967416fc700abb68fca1?fr=aladdin&key=docker&f=read)