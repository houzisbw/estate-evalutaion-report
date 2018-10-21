//当日看房情况的后端路由部分
var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var xlsx = require('xlsx');
var mongoose = require('mongoose')
var HouseArrangeExcel = require('./../models/house_arrange_excel_content');
//小程序表单Schema
var wxFormData = require('./../models/wx_models/wx_form')
//保存派单excel到数据库
router.post('/saveExcelToDB',function(req,res,next){
		var excelData = req.body.excelData;
		//在这里加入服务器时间,注意格式是yyyy-mm-dd
		var d = new Date();
		var currentDate = d.getFullYear()+'-'+((d.getMonth()+1<10)?('0'+(d.getMonth()+1)):(d.getMonth()+1))+'-'+
				(d.getDate()<10?('0'+d.getDate()):d.getDate());
		for(var i=0;i<excelData.length;i++){
			excelData[i].date = currentDate;
		}
		//首先删除当天的所有记录
		HouseArrangeExcel.remove({date:currentDate},function(err){
				if(err){
					res.json({
						status:-1
					})
				}else{
					//读取小程序表单项数据
					wxFormData.find({},function(err2,doc2){
						if(err2){
							res.json({
								status:-1
							})
						}else{
							//保存当天新的数据
							for(let i=0;i<excelData.length;i++){
								//构造表单项数组(mongodb不能存object类型的)
								var formObjArray = [];
								doc2.forEach((item)=>{
									//初始值为空
									let obj = {};
									obj[item.key]='';
									formObjArray.push(obj)
								});
								//看房表单数据
								var obj = new HouseArrangeExcel({
									//表单数组
									formData:formObjArray,
									//日期
									date:excelData[i].date,
									//单号
									index:parseInt(excelData[i].index,10),
									//街道号
									roadNumber:excelData[i].roadNumber,
									//具体住址
									detailPosition:excelData[i].detailPosition,
									//担保公司
									company:excelData[i].company,
									//银行
									bank:excelData[i].bank,
									//面积
									area:excelData[i].area,
									//电话
									telephone:excelData[i].telephone,
									//是否已看
									isVisit:false,
									//反馈情况
									feedback:'',
									//反馈时间 格式:(2018年07月14日 15:37)
									feedTime:'',
									//看房人员
									staffName:excelData[i].staffName,
									//是否紧急
									isUrgent:false,
									//紧急信息
									urgentInfo:'',
									//担保人
									gurantor:excelData[i].gurantor,
									//报价
									price:0,
									//预评估
									hasPreAssessment:false
								});
								obj.save();
							}
							res.json({
								status:1
							})
						}
					})
				}
		})
});

//获取最近一次派单的所有数据
router.post('/getLatestExcelData',function(req,res,next){
	//按date降序排列，只取最新的数据
	HouseArrangeExcel.find({}).sort({date:-1}).exec(function(err,docs){
		if(err){
			res.json({
				status:-1
			})
		}else{
			//如果docs为空直接返回无数据
			if(!docs||Object.keys(docs).length===0){
				//数据为空
				res.json({
					status:0
				});
			}
			//注意docs类型为object
			var ret = [],
					visitRet = [],
					unvisitRet = [],
					cnt=0,
					latest = docs[0].date;
			docs.forEach(function(item){
					if(item.date === latest){
						ret.push(item);
						if(item.isVisit){
							visitRet.push(item)
						}else{
							unvisitRet.push(item)
						}
						cnt++;
					}
			});
			//按序号从大到小排列
			ret.sort(function(a,b){
				return parseInt(b.index,10) - parseInt(a.index,10)
			});
			res.json({
				status:1,
				excelData:ret,
				visit:visitRet,
				unvisit:unvisitRet,
				total:cnt,
				latestDate:latest?latest:'无',
			})
		}
	})
});

//修改某一单的看房人员
router.post('/modifyStaff',function(req,res,next){
	var index = req.body.index,
			staff = req.body.staffName,
			latestDate = req.body.latestDate;
	//更新操作:参数是condition,需要更新的数据，回调
	HouseArrangeExcel.update({
		index:index,
		date:latestDate
	},{staffName:staff},function(err,doc){
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

//修改加急项
router.post('/modifyUrgent',function(req,res,next){
	var index = req.body.index,
			urgentInfo = req.body.urgentInfo,
			staff = req.body.staff;
	var isUrgent = urgentInfo !== '';
	//更新操作:参数是condition,需要更新的数据，回调
	HouseArrangeExcel.update({index:index,staffName:staff},{
		urgentInfo:urgentInfo,
		isUrgent:isUrgent
	},function(err,doc){
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
});

//删除选定数据
router.post('/removeHouseData',function(req,res,next){
	let index = parseInt(req.body.index,10),
			staff = req.body.staff;
	HouseArrangeExcel.remove({
		index:index,
		staffName:staff
	},function(err){
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
});

//保存添加的数据
router.post('/saveAddedHouseData',function(req,res,next){
	let values = req.body.values;
	//查询最近的派单时间
	HouseArrangeExcel.find({}).sort({date:-1}).exec(function(err,docs) {
		if (err) {
			res.json({
				status: -1
			})
		} else {
			//最近的日期
			let lastestDate = '';
			if (!docs || Object.keys(docs).length === 0) {
				//数据为空,最近的时间取当前时间
				var date = new Date();
				lastestDate = date.getFullYear()+'-'+((date.getMonth()+1)<10?('0'+(date.getMonth()+1)):(date.getMonth()+1))+'-'
										+(date.getDate()<10?('0'+date.getDate()):date.getDate());
			}else{
				lastestDate = docs[0].date
			}
			//添加微信小程序的formData字段
			//读取小程序表单项数据
			wxFormData.find({},function(err2,doc2){
				if(err2){
					res.json({
						status:-1
					})
				}else{
					//构造表单项数组(mongodb不能存object类型的)
					var formObjArray = [];
					doc2.forEach((item)=>{
						//初始值为空
						let obj = {};
						obj[item.key]='';
						formObjArray.push(obj)
					});
					//构造要保存的数据
					let obj = {
						formData:formObjArray,
						date:lastestDate,
						isVisit:false,
						feedback:'',
						feedTime:'',
						isUrgent:false,
						urgentInfo:'',
						price:0,
						hasPreAssessment:false
					};
					let excelData = new HouseArrangeExcel({...obj,...values});
					excelData.save();
					res.json({
						status:1
					})
				}
			})
		}
	})

});

//搜索看房数据
router.post('/searchHouseData',function(req,res,next){
	let keyword = req.body.keyword,
			isHistory = req.body.isHistory,
			latestDate = req.body.latestDate;
	let condition = isHistory==='0'?{date:latestDate}:{};
	HouseArrangeExcel.find(condition,function(err,docs){
		if(err){
			res.json({
				status:-1
			})
		}else{
			let ret = [],visitRet=[],unvisitRet=[],cnt=0;
			docs.forEach(function(item){
				//注意index为整数，得转化为字符串，否则会卡住且不报错
				if(	item.index.toString().indexOf(keyword)!==-1||
						item.date.indexOf(keyword)!==-1||
						item.roadNumber.indexOf(keyword)!==-1||
						item.detailPosition.indexOf(keyword)!==-1||
						item.telephone.indexOf(keyword)!==-1||
						item.company.indexOf(keyword)!==-1||
						item.bank.indexOf(keyword)!==-1||
						item.area.indexOf(keyword)!==-1||
						item.feedback.indexOf(keyword)!==-1||
						item.feedTime.indexOf(keyword)!==-1||
						item.staffName.indexOf(keyword)!==-1||
						item.price.toString().indexOf(keyword)!==-1||
						//新增单子没有委托人一项，这里必须保证gurantor存在,注意这里外层的括号
						(item.gurantor&&item.gurantor.indexOf(keyword)!==-1)||
						item.urgentInfo.indexOf(keyword)!==-1
					)
				{
					ret.push(item);
					cnt++;
					if(item.isVisit){
						visitRet.push(item)
					}else{
						unvisitRet.push(item)
					}
				}
			});
			res.json({
				status:1,
				excelData:ret,
				visit:visitRet,
				unvisit:unvisitRet,
				total:cnt
			})
		}
	})
});

//处理看房人员分配结果的excel的下载
router.get('/getExcelDataAndDownload',function(req,res){
	let excelData = [];
	//通过url的查询参数构造excel数组
	let query = req.query;
	Object.keys(query).forEach((item)=>{
		let obj = {A:item,B:query[item]}
		excelData.push(obj)
	});
	//读取服务器上的特定excel
	let excelPath = path.join(__dirname,'./../public/arrangeResultExcelTemplate/arrangeResultExcel.xlsx');
	//输出excel文件所在的路径(包含文件名)
	let outputPath = path.join(__dirname,'./../public/arrangeResultExcelTemplate/result.xlsx');
	//判断文件是否存在
	var isFileExist = fs.existsSync(excelPath);
	if(isFileExist){
		let workbook = xlsx.readFile(excelPath);
		//获取第一个sheet
		let sheetOne = workbook.Sheets[workbook.SheetNames[0]];
		//在第一个sheet中写入excelData，只写A,B这2列，A为房屋序号，B为分配的人员名字
		if(sheetOne){
			//更新原有的excel中的sheet1,从第一行第一列开始写入，覆盖之前的旧值
			//这里逻辑有问题
			xlsx.utils.sheet_add_json(sheetOne,excelData,{
				header:['A','B'],
				skipHeader: true,
				origin:'A1'
			});
			//输出文件,该文件不用删除，因为名字固定，下次生成就覆盖了旧文件
			//该方法是同步方法
			xlsx.writeFile(workbook, outputPath);
			//下载该excel到浏览器端
			res.download(outputPath,function(err){
				if(err){
					console.log(err)
				}else{
					console.log('success download')
				}
			});
		}else{
			res.json({
				status:-1
			})
		}

	}else{
		res.json({
			status:-1
		})
	}

});

//下载小程序填写的表单数据
router.post('/downloadFormDataInExcel',function(req,res){
	let date = req.body.date,
			index = parseInt(req.body.index,10);
	HouseArrangeExcel.findOne({date:date,index:index},function(err,doc){
		if(err){
			res.json({
				status:-1
			})
		}else{
			//读取表单结构进行中文转换
			wxFormData.find({},function(err1,doc1){
				if(err1){
					res.json({
						status:-1
					})
				}else{
					//判断表单是否存在
					if(doc.formData.length === 0){
						//不存在
						res.json({
							status:-1
						})
						return
					}
					let formDataArray = doc.formData.slice();
					let map = {};
					doc1.forEach((item)=>{
						map[item.key] = item.name
					});
					let retArray = [];
					formDataArray.forEach((item)=>{
						let key = Object.keys(item)[0];
						let obj = {};
						obj[map[key]] = item[key]
						retArray.push(obj)
					});
					res.json({
						status:1,
						formData:retArray,
						//反馈时间
						feedTime:doc.feedTime,
						//看房人员
						staffName:doc.staffName
					})
				}
			})
		}
	})
})

//处理是否已出预评估的状态切换
router.post('/modifyHasPreAssessment',function(req,res){
	let date = req.body.latestDate,
			index = parseInt(req.body.index,10),
			has = req.body.has,
			id = req.body._id;
	//根据id查询，不能根据其他数据
	console.log(id)
	HouseArrangeExcel.findOneAndUpdate({_id:mongoose.Types.ObjectId(id)},{hasPreAssessment:has},function(err){
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
});

//处理价格修改
router.post('/modifyPrice',function(req,res){
	let date = req.body.date,
			index = parseInt(req.body.index,10),
			price = parseInt(req.body.price,10),
			id = req.body.id;
	HouseArrangeExcel.findOneAndUpdate({_id:mongoose.Types.ObjectId(id)},{price:price},function(err){
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
});




module.exports = router;