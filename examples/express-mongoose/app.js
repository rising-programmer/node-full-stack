//1.引入express模块
const express = require('express');
//2.创建app对象
const app = express();
//3.引入bodyParser
let bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//4.引入mongoose
const mongoose = require('mongoose');
let uri = 'mongodb://localhost:27017/hero';
global.conn = mongoose.createConnection(uri);
//5.设置路由
const hero = require('./router/hero')
app.use('/api',hero);
//6.定义服务启动端口
app.listen(3000,() => {
    console.log('app listening on port 3000.')
})