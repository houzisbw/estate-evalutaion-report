/**
 * Created by Administrator on 2018/3/6.
 */
var express = require('express');
var Estate = require('./../models/pre_assesment_estate');
var router = express.Router();
//查看小区是否已经填写过
router.post('/checkEstateExisted',function(req,res,next){
	let estateName = req.body.estateName;
	let query = Estate.where({estateName:estateName});
	query.findOne(function(err,doc){
		if(err){
			res.json({
				status:-1
			})
		}else{
			//找到相关小区
			if(doc){
				res.json({
					road:doc.road,
					facility:doc.facility,
					status:1
				})
			}else{
				res.json({
					status:-1
				})
			}
		}
	})
});



module.exports = router;