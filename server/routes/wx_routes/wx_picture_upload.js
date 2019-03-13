// 微信小程序图片上传
var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');

//微信图片数据模型
var pictureConfigModel = require('./../../models/wx_models/wx_picture_config')

// 获取图片配置信息
router.post('/getPictureConfig',function(req,res){
  let type = req.body.type;
  pictureConfigModel.find({type:type},function(err,docs){
    if(err){
      res.json({
        status:-1
      })
    }else{
      //按序号升序排列
      var result  = [];
      docs.forEach((item)=>{
        result.push({
          name:item.name,
          min:item.min,
          max:item.max
        })
      })
      res.json({
        status:1,
        config:result
      })
    }
  })

})

module.exports = router