var express = require('express');
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


                //登录成功
				res.json({
					status:1,
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

module.exports = router;
