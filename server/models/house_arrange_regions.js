/**
 * Created by Administrator on 2018/5/5.
 */
//成都市片区
var mongoose = require('mongoose');
var regionSchema = new mongoose.Schema({
	regionName:String
});
module.exports = mongoose.model('house_arrange_region',regionSchema);