/**
 * 小程序我的页的路由处理
 */
var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var httpType = require('./../../config/config').httpType;
//获取文件上传中间处理模块
var multiparty = require('connect-multiparty')
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

//图片上传
router.post('/imageUpload',multiparty(),function(req,res,next){
	//获取用户名
	var username = req.body.username;
	//获得文件名,username是前端设置的name的值，用于获取文件名
	var filename = req.files[username].originalFilename || path.basename(req.files[username].path);
	//时间戳用于区别原图和新上传的图片,否则小程序不显示更新的图片
	var time = (new Date().getTime()).toString();
	//头像图片目标存储位置,需要覆盖之前的图片
	var targetPath = path.join(__dirname,'../../public/wx_user_avatar/')+username+time+'.jpg';
	//首先删除以username开头的图片
	var dir = path.join(__dirname,'../../public/wx_user_avatar/')
	var files = fs.readdirSync(dir);
	files.forEach(function (item, index) {
		//如果找到以username开头的图片，则删除,防止重复保存图片
		if(item.indexOf(username)!==-1){
			fs.unlinkSync(dir+item)
		}
	});

	//保存图片到指定文件夹
	var readStream = fs.createReadStream(req.files[username].path);
	var writeSteam = fs.createWriteStream(targetPath);
	readStream.pipe(writeSteam);
	//文件写入完成
	writeSteam.on('close',function(){
		//存储文件绝对路径到数据库
		var url = httpType+req.headers.host+'/wx_user_avatar/'+username+time+'.jpg';
		WXUser.findOneAndUpdate({username:username},{avatar:url},function(err){
			if(err){
				res.json({
					status:-1
				})
			}else{
				res.json({
					status:1,
					avatarUrl:url
				})
			}
		})
	})

})

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