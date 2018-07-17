//微信app登录的路由
var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
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

module.exports = router