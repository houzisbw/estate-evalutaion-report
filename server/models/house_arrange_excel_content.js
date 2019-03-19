/*
* 	当天看房情况(excel内数据)
* */
var mongoose = require('mongoose');
var HouseArrangementToday = new mongoose.Schema({
	//该单所填写的看房表单(数组)
	formData:Array,
	//派单日期: yyyy-mm-dd
	date:String,
	//单号
	index:Number,
	//街道号
	roadNumber:String,
	//具体住址
	detailPosition:String,
	//担保公司
	company:String,
	//银行
	bank:String,
	//面积
	area:String,
	//电话
	telephone:String,
	//是否已看
	isVisit:Boolean,
	//反馈情况
	feedback:String,
	//反馈时间 格式:(2018年07月14日 15:37)
	feedTime:String,
	//看房人员
	staffName:String,
	//是否紧急
	isUrgent:Boolean,
	//紧急的具体信息
	urgentInfo:String,
	//担保人
	gurantor:String,

	/*2018.10.20新增*/
	//报价(默认为0，表示未报价)
	price:Number,
	//是否出预评估(默认为false)
	hasPreAssessment:Boolean,

	//上传照片类型
	pictureType:String,
	//是否已下载图片
	hasDownloadPictures:false,
	//签到位置
  signPosition:String,
	//是否可以下载图片(图片已传完)
	canDownloadPictures:false
});
module.exports = mongoose.model('house_arrange_excel_content',HouseArrangementToday);