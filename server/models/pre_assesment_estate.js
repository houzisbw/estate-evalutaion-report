/**
 * Created by Administrator on 2018/2/26.
 */
var mongoose = require('mongoose');
//小区字段，对应预评估生成excel里面表头数据,后面继续扩展
var estateSchema = new mongoose.Schema({
	estateName:String,
	road:String,
	facility:String
});
//这里第一个参数是数据库collection的名字(users)，User=>users，会自动映射
module.exports = mongoose.model('Pre_assesment_estate_data',estateSchema)