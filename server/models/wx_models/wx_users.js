var mongoose = require('mongoose');
var userSchema = new mongoose.Schema({
	//用户id
	username:String,
	//密码
	password:String,
	//实际姓名
	realname:String,
	//权限
	auth:String
});
module.exports = mongoose.model('wx_user',userSchema);
