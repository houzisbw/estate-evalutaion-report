/**
 * Created by Administrator on 2018/5/5.
 */
var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var HouseArrangeStaff = require('./../models/house_arrange_staff')
//添加看房人员
router.post('/addStaff',function(req,res,next){
	var staffName = req.body.staffName;
	HouseArrangeStaff.findOne({staffName:staffName},function(err,doc){
		if(err){
			res.json({
				status:-1
			})
		}else{
			if(doc){
				//找到用户,提示已经有用户存在
				res.json({
					status:1
				})
			}else{
				var staff = new HouseArrangeStaff({
					staffName:staffName
				});
				staff.save();
				res.json({
					status:2
				})
			}
		}
	})

});

//获取所有人员名单
router.get('/getStaff',function(req,res,next){
	HouseArrangeStaff.find(function(err,docs){
		if(err){
			res.json({
				status:-1
			})
		}else{
			var staffList = [];
			docs.forEach(function(item,index){
				staffList.push({name:item.staffName,index:index+1})
			});
			res.json({
				status:1,
				staffList:staffList
			})
		}
	})
});

//删除员工
router.post('/deleteStaff',function(req,res,next){
	var staffName = req.body.staffName;
	HouseArrangeStaff.findOneAndRemove({staffName:staffName},function(err,doc){
		if(err){
			res.json({
				status:-1
			})
		}else{
			//删除成功
			res.json({
				status:1
			})
		}
	})
});


module.exports = router;