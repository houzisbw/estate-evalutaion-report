/**
 * Created by Administrator on 2018/2/25.
 */
//搜索组件tab数据模型
var mongoose = require('mongoose');
var estateTabSchema = new mongoose.Schema({
	mainTabName:String,
	index:Number,
	subTab:{
		subTabNamesList:Array
	}
});
//这里第一个参数是数据库collection的名字(users)，User=>users，会自动映射
module.exports = mongoose.model('Estate_tab_data',estateTabSchema)
