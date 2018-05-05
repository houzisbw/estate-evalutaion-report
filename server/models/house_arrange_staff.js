/**
 * Created by Administrator on 2018/5/5.
 */
//看房人员名单
var mongoose = require('mongoose');
var HouseArrangeStaff = new mongoose.Schema({
	staffName:String
});
module.exports = mongoose.model('house_arrange_staff',HouseArrangeStaff);