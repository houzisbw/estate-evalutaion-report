/**
 * Created by Administrator on 2018/2/25.
 */
//用户数据模型,auth指代权限
var mongoose = require('mongoose');
var userSchema = new mongoose.Schema({
	username:String,
	password:String,
	auth:Number
});
//这里第一个参数是数据库collection的名字(users)，User=>users，会自动映射
module.exports = mongoose.model('User',userSchema)
