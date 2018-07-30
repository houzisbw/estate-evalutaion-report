/**
 * 小程序我的页的路由处理
 */
var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var WXUser = require('./../../models/wx_models/wx_users');
//保存用户头像
router.post('/saveAvatar',function(req,res,next){
	var username = req.body.username;
	var url = req.body.avatarUrl;
	WXUser.findOneAndUpdate({username:username},{avatar:url},function(err){
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
//拉取用户信息
router.post('/getPersonalInfo',function(req,res,next){
	var username = req.body.username;
	WXUser.findOne({username:username},function(err,doc){
		if(err){
			res.json({
				status:-1
			})
		}else{
			if(doc){
				//找到用户
				res.json({
					status:1,
					info:doc
				})
			}else{
				//未找到用户
				res.json({
					status:0
				})
			}
		}
	})
});
//退出登录
router.post('/logout',function(req,res,next){
	//销毁session
	req.session.destroy(function(err) {
		res.json({
			status:1
		})
	})
});
module.exports = router