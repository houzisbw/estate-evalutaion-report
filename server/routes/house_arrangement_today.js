//当日看房情况的后端路由部分
var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var HouseArrangeExcel = require('./../models/house_arrange_excel_content');
//保存派单excel到数据库
router.post('/saveExcelToDB',function(req,res,next){
		var excelData = req.body.excelData;
		//在这里加入服务器时间
		var d = new Date();
		var currentDate = d.getFullYear()+'-'+((d.getMonth()+1<10)?('0'+(d.getMonth()+1)):(d.getMonth()+1))+'-'+d.getDate();
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
							staffName:excelData[i].staffName
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
			res.json({
				status:1,
				excelData:ret,
				visit:visitRet,
				unvisit:unvisitRet,
				total:cnt,
				latestDate:latest?latest:'无'
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



module.exports = router;