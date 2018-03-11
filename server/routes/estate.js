/**
 * Created by Administrator on 2018/3/6.
 */
var express = require('express');
var Estate = require('./../models/pre_assesment_estate');
var Tab = require('./../models/estate_search_tab_name');
var EstateParam = require('./../models/estate_param');
//预评估报告输入数据
var PreReportEstateInputData = require('./../models/estate_inputs_data')
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

//获取百度地图搜索组件tab的数据
router.get('/baidumapTabData',function(req,res,next){
	//查询全部tab数据
	Tab.find({},function(err,docs){
		if(err){
			res.json({
				status:-1
			})
		}else{
			let tabDataReturn = [];
			//升序排列
			docs.sort((a,b)=>{
				return a.index - b.index
			});
			docs.forEach((item)=>{
				let t = {};
				t.mainTabName = item.mainTabName;
				t.subTab = item.subTab;
				tabDataReturn.push(t)
			});
			res.json({
				tabData:tabDataReturn,
				status:1
			})
		}
	})
})

//获取银行信息
router.get('/bankInfo',function(req,res,next){
	PreReportEstateInputData.find({},function(err,docs){
		if(err){
			res.json({
				status:-1
			})
		}else{
			if(!docs){
				res.json({
					status:-1
				})
			}
			let bankInfo = [];
			docs.forEach(function(item){
				bankInfo.push(item.bankName);
			});
			res.json({
				status:1,
				bankInfo:bankInfo
			})
		}
	})
})

//获取银行对应输入框的数据
router.post('/getBankInputsData',function(req,res,next){
	let bankName = req.body.bank;
	let query = PreReportEstateInputData.where({bankName:bankName});
	//必须用findOne，否则会找到整个document
	query.findOne(function(err,doc){
		if(err){
			res.json({
				status:-1
			})
		}else{
			if(doc){
				//这里需要对输入框排序，先按size从小到大排序,若size相同再按index排序,为了页面美观
				doc.inputData.forEach(function(item){
					let data = item.data;
					data.sort(function(a,b){
						if(a.size === b.size){
							return parseInt(a.index,10) - parseInt(b.index,10)
						}
						return parseInt(a.size,10) - parseInt(b.size,10)
					})
				});
				res.json({
					status:1,
					inputData:doc.inputData
				})
			}else{
				res.json({
					status:-1
				})
			}
		}
	})
})

//获取成新率相关信息
router.get('/getBuildingRate',function(req,res,next){
	EstateParam.findOne(function(err,doc){
		if(err){
			res.json({
				status:-1
			})
		}else{
			res.json({
				status:1,
				buildingNewRate:doc.param.buildingNewRate,
				buildingNewRateDescription:doc.param.buildingNewRateDescription,
				buildingStructure:doc.param.buildingStructure
			})
		}
	})
})

//获取银行对应的docx名字
router.get('/getBankDocx',function(req,res,next){
	EstateParam.findOne(function(err,doc){
		if(err){
			res.json({
				status:-1
			})
		}else{
			console.log(doc.param.preReportDocx)
			res.json({
				status: 1,
				docx: doc.param.preReportDocx,
			})
		}
	})
})



module.exports = router;