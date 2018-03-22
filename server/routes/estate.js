/**
 * Created by Administrator on 2018/3/6.
 */
var express = require('express');
//获取文件上传中间处理模块
var multiparty = require('connect-multiparty')
//获取node文件处理模块,node自带的，不用npm安装
var fs = require('fs');
var path = require('path');
var Estate = require('./../models/pre_assesment_estate');
var Tab = require('./../models/estate_search_tab_name');
var EstateParam = require('./../models/estate_param');
//预评估报告输入数据
var PreReportEstateInputData = require('./../models/estate_inputs_data')
//预评估报告模板
var PreReportInputTemplate = require('./../models/pre_report_input_data_template')
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
			res.json({
				status: 1,
				docx: doc.param.preReportDocx,
			})
		}
	})
})

//土地出让金
router.get('/getLandTransactionFee',function(req,res,next){
	EstateParam.findOne(function(err,doc){
		if(err){
			res.json({
				status:-1
			})
		}else{
			res.json({
				status: 1,
				landTransactionFee: doc.param.landTransactionFee,
			})
		}
	})
})

//获取预评估报告模板
router.get('/getPreReportTemplate',function(req,res,next){
	PreReportInputTemplate.findOne(function(err,doc){
		if(err){
			res.json({
				status:-1
			})
		}else{
			res.json({
				status: 1,
				template: doc.inputData,
			})
		}
	})
})

//保存报告
router.post('/savePreReportTemplate',function(req,res,next){
	let reportData = req.body.reportData;
	let preReportEstateInputData = new PreReportEstateInputData(reportData)
	preReportEstateInputData.save(function(err){
		if(err){
			res.json({
				status:-1
			})
		}else{
			res.json({
				status:1
			})
		}
	});
})

//删除报告,只删除数据库的数据，没有删除word模板
router.post('/deletePreReportTemplate',function(req,response,next){
	let templateNameToDelete = req.body.templateNameToDelete;
	let condition = {bankName:templateNameToDelete};
	PreReportEstateInputData.findOneAndRemove(condition,function(err,res){
		if(err){
			response.json({
				status:-1
			})
		}else{
			response.json({
				status:1
			})
		}
	})
})

//查询预评估和正报的word模板，通过参数来区分是查询哪一个
router.post('/searchWordTemplateOnServer',function(req,res,next){
	let type = req.body.type;
	if(type === 'PRE'){
		//预评估,读取public/wordTemplate/pre下所有文件
		//__dirname为当前路径
		let preDirectoryName = path.join(__dirname,'../public/wordTemplate/pre');
		//files是文件名数组
		fs.readdir(preDirectoryName,function(err,files){
			if(err){
				res.json({
					status:-1
				})
			}else{
				//先到input_data中查找已经存在的银行名称(可能没有模板),再根据名称到EstateParam中查找模板
				let bankNameList = [];
				PreReportEstateInputData.find({},function(errInputData,docInputData){
					if(errInputData){
						res.json({
							status:-1
						})
					}
					docInputData.forEach((item)=>{
						bankNameList.push(item.bankName);
					});
					//查询对应银行中文名
					EstateParam.findOne(function(err2,doc){
						let retObj = {};
						if(err2){
							res.json({
								status:-1
							})
						}else{
							bankNameList.forEach((bank)=>{
								//如果该银行存在对应的docx
								if(doc.param.preReportDocx[bank]){
									retObj[bank] = doc.param.preReportDocx[bank];
								}else{
									retObj[bank] = '';
								}

							});
							res.json({
								status:1,
								fileData:retObj,
								type:'PRE'
							})
						}
					})

				});


			}

		})

	}
})

//删除word模板(包含预评估和正报)
router.post('/deleteWordTemplate',function(req,res,next){
	let type = req.body.type,
		bankName = req.body.bankName,
		wordName = req.body.wordName;
	if(type === 'PRE'){
		//预评估
		//删除服务器上对应的word文件,首先检查该文件是否存在
		let preDirectoryName = path.join(__dirname,'../public/wordTemplate/pre/',wordName);
		fs.exists(preDirectoryName,function(isExist){
			if(isExist){
				//进行删除操作
				fs.unlink(preDirectoryName,function(err){
					if(err){
						res.json({
							status:-1
						})
					}else{
						//删除成功,此时需要再删除数据库中对应关系
						EstateParam.findOne({},function(err2,doc){
							if(err2){
								res.json({
									status:-1
								})
							}else{
								if(doc){
									//非常重要:如果要对mongodb的对象进行更新，必须新建对象然后赋值给原来的对象，否则失败
									let newObj = {};
									for(let k in doc.param.preReportDocx){
										if(doc.param.preReportDocx.hasOwnProperty(k)){
											newObj[k] = doc.param.preReportDocx[k];
										}
									}
									for(let k in newObj){
										if(k === bankName){
											//置空，不是删除
											newObj[k] = ''
										}
									}
									doc.param.preReportDocx = newObj;
									doc.save(function(err3,doc3){
										if(err3){
										}else{
											res.json({
												status:1,
												data:doc3
											})
										}
									});

								}else{
									res.json({
										status:-1
									})
								}
							}
						})
					}

				})
			}else{
				res.json({
					status:-1
				})
			}
		})

	}
})

//处理word文件上传,multiparty为中间件
router.post('/upload_wordPre',multiparty(),function(req,res,next){
	//获得文件名,注意此处的wordPre是前端设置的name字段值
	var filename = req.files.wordPre.originalFilename || path.basename(req.files.wordPre.path);
	console.log(req.files.wordPre)
	//复制文件到指定路径(预评估存放文件夹)
	var targetPath = './../public/wordTemplate/pre/' + filename;
	//复制文件流
	fs.createReadStream(req.files.wordPre.path).pipe(fs.createWriteStream(targetPath));
	res.json({
		status:1
	})


});



module.exports = router;