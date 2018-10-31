/**
 * 小程序详情页的路由处理
 */
var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var HouseArrangeExcel = require('./../../models/house_arrange_excel_content');

//获取房屋详细信息
router.post('/getDetailInfoOfEstate',function(req,res,next){
	var index = parseInt(req.body.estateIndex,10),
			date = req.body.latestDate;
	var query = HouseArrangeExcel.where({
		index:index,
		date:date
	});
	//检查是否登录过期
	if(req.session.username){
		query.findOne(function(err,doc){
			if(err){
				//数据库查询出错
				res.json({
					status:-1
				})
			}else{
				if(doc){
					//查找成功
					res.json({
						status:1,
						estateDetail:doc
					})
				}else{
					//数据为空,不存在，如果用户在一个没刷新的页面待了过久，然后该数据已经删除
					res.json({
						status:0
					})
				}
			}
		})
	}else{
		//登录过期
		res.json({
			status:-2
		})
	}

});

//保存反馈数据
router.post('/submitFeedback',function(req,res,next){
	var feedbackReason = req.body.submitReason,
			isVisit = req.body.isVisit,
			estateIndex = req.body.estateIndex,
			latestDate = req.body.latestDate,
			submitTime = req.body.submitTime;
	if(req.session.username){
		//先找出是否存在对应estateIndex和latestDate的记录，有可能不存在
		var condition = {
			index:estateIndex,
			date:latestDate
		};
		var update = {
			feedback:feedbackReason,
			feedTime:submitTime,
			isVisit:isVisit==='1'
		};
		//注意此处无doc参数
		HouseArrangeExcel.findOneAndUpdate(condition,update,function(err){
			if(err){
				//出错
				res.json({
					status:-1
				})
			}else{
				//修改成功,返回提交时间
				res.json({
					status:1,
					submitTime:+new Date()
				})
			}

		})
	}else{
		//登录过期
		res.json({
			status:-2
		})
	}

});



module.exports = router