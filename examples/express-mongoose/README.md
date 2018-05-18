# express + mongoose

## 环境准备
- mongodb
<pre>
您可以自主安装，也可以通过[此文章](https://github.com/rising-programmer/node-full-stack/tree/master/db/mongodb)来学习安装mongodb
</pre>
- 创建项目
<pre>
mkdir express-mongoose && cd express-mongoose
</pre>
- 安装组件依赖
<pre>
npm init -y && npm install express body-parser mongoose --save
</pre>

## 开始搭建项目
1. 启动express服务

在项目根目录下新建app.js，并填充如下内容：
<pre>
//1.引入express模块
const express = require('express')
//2.创建app对象
const app = express()
//3.定义简单路由
app.use('/',(req,res) => {
  res.send('Hello!')
})
//4.定义服务启动端口
app.listen(3000,() => {
    console.log('app listening on port 3000.')
})
</pre>
上述步骤走完后，在命令行执行node app.js。通过浏览器访问localhost:3000,页面出现res.send（）的内容即表示成功。

2. 创建数据模型
在项目根目录下创建models文件夹，在models下创建hero.js，并填充如下内容：
<pre>
//引入mongoose模块
const mongoose = require('mongoose');
//定义数据模型
//这里mongoose.Schema最好要写上第二个参数，明确指定到数据库中的哪个表取数据，目的就是为了以后操作数据要去hero表中。
const heroSchema = mongoose.Schema({
  name :String,
  age : String,
  sex : String,
  address : String,
  dowhat : String,
  imgArr:[],
  favourite:String,
  explain:String
}, { collection: 'hero'})
//导出model模块
module.exports = conn.model('hero',heroSchema);

</pre>
3. 创建路由接口
在项目根目录下创建router文件夹，在router下创建hero.js，并填充如下内容：
<pre>
//引入express模块
const express = require("express");
//定义路由级中间件
const router = express.Router();
//引入数据模型模块
const Hero = require("../models/hero");

// 查询所有英雄信息路由
router.get("/hero", (req, res) => {
  Hero.find({})
    .sort({ update_at: -1 })
    .then(heros => {
      res.json(heros);
    })
    .catch(err => {
      console.log(2);
      res.json(err);
    });
});

// 通过ObjectId查询单个英雄信息路由
router.get("/hero/:id", (req, res) => {
  Hero.findById(req.params.id)
    .then(hero => {
      res.json(hero);
    })
    .catch(err => {
      res.json(err);
    });
});

// 添加一个英雄信息路由
router.post("/hero", (req, res) => {
  //使用Hero model上的create方法储存数据
  Hero.create(req.body, (err, hero) => {
    if (err) {
      res.json(err);
    } else {
      res.json(hero);
    }
  });
});

//更新一条英雄信息数据路由
router.put("/hero/:id", (req, res) => {
  Hero.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        name: req.body.name,
        age: req.body.age,
        sex: req.body.sex,
        address: req.body.address,
        dowhat: req.body.dowhat,
        favourite: req.body.favourite,
        explain: req.body.explain
      }
    },
    {
      new: true
    }
  )
    .then(hero => res.json(hero))
    .catch(err => res.json(err));
});

// 添加图片路由
router.put("/addpic/:id", (req, res) => {
  Hero.findOneAndUpdate(
    { _id: req.params.id },
    {
      $push: {
        imgArr: req.body.url
      }
    },
    {
      new: true
    }
  )
    .then(hero => res.json(hero))
    .catch(err => res.json(err));
});

//删除一条英雄信息路由
router.delete("/hero/:id", (req, res) => {
  Hero.findOneAndRemove({
    _id: req.params.id
  })
    .then(hero => res.send(`${hero.name}删除成功`))
    .catch(err => res.json(err));
});

module.exports = router;

</pre>
4. 修改app.js

初始化相关组件及路由，完整代码如下：
<pre>
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
</pre>

5. 重启node服务
<pre>
node index.js
</pre>

## 方法调用
1. 新增
<pre>
curl -s -X POST \
  http://localhost:3000/api/hero \
  -H "content-type: application/json" \
  -d '{	
    	"imgArr" : [ 
            "http://ossweb-img.qq.com/images/lol/web201310/skin/big157000.jpg", 
            "http://ossweb-img.qq.com/images/lol/web201310/skin/big157001.jpg", 
            "http://ossweb-img.qq.com/images/lol/web201310/skin/big157002.jpg" 
        ],
        "name" : "亚索",
        "age" : "22",
        "sex" : "man",
        "address" : "德玛西亚",
        "dowhat" : "中单、刺客",
        "favourite" : "死亡如风常伴吾身",
        "explain" : "亚索是一个百折不屈的艾欧尼亚人，也是一名身手敏捷的剑客，能够运用风的力量对抗敌人。年少轻狂的他曾为了荣誉而一再地损失珍贵的东西，他的职位、他的导师、最后是他的亲兄弟。他因无法摆脱的嫌疑而身败名裂，如今已是被人通缉的罪犯。亚索在家园的土地上流浪，寻找对过去的救赎。苍茫间，只有疾风指引着他的利剑。"
      }'
</pre>
2. 查询所有数据
<pre>
curl -s -X GET \
  http://localhost:3000/api/hero \
  -H "content-type: application/json" 
</pre>
3. 查询单个数据

具体参数会有所不同
<pre>
curl -s -X GET \
  http://localhost:3000/api/hero/5afd5a7b86333e48cdf2828e \
  -H "content-type: application/json" 
</pre>
4. 更新数据
<pre>
curl -s -X PUT \
  http://localhost:3000/api/hero/5afd61d586333e48cdf28290 \
  -H "content-type: application/json" \
  -d '{	
    	"imgArr" : [ 
            "http://ossweb-img.qq.com/images/lol/web201310/skin/big157000.jpg", 
            "http://ossweb-img.qq.com/images/lol/web201310/skin/big157001.jpg", 
            "http://ossweb-img.qq.com/images/lol/web201310/skin/big157002.jpg" 
        ],
        "name" : "亚索222",
        "age" : "23",
        "sex" : "man",
        "address" : "德玛西亚",
        "dowhat" : "中单、刺客",
        "favourite" : "死亡如风常伴吾身",
        "explain" : "亚索是一个百折不屈的艾欧尼亚人，也是一名身手敏捷的剑客，能够运用风的力量对抗敌人。年少轻狂的他曾为了荣誉而一再地损失珍贵的东西，他的职位、他的导师、最后是他的亲兄弟。他因无法摆脱的嫌疑而身败名裂，如今已是被人通缉的罪犯。亚索在家园的土地上流浪，寻找对过去的救赎。苍茫间，只有疾风指引着他的利剑。"
      }'
</pre>
5. 删除数据
<pre>
curl -s -X DELETE \
  http://localhost:3000/api/hero/5afd5a7b86333e48cdf2828e \
  -H "content-type: application/json" 
</pre>


