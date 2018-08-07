//当日看房情况的后端路由部分
var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var HouseArrangeExcel = require('./../models/house_arrange_excel_content');
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
					//保存当天新的数据
					for(var i=0;i<excelData.length;i++){
						var obj = new HouseArrangeExcel({
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
							urgentInfo:''
						});
						obj.save();
					}
					res.json({
						status:1
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
			//按序号从小到大排列
			ret.sort(function(a,b){
				return parseInt(a.index,10) - parseInt(b.index,10)
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
			staff = req.body.staffName;
	//更新操作:参数是condition,需要更新的数据，回调
	HouseArrangeExcel.update({index:index},{staffName:staff},function(err,doc){
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
			//构造要保存的数据
			let obj = {
				date:lastestDate,
				isVisit:false,
				feedback:'',
				feedTime:'',
				isUrgent:false,
				urgentInfo:''
			};
			let excelData = new HouseArrangeExcel({...obj,...values});
			excelData.save();
			res.json({
				status:1
			})
		}
	})

});



module.exports = router;