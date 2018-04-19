var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var multipart = require('connect-multiparty');
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
	BusinessRegister.count(findCondition,function(errCount,cnt){
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

//上传业务登记的图片
router.post('/imageUpload',multipart(),function(req,res,next){
	//获取上传图片的项目序号
	let itemIndex = parseInt(req.body.itemIndex,10);
	//获得文件名
	var filename = req.files.file.originalFilename || path.basename(req.files.file.path);
	//文件名前缀
	var filenamePrefix = filename.split('.')[0];
	//复制文件到指定路径,注意最末端要有/指明是文件夹
	let imageDirectoryName = path.join(__dirname,'../public/businessRegisteryImage/');
	var targetPath = imageDirectoryName + filename;
	//复制文件流
	var fileReadStream = fs.createReadStream(req.files.file.path);
	var fileWriteStream = fs.createWriteStream(targetPath);
	fileReadStream.pipe(fileWriteStream);
	//异步操作结束,rename操作必须等待图片被复制完成
	fileWriteStream.on('close',function(){
		//重命名图片，时间戳加随机1位数字组合，保证不重复
		var d = new Date();
		var uniquePictureName = d.getTime().toString()+Math.floor(Math.random()*10).toString()
		//重命名图片
		var newPictureName = targetPath.replace(filenamePrefix,uniquePictureName);
		//用第二个参数重命名第一个参数的文件
		fs.rename(targetPath,newPictureName);
		//构造图片url
		var imageUrl = 'http://'+req.headers.host+'/businessRegisteryImage/'+uniquePictureName+'.'+filename.split('.')[1];
		//存入数据库：将图片url和对应的项目序号存入数据库
		BusinessRegister.findOne({'项目序号':itemIndex},function(err,doc){
			if(err){
				res.json({ status:-1});
			}else{
				//保存图片url
				doc['图片'].push(imageUrl);
				doc.save();
				//响应ajax请求，告诉它图片传到哪了
				res.json({
					code: 200,
					data: { url: imageUrl },
					status:1
				});
			}
		});


	});

});

//获取图片
router.post('/getImages',function(req,res,next){
	let index = parseInt(req.body.itemIndex,10);
	BusinessRegister.findOne({'项目序号':index},function(err,doc){
		if(err){
			res.json({ status:-1});
		}else{
			res.json({
				status:1,
				imageUrls:doc['图片']
			})
		}
	});
})

//删除图片
router.post('/deleteImage',function(req,res,next){
	let imageUrl = req.body.imageUrl;
	let index = parseInt(req.body.itemIndex,10);
	BusinessRegister.findOne({'项目序号':index},function(err,doc){
		if(err){
			res.json({ status:-1});
		}else{
			let urlIndex = doc['图片'].indexOf(imageUrl);
			if(urlIndex!==-1){
				let newArray = doc['图片'].slice();
				newArray.splice(urlIndex,1);
				doc['图片'] = newArray;
				doc.save()
			}
			//删除服务器上的图片,获取图片名称
			var imageName = imageUrl.split('/').pop();
			var imageFullPath = path.join(__dirname,'../public/businessRegisteryImage/',imageName);
			fs.exists(imageFullPath,function(isExist) {
				if (isExist) {
					//进行删除操作
					fs.unlink(imageFullPath, function (err) {})
				}
			});
			res.json({ status:1});
		}
	});
})


module.exports = router;
