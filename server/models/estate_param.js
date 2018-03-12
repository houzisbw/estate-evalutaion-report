/**
 * Created by Administrator on 2018/3/11.
 */
//预评估报告数据的各种参数
var mongoose = require('mongoose')
var paramSchema = new mongoose.Schema({
	param:{
		buildingNewRate:Array,
		buildingNewRateDescription:Array,
		buildingStructure:Array,
		preReportDocx:Object,
		//土地出让金
		landTransactionFee:Object
	}
})

module.exports =  mongoose.model('estate_param',paramSchema)