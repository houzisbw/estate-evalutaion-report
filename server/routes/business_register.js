var express = require('express');
var router = express.Router();
var BusinessRegister = require('./../models/business_registery')

//存储业务登记表项
router.post('/saveBusinessRegisterItem',function(req,res,next){
	let data = req.body.dataObj;
	let businessRegister = new BusinessRegister(data);
	businessRegister.save(function(err,doc){
		if(err){
			console.log(err)
			res.json({
				status:-1
			})
		}else{
			res.json({
				status:1
			})
		}
	});

});

//读取业务登记表
router.post('/getBusinessRegisterData',function(req,res,next){
	let pageNum = parseInt(req.body.currentPageNum,10),
		pageCapacity = parseInt(req.body.itemSizePerPage,10),
		sortOrder = parseInt(req.body.sortOrder,10),
		sortField = req.body.sortField,
		//关键字可能不存在
		keyword = req.body.keyword;
	let sortCondition = {
		'项目序号':sortOrder
	};
	//这里是为了保证sort的字段唯一，所以要删除原来默认的字段
	delete sortCondition['项目序号'];
	sortCondition[sortField] = sortOrder;
	//检索时跳过的数量
	let skippedItemNum = (pageNum-1)*pageCapacity;
	const reg = new RegExp(keyword, 'i'); //不区分大小写
	//or和regex用于模糊查询,此处关键字只要任意存在于一个字段，该项都会被返回
	let findCondition = keyword?{
		$or: [
			{'项目类型': {$regex: reg}},
			{'担保公司': {$regex: reg}},
			{'部门': {$regex: reg}},
			{'业务员': {$regex: reg}},
			{'银行': {$regex: reg}},
			{'支行': {$regex: reg}},
			{'委托人': {$regex: reg}},
			{'电话': {$regex: reg}},
			{'项目所在区': {$regex: reg}},
			{'项目街道号': {$regex: reg}},
			{'项目具体位置': {$regex: reg}},
			{'面积': {$regex: reg}},
			{'成数': {$regex: reg}},
			{'贷款金额': {$regex: reg}},
			{'登记日期': {$regex: reg}},
			//正则不能用于Number，该字段是number
			// {'是否收齐': parseInt(keyword,10)}
		]
	}:{};
	let businessRegister = BusinessRegister.find(findCondition).skip(skippedItemNum).limit(pageCapacity).sort(sortCondition);
	BusinessRegister.count({},function(errCount,cnt){
		if(errCount){

			res.json({
				status:-1
			})
		}else{
			businessRegister.exec(function(err,doc){
				if(err){
					console.log(err)
					res.json({
						status:-1
					})
				}else{
					res.json({
						status:1,
						data:doc,
						cnt:cnt
					})
				}
			})
		}
	})

})

//获取业务index
router.get('/getItemIndex',function(req,res,next){
	BusinessRegister.find({},function(err,doc){
		if(err){
			res.json({
				status:-1
			})
		}else{
			let maxItemIndex=0;
			doc.forEach((item,index)=>{
				if(item['项目序号']>=maxItemIndex){
					maxItemIndex = item['项目序号']
				}
			})
			res.json({
				status:1,
				currentItemIndex:maxItemIndex+1
			})
		}
	})
})

//删除数据
router.post('/deleteItemByIndex',function(req,res,next){
	let index = parseInt(req.body.index,10);
	BusinessRegister.findOneAndRemove({'项目序号':index},function(err,doc){
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

//修改后保存业务登记表数据
router.post('/modifyItemByIndex',function(req,res,next){
	let modifiedData = req.body.modifiedData
	let itemIndex = modifiedData['项目序号'];
	BusinessRegister.findOne({'项目序号':itemIndex},function(err,doc){
		if(err){
			res.json({
				status:-1
			})
		}else{
			//合并更新后的数据
			for(var key in modifiedData){
				doc[key] = modifiedData[key]
			}
			doc.save();
			res.json({
				status:1
			})
		}
	})
})


module.exports = router;
