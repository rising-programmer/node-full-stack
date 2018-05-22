# express + mongoose + vue

## 环境准备
- mongodb
<pre>
您可以自主安装，也可以通过[此文章](https://github.com/rising-programmer/node-full-stack/tree/master/db/mongodb)来学习安装mongodb
</pre>
- 创建项目
<pre>
vue init webpack express-mongoose-vue

cd express-mogoose-vue && npm install

npm run dev
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
在项目根目录下创建model文件夹，在model下创建hero.js，并填充如下内容：
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
const Hero = require("../model/hero");

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

## vue开发

### 安装依赖
<pre>
npm install element-ui vue-resource
</pre>

### 创建页面
src/components下建立两个页面List.vue(首页)和Detail.vue(详情页)，内容分别如下：
<pre>
<template lang="html">

  <div class="list">
      <el-table
    :data="tableData"
    stripe
    element-loading-text="拼命加载中"
    header-row-class-name="tableHeader"
    v-loading.fullscreen.lock="loading"
    empty-text="亲，暂时没有数据哦"
    border
    style="width: 100%">
            <el-table-column
            fixed
            prop="name"
            label="英雄"
            align="center"
            width="120">
            </el-table-column>
            <el-table-column
            prop="age"
            label="年龄"
            align="center"
            width="100">
            </el-table-column>
            <el-table-column
            label="性别"
            align="center"
            width="100">
                    <template slot-scope="scope">
                        {{jungleSex(scope.row.sex)}}
                    </template>
            </el-table-column>
            <el-table-column
            prop="address"
            label="籍贯"
            align="center"
            width="150">
            </el-table-column>
            
            <el-table-column
            prop="dowhat"
            label="位置"
            align="center"
            width="150">
            </el-table-column>
            <el-table-column
            prop="favourite"
            label="台词"
            align="center"
            width="301">
            </el-table-column>
            <el-table-column
            label="操作"
            align="center"
            width="360">
            <template slot-scope="scope">
                <el-button  size="small" type="primary" @click="toDetail(scope.row['_id'])">详情</el-button>
                <el-button  size="small" type="success" @click="modify(scope.row)">修改</el-button>
                <el-button type="danger" size="small" @click="deleteDate(scope.row['_id'])">删除</el-button>
                <el-button type="warning" size="small" @click="addPic(scope.row['_id'])">添加图片</el-button>
            </template>
            </el-table-column>
  </el-table>

    <!-- 新增数据 -->
  <el-dialog title="新增数据" :visible.sync="addFormVisible" class="addArea" modal custom-class="addFormArea" @close="closeAdd">
  <el-form :model="addForm" class="addForm">

    <el-form-item label="英雄" :label-width="formLabelWidth">
      <el-input v-model="addForm.name" auto-complete="off"></el-input>
    </el-form-item>

    <el-form-item label="年龄" :label-width="formLabelWidth">
      <el-input v-model="addForm.age" auto-complete="off"></el-input>
    </el-form-item>

    <el-form-item label="性别" :label-width="formLabelWidth">
      <el-select v-model="addForm.sex" placeholder="请选择性别" class="sexArea">
        <el-option label="汉子" value="man"></el-option>
        <el-option label="妹子" value="woman"></el-option>
      </el-select>
    </el-form-item>

     <el-form-item label="籍贯" :label-width="formLabelWidth">
      <el-input v-model="addForm.address" auto-complete="off"></el-input>
    </el-form-item>

    <el-form-item label="位置" :label-width="formLabelWidth">
      <el-input v-model="addForm.dowhat" auto-complete="off"></el-input>
    </el-form-item>

    <el-form-item label="台词" :label-width="formLabelWidth">
      <el-input v-model="addForm.favourite" auto-complete="off"></el-input>
    </el-form-item>

    <el-form-item label="背景" :label-width="formLabelWidth">
      <el-input v-model="addForm.explain" auto-complete="off"></el-input>
    </el-form-item>


  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="addFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="addSure">确 定</el-button>
  </div>
</el-dialog>

<!-- 修改数据 -->
  <el-dialog title="修改数据" :visible.sync="modifyFormVisible" class="addArea" modal custom-class="addFormArea">
  <el-form :model="modifyForm" class="addForm">

    <el-form-item label="英雄" :label-width="formLabelWidth">
      <el-input v-model="modifyForm.name" auto-complete="off"></el-input>
    </el-form-item>

    <el-form-item label="年龄" :label-width="formLabelWidth">
      <el-input v-model="modifyForm.age" auto-complete="off"></el-input>
    </el-form-item>

    <el-form-item label="性别" :label-width="formLabelWidth">
      <el-select v-model="modifyForm.sex" placeholder="请选择性别" class="sexArea">
        <el-option label="男" value="man"></el-option>
        <el-option label="女" value="woman"></el-option>
      </el-select>
    </el-form-item>

     <el-form-item label="籍贯" :label-width="formLabelWidth">
      <el-input v-model="modifyForm.address" auto-complete="off"></el-input>
    </el-form-item>

    <el-form-item label="位置" :label-width="formLabelWidth">
      <el-input v-model="modifyForm.dowhat" auto-complete="off"></el-input>
    </el-form-item>

    <el-form-item label="台词" :label-width="formLabelWidth">
      <el-input v-model="modifyForm.favourite" auto-complete="off"></el-input>
    </el-form-item>

    <el-form-item label="背景" :label-width="formLabelWidth">
      <el-input v-model="modifyForm.explain" auto-complete="off"></el-input>
    </el-form-item>


  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="modifyFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="modifySure">确 定</el-button>
  </div>
</el-dialog>


<!-- 添加图片 -->
<el-dialog title="添加图片" :visible.sync="addpicVisible" class="addPicArea" @close="closePicAdd">
  <el-form :model="addpicform">
    <el-form-item label="图片地址" :label-width="formLabelWidth">
      <el-input v-model="addpicform.url" auto-complete="off"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="addpicVisible = false">取 消</el-button>
    <el-button type="primary" @click="addpicSure">确 定</el-button>
  </div>
</el-dialog>

<el-button type="primary" class="addBtn" @click="add" icon="el-icon-plus">添加</el-button>
  
  </div>
</template>

<script>
export default {
  name: "list",
  data: function() {
    return {
      title: "hello world",
      tableData: [],
      addFormVisible: false,
      modifyFormVisible: false,
      addpicVisible: false,
      modifyId: "",
      addpicId: "",
      addpicform: {
        url: ""
      },
      addForm: {
        name: "",
        age: "",
        sex: "",
        address: "",
        dowhat: "",
        favourite: "",
        explain: ""
      },
      modifyForm: {
        name: "",
        age: "",
        sex: "",
        address: "",
        dowhat: "",
        favourite: "",
        explain: ""
      },
      formLabelWidth: "120px",
      loading: false
    };
  },
  methods: {
    jungleSex: function(sex) {
      if (sex == "man") {
        return "汉子";
      } else if (sex == "woman") {
        return "妹子";
      } else {
        return "";
      }
    },
    add: function() {
      this.addFormVisible = true;
    },
    addSure: function() {
      var that = this;

      this.addFormVisible = false;
      //调新增接口,在回调函数中刷新一次

      var addObj = this.addForm;

      this.$http.post("/api/hero", addObj).then(
        function(response) {
          if (response.ok) {
            this.$message({
              message: "添加成功",
              type: "success",
              onClose: function() {
                that.getAll();
              }
            });
          }
        },
        function() {
          // this.loading = false;
        }
      );
    },
    // 关闭dialog的函数
    closeAdd: function() {
      this.addForm.name = "";
      this.addForm.age = "";
      this.addForm.sex = "";
      this.addForm.address = "";
      this.addForm.dowhat = "";
      this.addForm.name = "";
      this.addForm.explain = "";
    },
    //修改操作
    modify: function(row) {
      this.modifyFormVisible = true;
      this.modifyForm = Object.assign({}, row);
      this.modifyId = row["_id"];
    },
    modifySure: function() {
      var that = this;
      this.$http
        .put(`/api/hero/${this.modifyId}`, this.modifyForm, {
          emulateJSON: true
        })
        .then(
          function(response) {
            if (response.ok) {
              this.modifyFormVisible = false;
              this.$message({
              message: "修改成功",
              type: "success",
              onClose: function() {
                that.getAll();
              }
            });
            }
          },
          function() {
            // this.loading = false;
          }
        );
    },
    // 删除操作
    deleteDate: function(id) {
      var that = this;
      var deleteId = id;

      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http.delete(`/api/hero/${deleteId}`).then(
            function(response) {
              if (response.ok) {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                that.getAll();
              } else {
                this.$message({
                  type: "error",
                  message: "删除失败!"
                });
              }
            },
            function() {
              // this.loading = false;
            }
          );
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 获取全部数据
    getAll: function() {
      this.loading = true;
      this.$http.get("/api/hero").then(
        function(response) {
          this.loading = false;
          this.tableData = response.body;
        },
        function() {
          this.loading = false;
          console.log("error");
        }
      );
    },
    //跳转至详情页面
    toDetail: function(id) {
      //通过这种方式也可以实现跳转
      this.$router.push(`/league/${id}`);
    },
    addPic: function(id) {
      this.addpicId = id;
      this.addpicVisible = true;
    },
    closePicAdd: function() {
      this.addpicform.url = "";
    },
    addpicSure: function() {
      //如果没有填入图片地址的话，提示报错
      if (!this.addpicform.url.trim()) {
        this.$notify.error({
          title: "错误",
          message: "请输入正确的图片地址"
        });
        return;
      }

      var addObj = {
        url: this.addpicform.url
      };

      this.$http.put(`/api/addpic/${this.addpicId}`, addObj).then(
        function(response) {
          console.log(response);
          if (response.ok) {
            this.addpicVisible = false;
            this.$notify({
              title: "成功",
              message: "添加图片成功",
              type: "success"
            });
          } else {
            this.$notify.error({
              title: "错误",
              message: "添加图片失败"
            });
          }
        },
        function() {
          // this.loading = false;
        }
      );
    }
  },

  //页面初始化进来查询数据
  mounted: function() {
    this.getAll();
  }
};
</script>

<style lang="css">
.tableHeader {
  color: #000;
}
div.list {
  width: 90%;
  margin: 0 auto;
}
.addBtn {
  margin: 50px auto 0;
  display: block;
}
.addArea .el-input {
  width: 200px;
}
.addPicArea .el-input {
  width: 500px;
}
.addForm {
  overflow: hidden;
}
.addForm .el-form-item {
  float: left;
}
.sexArea {
  width: 200px;
}
.addFormArea .el-dialog__header .el-dialog__title {
  text-align: left;
}
</style>

</pre>
<pre>
<template>
  <div class="detail">
        <el-button type="success" class="goback" icon="el-icon-arrow-left" @click="goback">返回上一页</el-button>
        <el-carousel :interval="2000" type="card" height="300px" indicator-position="outside">
                <el-carousel-item v-for="(item, index) in imgArr" :key="index">
                    <img :src="item" alt="" class="imgClass">
                </el-carousel-item>
        </el-carousel>
        <p class="heroName">{{name}}●{{flag}}</p>

        <div>{{explain}}</div>

        
  </div>
</template>

<script>
export default {
  name:"detail",
  data:function(){
      return {
          title:"欢迎来到得来联盟",
          imgArr:[],
          name:"",
          flag:"",
          explain:""
      }
  },
  methods:{
      getMessage(id){
          this.$http.get(`/api/hero/${id}`).then(
            function(response) {
              this.imgArr = response.body.imgArr;
              this.name = response.body.name;
              this.flag = response.body.favourite;
              this.explain = response.body.explain
            },
            function() {
                //这里面是获取数据失败的情况下
              // this.loading = false;
            }
          );
      },
      goback(){
          this.$router.go(-1)
      }
  },
  mounted:function(){
      this.getMessage(this.$route.params.name)
  }
}
</script>

<style scoped>
.detail{
    width: 80%;
    margin: 50px auto;
}
.imgClass{
    width: 100%;
}
.heroName{
    text-align: center;
    font-size: 20px;
    font-weight: bold;
    font-style: italic;
}
.goback{
    margin-bottom: 30px;
}
</style>

</pre>

### 建立前端路由
在src/router下建立index.js,内容如下：
<pre>
//路由页面

import Vue from 'vue'

//引入路由模块，看下终端，如果终端提示vue-router模块没有安装，安装即可
import Router from 'vue-router'

//分别引入List、Detail两个组件
import List from '@/components/List'
import Detail from '@/components/Detail'


Vue.use(Router)

//定义路由,这两个路由会被映射到App.vue的<router-view></router-view>视口中
export default new Router({
  routes: [
    {
      path: '/',
      name: 'List',
      component: List
    },
    {
      path : '/league/:name',
      name : 'Detail',
      component : Detail
    },
  ]
})
</pre>

### 处理跨域问题
找到根目录中config目录下面的index.js文件，里面有个配置项proxyTable,改写这个配置项如下即可：
<pre>
  dev: {

    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/api':{
        target:"http://localhost:3000",
        changeOrigin:true
      }
    }
</pre>

### 启动项目
启动node服务
<pre>
node app.js
</pre>

启动vue服务(调试)
<pre>
npm run dev
</pre>

编译vue
<pre>
npm run build
</pre>
编译后的vue文件存放于dist目录，这时需要将dist目录进行服务映射，可以选择nginx/tomcat等.



### 常见问题
- npm run dev 报错
<pre>
Errors:
  4  http://eslint.org/docs/rules/spaced-comment
  3  http://eslint.org/docs/rules/key-spacing
  1  http://eslint.org/docs/rules/comma-dangle
  1  http://eslint.org/docs/rules/no-multiple-empty-lines

You may use special comments to disable some warnings.
Use // eslint-disable-next-line to ignore the next line.
Use /* eslint-disable */ to ignore all warnings in a file.
</pre>
这是由于使用了eslint,我们在config/index.js中将它禁用就好了
