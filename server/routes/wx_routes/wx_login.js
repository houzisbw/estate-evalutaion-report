//微信app登录的路由
var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
//用户数据模型
var User = require('./../../models/wx_models/wx_users');
var expires = require('./../../config/config').sessionIdExpires;
//登录接口
router.post('/wxLogin',function(req,res,next){
	var username = req.body.username,
			password = req.body.password;
	var query = User.where({username:username,password:password});
	query.findOne(function(err,doc){
		if(err){
			res.json({
				status:-1
			})
		}else{
			if(!doc){
				//用户名或密码错误
				res.json({
					status:0
				})
			}else{
				//找到用户
				res.json({
					status:1,
					expires:expires
				})
			}
		}
	});
});

module.exports = router