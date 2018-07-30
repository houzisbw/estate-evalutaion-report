//微信app登录的路由
var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
//数据模型
var HouseArrangeExcel = require('./../../models/house_arrange_excel_content');
var WXUsers = require('./../../models/wx_models/wx_users');
//首页检查是否登录
router.get('/checkLogin',function(req,res,next){
		//根据cookie中的sessionid获取到session中对应的名字，便于后续操作
		//session就是存在mongodb的一个对象,这里是自动根据request的header中的cookie字段来判断是否存在username
		//session默认2周有效期

		//退出登录销毁session还没做
		var username = req.session.username;
		if(username){
			//业务逻辑,根据username去db中其他collection获取数据
		}else{
			//重新登录，此时可能是session过期或者用户退出小程序再登录
		}
});

//首页获取房屋excel列表信息,注意只获取最近一次派单的日期
router.post('/getEstateList',function(req,res,next){
	//获取type
	let type =  parseInt(req.body.type,10);
	//获取用户登录名字
	let username = req.body.username;
	//查询条件:0全部，1已看，2未看
	let condition = type === 0?{}:(type===1?{isVisit:true}:{isVisit:false});
	//登录未过期
	if(req.session.username){
		//首先得获取用户的真实姓名,根据username获取
		var promise = new Promise(function(resolve,reject){
			WXUsers.findOne({username:username},function(err,doc){
				if(err){
					reject();
				}else{
					resolve(doc)
				}
			})
		});
		promise.then(function(data){
			//获取真实姓名
			let realname = data.realname;
			//查询该姓名下的房屋记录
			return new Promise(function(resolve,reject){
				HouseArrangeExcel.find(Object.assign(condition,{staffName:realname}),function(err,docs){
					if(err){
						reject(-1)
					}else{
						if(docs.length){
							//查询成功，找到数据
							let resData = [];
							docs.forEach(function(item){
								let obj = {
									estateIndex:item.index,
									estatePosition:item.roadNumber+item.detailPosition,
									estateRoadNumber:item.roadNumber,
									estateTelephone:item.telephone,
									date:item.date,
									isVisit:item.isVisit,
									isUrgent:item.isUrgent,
									urgentInfo:item.urgentInfo
								};
								resData.push(obj);
							});
							//只取最近日期的数据,注意日期是字符串，需要转成整形比较
							resData.sort(function(a,b){
								var aArray = a.date.split('-'),
										bArray = b.date.split('-');
								var aInt = parseInt(aArray.join(''),10),
										bInt = parseInt(bArray.join(''),10);
								return aInt - bInt;
							});
							let latestDate = resData[resData.length-1].date;
							resData = resData.filter(function(item){return item.date == latestDate})
							//排序：先按加急，再按未完成，最后是已完成，然后是序号
							resData.sort(function(a,b){
								if(a.isUrgent === b.isUrgent){
									if(a.isVisit===b.isVisit){
										return a.estateIndex - b.estateIndex
									}
									return a.isVisit>b.isVisit
								}
								return a.isUrgent<b.isUrgent
							});
							resolve({status:1,estateData:resData});
						}else{
							reject(0)
						}
					}
				})
			})
		},function(){
			reject(-1)
		}).then(function(estateData){
			//查询成功
			res.json({
				status:1,
				msg:'查询成功',
				estateData:estateData
			})
		},function(err){
			if(err === -1){
				res.json({
					status:-1,
					msg:'查询失败'
				})
			}else{
				res.json({
					status:0,
					msg:'数据为空'
				})
			}
		});
	}else{
		//登录过期，跳转登录页面
		res.json({
			status:-2,
			msg:'登录过期'
		})
	}
})

//首页获取其他信息:单信息和日期
router.post('/getOtherInfo',function(req,res,next){
	var username = req.body.username;
	//需要查询实际名字,数据库WXUsers
	var promise = new Promise(function(resolve,reject){
		WXUsers.findOne({username:username},function(err,doc){
			if(err){
				reject();
			}else{
				resolve(doc)
			}
		})
	});
	promise.then(function(data){
		var realname = data.realname;
		var avatarUrl = data.avatar;
		//找到最近一次的派单时间
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
				var latestDate = docs[0].date,
						staffEstateTotalNum = 0,
						staffEstateVisitedNum = 0,
						staffEstateUnvisitedNum = 0;
				docs.forEach(function(item){
					if(item.staffName === realname){
						if(item.isVisit){
							staffEstateVisitedNum++;
						}else{
							staffEstateUnvisitedNum++;
						}
						staffEstateTotalNum++;
					}
				})
				res.json({
					status:1,
					realname,
					latestDate,
					avatarUrl,
					staffEstateTotalNum,
					staffEstateVisitedNum,
					staffEstateUnvisitedNum
				})
			}
		})
	},function(){
		res.json({
			status:-1
		})
	})
	//需要查询总单数，已看数，未看数, 需要查询最近一次派单日期,数据库HouseArrangeExcel



})

module.exports = router