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
