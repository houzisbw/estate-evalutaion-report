/**
 * Created by Administrator on 2018/3/9.
 */
//此脚本用于导入测试数据到库
var mongoose = require('mongoose');

//连接mongodb
mongoose.connect('mongodb://127.0.0.1:27017/estate_report')
//监听:成功
mongoose.connection.on("connected",function(){
	console.log('tab mongodb connection success');
})
//监听:失败
mongoose.connection.on("error",function(){
	console.log('tab mongodb connection fail');
});


//注意遇到key too larget to index的错误时需要对该集合进行dropIndex，不构建索引


