// 微信小程序图片上传
var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');

//微信图片数据模型
var pictureConfigModel = require('./../../models/wx_models/wx_picture_config')
//房屋数据模型
var HouseArrangeModel = require('./../../models/house_arrange_excel_content')

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

});

// 更新签到位置
router.post('/updateSignPosition',function(req,res){
  let pos = req.body.position;
  let index = parseInt(req.body.index,10);
  HouseArrangeModel.update({
    index:index
  },{
    signPosition:pos
  },{multi: true},function(err){
    res.json({
      status:1
    })
  })
});

// 处理图片是否传完
router.post('/updateCanDownload',function(req,res){
  let index = parseInt(req.body.index,10);
  HouseArrangeModel.findOne({index:index},function(err,doc){
    if(err){
      res.json({
        status:-1
      })
    }else{
      let can = !doc.canDownloadPictures;
      doc.canDownloadPictures = can;
      doc.save();
      res.json({
        status:1,
        can:can
      })
    }
  })
})

// 获取图片是否上传完
router.post('/fetchCanDownload',function(req,res){
  let index = parseInt(req.body.index,10);
  HouseArrangeModel.findOne({index:index},function(err,doc){
    if(err){
      res.json({
        status:-1
      })
    }else{
      let can = doc.canDownloadPictures;
      res.json({
        status:1,
        can:can
      })
    }
  })
})

module.exports = router