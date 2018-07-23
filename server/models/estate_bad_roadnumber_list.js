/**
 * 房屋错误街道号列表
 */

var mongoose = require('mongoose');
var BadRoadnumber = new mongoose.Schema({
	originName:String,
	validName:String
});
//注意mongodb会自动加s，这里的加s是变成复数的意思，registery=>registeries，不是单纯的加s
module.exports = mongoose.model('estate_bad_roadnumber_list',BadRoadnumber)
