/**
 * Created by Administrator on 2019/3/7 0007.
 */
// 微信上传图片的配置
var mongoose = require('mongoose');
var userSchema = new mongoose.Schema({
  name:String,
  max:Number,
  min:Number,
  //照片类型: 普通住宅/办公, 别墅, 商用
  type:String
});
module.exports = mongoose.model('wx_picture_config',userSchema);
