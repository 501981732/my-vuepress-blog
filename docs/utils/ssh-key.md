> 一般我都是用2个git账号，一个个人的github,一个公司的gitlab，这就需要我们在本地创建多个公钥信息。

1. **自定义第二个公钥**

```
id_rsa_github 
> ssh-keygen -t rsa -C "xxx@xxx.com"
```
不要一直回车，记得修改文件名称例如id_rsa_github
ssh_key就会保存到相对文件下，目录下会生成id_rsa_github，id_rsa_github.pub两个文件;

2. **设置密码**

这个密码在你提交代码到Github时会用到（最好和github代码一致）

3. **将ssh-key添加到ssh-agent**

ssh-key 添加到ssh agent ，因为默认只读 id_rsa，首先查看一下已经添加进去的 ssh-key,当出现下面 这种情况是说明 ssh agent 里面并没有把我们新生产的 ssh-key添加进去

```
ssh-add -l
The agent has no identities.
```

可以选择添加或全部添加到ssh-anent

```
//全部添加
ssh-add  

//指定添加（可以切换到.ssh下添加，也可以直接指定路径添加）
.ssh ssh-add id_rsa_test_github                   

```
这是再查看

```
ssh-add -l
```

4. **我们将 id_rsa_github.pub 中的内容粘帖到 github 的 SSH-key 的配置中**

```
获取公钥
 ssh  cat id_rsa_github.pub
```
复制粘贴到你的github的setting > SSH里面 

5. **测试**

```
ssh -T git@github.com
Hi XXX! You've successfully authenticated, but GitHub does not provide shell access.
```

搞定!

