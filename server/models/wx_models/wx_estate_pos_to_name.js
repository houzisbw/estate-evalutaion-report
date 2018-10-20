/**
 * Created by Administrator on 2018/9/8.
 */
//小程序房地产位置和名称对应关系表
var mongoose = require('mongoose');
var estatePosToNameSchema = new mongoose.Schema({
	estateName:String,
	estatePos:String
});
module.exports = mongoose.model('wx_form_estate_position_to_estate_name',estatePosToNameSchema);
