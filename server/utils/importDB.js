/**
 * Created by Administrator on 2018/3/9.
 */
//此脚本用于导入测试数据到库
var mongoose = require('mongoose');
var EstateParam = require('./../models/estate_param')

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

//测试数据
let tabData =[
	[1995,54,62],
	[1996,56,63],
	[1997,58,65],
	[1998,60,67],
	[1999,62,68],

	[2000,64,70],
	[2001,66,72],
	[2002,68,73],
	[2003,70,75],
	[2004,72,77],

	[2005,74,78],
	[2006,76,80],
	[2007,78,82],
	[2008,80,83],
	[2009,82,85],

	[2010,84,87],
	[2011,86,88],
	[2012,88,90],
	[2013,90,92],
	[2014,92,93],

	[2015,94,95],
	[2016,96,97],
	[2017,98,98],
	[2018,100,100]
]
let des = [
	[60,'一般损坏房'],
	[80,'基本完好房'],
	[101,'完好房']
]
let s = {
	'混合':1,
	'砖混':1,
	'钢混':1,
	'框架':2,
	'框剪':2,
	'剪力墙':2
}
let t = new EstateParam({
	param:{
		buildingNewRate:tabData,
		buildingNewRateDescription:des,
		buildingStructure:s
	}
})
t.save()

//注意遇到key too larget to index的错误时需要对该集合进行dropIndex，不构建索引


