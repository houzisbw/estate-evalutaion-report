var express = require('express');
var jwt = require('jwt-simple');
var jwtSecret = 'sbwlqy';
var cookieMaxAge = 1000*60*60*24*7;
//引入用户数据模型
var User = require('./../models/user');
var router = express.Router();

/* 登录处理 返回状态码:-1查询出错，2用户名或密码错误, 1成功*/
router.post('/login', function(req, res, next) {
    let username = req.body.username,
        password = req.body.password,
        remember = req.body.remember;
    //查询数据库
	//查询用户是否存在
	var query = User.where({username:username});
	query.findOne(function(err,doc) {
        if(err){
          res.json({
              status:-1
          })
        }else{
          //查询未出错
          //找到用户
          if(doc){
            //密码不正确
            if(doc.password !== password){
							res.json({
								status:2
							})
            }else{
											//设置cookie,token等
							let payload = {
								iss:username
							};
							let token = jwt.encode(payload,jwtSecret);
							//选择了记住我,cookie保存一周,不设置maxAge选项则浏览器窗口关闭后cookie消失,刷新页面并不会导致cookie消失
							//httpOnly如果设置了该选项则客户端js无法操作cookie，甚至无法查看
							if(remember === '1'){
								res.cookie('usertoken', token, {
									path: '/',
									//最大存活时间,单位:毫秒
									maxAge: cookieMaxAge

								});
				}else{
					console.log('not remember')
					res.cookie('usertoken', token, {
						path: '/'
					});
				}
                //登录成功
				res.json({
					status:1,
					auth:doc.auth,
					username:doc.username
				})
            }
          }else{
            //未找到用户
            res.json({
                status:2
            })
          }
        }
	})
});

//身份验证,返回码:1身份验证成功,-1验证失败
router.get('/checkAuth',function(req,res,next){
	let token = req.cookies.usertoken;
	if(token){
		//对token进行解码,解码失败会出错抛出异常,必须捕获错误，否则服务端500
		try{
			let decoded = jwt.decode(token,jwtSecret);
			let username = decoded.iss;
			//查询数据库看是否有该用户
			let query = User.where({username:username});
			query.findOne(function(err,doc){
				if(err){
					res.json({
						status:-1
					})
				}else{
					//找到用户,身份验证成功
					if(doc){
						res.json({
							status:1,
							auth:doc.auth
						})
					}else{
						res.json({
							status:-1
						})
					}
				}
			})

		}catch(err){
			//token不合法,身份验证失败
			res.json({
				status:-1
			})
		}
	}else{
		//token不存在，返回-1
		res.json({
			status:-1
		})
	}


});

//登出
router.get('/logout',function(req,res,next){
	//清除cookie
	res.clearCookie('usertoken');
	//返回前端时cookie就被清掉了
	res.json({
		status:1
	})
})

module.exports = router;
