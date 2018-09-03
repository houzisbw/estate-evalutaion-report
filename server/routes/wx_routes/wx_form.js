/**
 * Created by Administrator on 2018/9/2.
 */
/**
 * 小程序详表单页的路由处理
 */
var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var HouseFormDataStructure = require('./../../models/wx_models/wx_form');
var HouseArrangeExcel = require('./../../models/house_arrange_excel_content');
//获取表单数据结构
router.post('/getFormStructureDataUrL',function(req,res){
	HouseFormDataStructure.find({},function(err,docs){
		if(err){
			res.json({
				status:-1
			})
		}else{
			//按序号升序排列
			docs.sort(function(a,b){return a.index - b.index})
			res.json({
				status:1,
				formStructure:docs
			})
		}
	})
})

//获取某一单的表单数据
router.post('/getFormDataFromCorrespondingList',function(req,res){
	let date = req.body.estateDate,
			index = parseInt(req.body.estateIndex,10);
	let condition = {date:date,index:index};
	HouseArrangeExcel.findOne(condition,function(err,doc){
		if(err){
			res.json({
				status:-1
			})
		}else{
			res.json({
				status:1,
				formData:doc.formData
			})
		}
	})
})

//保存表单数据到数据库
router.post('/saveFormDataToDB',function(req,res){
	let date = req.body.estateDate,
			index = parseInt(req.body.estateIndex,10),
			formData = req.body.formData;
	let condition = {date:date,index:index};
	HouseArrangeExcel.findOneAndUpdate(condition,{formData:formData},function(err){
		if(err){
			res.json({
				status:-1
			})
		}else{
			res.json({
				status:1
			})
		}
	})
})

module.exports = router