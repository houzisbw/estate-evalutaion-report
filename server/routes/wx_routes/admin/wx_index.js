//微信app登录的路由
var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
//数据模型
var HouseArrangeExcel = require('./../../../models/house_arrange_excel_content');
var StaffListModel = require('./../../../models/house_arrange_staff');
//获取管理员首页的信息
router.post('/adminGetEstateData',function(req,res,next){
	//获取type
	let type =  parseInt(req.body.type,10);
	//查询条件:0全部，1已看，2未看
	let condition = type === 0?{}:(type===1?{isVisit:true}:{isVisit:false});
	//查找最近一次看房的数据
	HouseArrangeExcel.find({},function(err,docs){
		if(err){
			res.json({
				status:-1
			})
		}else{
			if(docs.length){
				var resData = [],visitedNum=0,unvisitedNum=0;
				docs.forEach(function(item){
					var obj = {
						estateIndex:item.index,
						estatePosition:item.roadNumber+item.detailPosition,
						estateTelephone:item.telephone,
						isVisit:item.isVisit,
						feedback:item.feedback.replace(/\*##\*/g,';'),
						staffName:item.staffName,
						date:item.date
					}
					resData.push(obj);
				})
				//只取最近日期的数据,注意日期是字符串，需要转成整形比较
				resData.sort(function(a,b){
					var aArray = a.date.split('-'),
							bArray = b.date.split('-');
					var aInt = parseInt(aArray.join(''),10),
							bInt = parseInt(bArray.join(''),10);
					return aInt - bInt;
				});
				let latestDate = resData[resData.length-1].date;
				resData = resData.filter(function(item){return item.date == latestDate});
				//计算未完成，已完成数目
				resData.forEach(function(item){
					if(item.isVisit){
						visitedNum++;
					}else{
						unvisitedNum++;
					}
				});
				//过滤
				if(type === 1){
					resData = resData.filter(function(item){return item.isVisit});
				}else if(type === 2){
					resData = resData.filter(function(item){return !item.isVisit});
				}

				//排序：先按未完成，最后是已完成，然后是序号
				resData.sort(function(a,b){
					if(a.isVisit===b.isVisit){
						return a.estateIndex - b.estateIndex
					}
					return a.isVisit>b.isVisit
				});
				res.json({
					status:1,
					visitedNum:visitedNum,
					unvisitedNum:unvisitedNum,
					totalNum:visitedNum+unvisitedNum,
					estateData:resData,
					latestDate:latestDate
				})
			}else{
				//数据为空
				res.json({
					status:0
				})
			}
		}
	})
});

//搜索,规则是关键词匹配序号，地址，人员任意一个即可
//搜索改为搜索历史数据，而不是当天的
router.post('/search',function(req,res,next){
	let latestDate = req.body.latestDate,
			keyword = req.body.keyword,
			currentPage = req.body.currentPage,
			pageSize = req.body.pageSize;
	//let condition = {date:latestDate};
	let condition = {};
	HouseArrangeExcel.find(condition,function(err,docs){
		if(err){
			res.json({
				status:-1
			})
		}else{
			//结果数组
			var result = [];
			docs.forEach(function(item){
				if( item.staffName.indexOf(keyword)!==-1 ||
						(item.roadNumber+item.detailPosition).indexOf(keyword)!==-1 ||
						item.index.toString().indexOf(keyword)!==-1
				)
				{
					result.push(item)
				}
			})
			//处理result
			var resData = [];
			result.forEach(function(item){
				var obj = {
					estateIndex:item.index,
					estatePosition:item.roadNumber+item.detailPosition,
					estateTelephone:item.telephone,
					isVisit:item.isVisit,
					staffName:item.staffName,
					//用正则匹配所有
					feedback:item.feedback.replace(/\*##\*/g,';'),
					date:item.date
				};
				resData.push(obj);
			});
			//找到所有符合条件的数据，再做分页处理
			resData = resData.slice((currentPage-1)*pageSize,currentPage*pageSize);
			if(resData.length>0){
				res.json({
					status:1,
					estateData:resData
				})
			}else{
				res.json({
					status:0,
				})
			}
		}
	});
});

//获取看房人员列表
router.post('/getStaffList',function(req,res,next){
	StaffListModel.find({},function(err,docs){
		if(err){
			res.json({
				status:-1
			})
		}else{
			var staffList = []
			docs.forEach(function(item){
				staffList.push(item.staffName)
			})
			res.json({
				status:1,
				staffList:staffList
			})
		}
	})
})

//获取时间
router.post('/getTimeFromServer',function(req,res,next){
	//获取当前时间
	var date = new Date();
	var currentYear = date.getFullYear()
	var currentMonth = date.getMonth()+1
	//获取3个月前的时间
	date.setMonth(date.getMonth()-3)
	var lastYear = date.getFullYear()
	var lastMonth = date.getMonth()+1
	var dateObj = {};
	//同一年
	if(currentMonth>lastMonth){
		dateObj[currentYear]={}
		for(var i=currentMonth;i>=lastMonth;i--){
			var d = new Date(currentYear,i,0)
			dateObj[currentYear][i]=d.getDate();
		}
	}else{
		//不同年份
		dateObj[lastYear]={}
		for(var i=lastMonth;i<=12;i++){
			var d = new Date(lastYear,i,0)
			dateObj[lastYear][i]=d.getDate();
		}
		dateObj[currentYear]={}
		for(var i=1;i<=currentMonth;i++){
			var d = new Date(currentYear,i,0)
			dateObj[currentYear][i]=d.getDate();
		}
	}
	//计算起始日期
	var d = new Date()
	var endTimeDate = d.getDate();
	d.setMonth(d.getMonth()-3)
	var startTimeDate = d.getDate();
	res.json({
		status:1,
		dateObj:dateObj,
		startTimeDate:startTimeDate,
		endTimeDate:endTimeDate
	})
})

//获取房屋图表数据
router.post('/getEstateGraphDataUrl',function(req,res,next){
	var finalStartTimeStr = req.body.startTimeStr,
			finalEndTimeStr = req.body.endTimeStr,
			finalStaffName = req.body.staffName,
			finalChartType = req.body.chartType;
	//查询条件
	var staffCondition = finalStaffName?{staffName:finalStaffName}:{};
	var timeCondition = {date:{$gte:finalStartTimeStr,$lte:finalEndTimeStr}};
	var condition = Object.assign({},staffCondition,timeCondition);
	HouseArrangeExcel.find(condition,function(err,docs){
		if(err){
			res.json({
				status:-1
			})
		}else{
			if(docs.length){
				if(finalChartType==='house'){
					//如果是看房数量house类型,记录下每个日期的已看未看数量，数据结构[{date:{visit:Number,unvisit:Number}}]
					var dataArray = [],map={},totalVisitedNum=0,totalUnvisitedNum=0;
					docs.forEach(function(item){
						item.isVisit?totalVisitedNum++:totalUnvisitedNum++;
						if(!map[item.date]){
							map[item.date]={
								visit:item.isVisit?1:0,
								unvisit:!item.isVisit?1:0
							}
						}else{
							if(item.isVisit){
								map[item.date].visit++;
							}else{
								map[item.date].unvisit++;
							}
						}
					});
					//构建日期序列，包含起始日期到终止日期间的所有日期
					dataArray = constructDateArray(finalStartTimeStr,finalEndTimeStr);
					//更新
					Object.keys(map).forEach(function(item){
						for(var i=0;i<dataArray.length;i++){
							var key = Object.keys(dataArray[i])[0];
							if(key===item){
								dataArray[i][key].visit=map[item].visit;
								dataArray[i][key].unvisit=map[item].unvisit;
								break;
							}
						}
					});
					//在后端排序，前端排序性能差,按时间升序排列
					dataArray.sort((a,b)=>sortDate(a,b));
					res.json({
						status:1,
						type:'house',
						dataArray:dataArray,
						totalVisitedNum:totalVisitedNum,
						totalUnvisitedNum:totalUnvisitedNum
					})

				}else{
					//查询所有看房人员
					StaffListModel.find({},function(err,staffDocs){
						if(err){
							res.json({
								status:-1
							})
						}else{
							let dataArray = [],map={},totalVisitedNum=0,totalUnvisitedNum=0;
							//初始化map
							staffDocs.forEach(function(item){
								map[item.staffName]={
									visit:0,
									unvisit:0
								}
							});
							//如果是个人接单staff类型,记录下每个人员的已看未看数量，数据结构[{staff:{visit:Number,unvisit:Number}}]
							docs.forEach(function(item){
								item.isVisit?totalVisitedNum++:totalUnvisitedNum++;
								if(item.isVisit){
									map[item.staffName].visit++;
								}else{
									map[item.staffName].unvisit++;
								}
							});
							Object.keys(map).forEach(function(item){
								let obj = {}
								obj[item]=map[item];
								dataArray.push(obj)
							});
							res.json({
								status:1,
								type:'staff',
								dataArray:dataArray,
								totalVisitedNum:totalVisitedNum,
								totalUnvisitedNum:totalUnvisitedNum
							})
						}
					});
				}
			}else{
				//数据为空
				res.json({
					status:0
				})
			}
		}
	})
});


//日期比较函数
function sortDate(a,b){
	var aKey = Object.keys(a)[0],
			bKey = Object.keys(b)[0];
	var s1 = aKey.split('-'),
			s2 = bKey.split('-');
	var intS1_0 = parseInt(s1[0],10),
			intS2_0 = parseInt(s2[0],10),
			intS1_1 = parseInt(s1[1],10),
			intS2_1 = parseInt(s2[1],10),
			intS1_2 = parseInt(s1[2],10),
			intS2_2 = parseInt(s2[2],10);
	if(intS1_0===intS2_0){
		if(intS1_1===intS2_1){
			return intS2_2-intS1_2
		}
		return intS2_1-intS1_1
	}
	return intS2_0-intS1_0
}

//构建日期序列
function constructDateArray(start,end){
	if(start>end){
		return []
	}
	var startSplitted = start.split('-')
	var startYear = parseInt(startSplitted[0],10),
			startMonth = parseInt(startSplitted[1],10)-1,
			startDay = parseInt(startSplitted[2],10);
	var startDate = new Date(startYear,startMonth,startDay);
	var startMillTime = startDate.getTime();

	var endSplitted = end.split('-')
	var endYear = parseInt(endSplitted[0],10),
			endMonth = parseInt(endSplitted[1],10)-1,
			endDay = parseInt(endSplitted[2],10);
	var endDate = new Date(endYear,endMonth,endDay);
	var endMillTime = endDate.getTime();

	var ret = [];
	while(startMillTime<=endMillTime){
		startMillTime = startDate.getTime();
		var tempStartMonth = startDate.getMonth()+1
		var str = startDate.getFullYear()+'-'+(tempStartMonth<10?('0'+tempStartMonth):tempStartMonth)+'-'+
				(startDate.getDate()<10?('0'+startDate.getDate()):startDate.getDate());
		let obj = {}
		obj[str]={visit:0,unvisit:0}
		ret.push(obj)
		startDate.setDate(startDate.getDate()+1);
	}
	ret.pop()
	return ret
}


module.exports = router;