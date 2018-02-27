/**
 * Created by Administrator on 2018/2/26.
 */
//读取excel数据到mongodb,首先将excel转为csv，再用csvtojson包执行转换
//注意：每次执行前考虑是否清空数据库，防止重复的数据写入
/*
* 乱码问题: 如果不设置csv的编码格式，保存到数据库中的就是乱码，
* 解决方法: notepad++打开csv，选择编码选项，然后先选择utf-8无bom编码格式，再点击转换为utf-8无bom编码格式，保存即可
*
* */
var mongoose = require('mongoose');
var csvtojson = require('csvtojson');
var Estate = require('./../models/pre_assesment_estate')
//连接mongodb
mongoose.connect('mongodb://127.0.0.1:27017/estate_report')
//监听:成功
mongoose.connection.on("connected",function(){
	console.log('csv mongodb connection success');
})
//监听:失败
mongoose.connection.on("error",function(){
	console.log('csv mongodb connection fail');
});

var csvFilePath = './estate.csv';
//trim去掉内容的左右空格，ignoreEmpty忽略空的单元格(important)
//默认csv第一行是表头，不算做数据
var options = {
	trim:true,
	ignoreEmpty:true
};
var resultArray = [];
//这个on('json'),每一行csv执行都会调用一次,done表示全部读取完成
csvtojson(options).fromFile(csvFilePath).on('json',(jsonObj)=>{
	resultArray.push(jsonObj)
}).on('done',()=>{
	//存数据库
	resultArray.forEach(function(value,index){
		let estateDataObj = new Estate({
			estateName:value.estateName,
			road:value.road,
			facility:value.facility
		});
		estateDataObj.save();
	})
})
