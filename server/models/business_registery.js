/**
 * Created by Administrator on 2018/3/29.
 */
//业务登记模型
var mongoose = require('mongoose');
var BusinessRegisterSchema = new mongoose.Schema({
	'项目序号':Number,
	'登记日期':String,
	'项目类型':String,
	'担保公司':String,
	'部门':String,
	'业务员':String,
	'支行':String,
	'银行':String,
	'委托人':String,
	'电话':String,
	'项目所在区':String,
	'项目街道号':String,
	'项目具体位置':String,
	'面积':String,
	'贷款金额':String,
	'成数':String,
	'是否收齐':Number,
	//图片数组
	'图片':Array

});
//注意mongodb会自动加s，这里的加s是变成复数的意思，registery=>registeries，不是单纯的加s
module.exports = mongoose.model('business_registerys',BusinessRegisterSchema)