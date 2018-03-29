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
		pageCapacity = parseInt(req.body.itemSizePerPage,10);
	//检索时跳过的数量
	let skippedItemNum = (pageNum-1)*pageCapacity;
	let businessRegister = BusinessRegister.find().skip(skippedItemNum).limit(pageCapacity);
	BusinessRegister.count({},function(errCount,cnt){
		if(errCount){
			res.json({
				status:-1
			})
		}else{
			businessRegister.exec(function(err,doc){
				if(err){
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


module.exports = router;
