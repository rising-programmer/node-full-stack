# mongodb
## [下载](https://www.mongodb.com/download-center?jmp=tutorials&_ga=2.178618402.726314600.1526540381-1725976139.1526540381#community)
## 环境配置
- 解压
<pre>
tar -zxvf mongodb-osx-ssl-x86_64-3.6.4.tgz
mkdir -p mongodb
cp -R -n mongodb-osx-ssl-x86_64-3.6.4/ mongodb
</pre>
- 设置环境变量
<pre>
export PATH=<mongodb-install-directory>/bin:$PATH
</pre>
## 启动服务
1. 创建数据目录
默认目录是/data/db,也可以通过dbpath进行指定
<pre>
mkdir -p /data/db
</pre>
2. 启动mongodb
<pre>
mongod --dbpath /data/db
</pre>
3. 验证是否启动成功
当看到如下信息，表明启动成功:
<pre>
[initandlisten] waiting for connections on port 27017
</pre>
4. 使用mongodb
<pre>
mongo --host 127.0.0.1:27017
</pre>

