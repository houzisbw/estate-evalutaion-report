/**
 * Created by Administrator on 2018/3/9.
 */
//预评估报告:各个银行的输入框字段存储模型
var mongoose = require('mongoose');
var PreReportInputData = new mongoose.Schema({
	bankName:String,
	inputData:[{
		partName:String,
		data:[{
			//输入框label文字
			itemName:String,
			//输入框种类,注意type是保留字，不能使用
			inputType:String,
			//输入框是下拉，下拉的数据
			dropdownData:Array,
			//输入框label是否是下拉
			isDropdown:Boolean,
			//输入框label下拉的数据
			dropdownOption:Array,
			//输入框尺寸
			size:String,
			//输入框index
			index:Number,
			//输入框label下拉的index
			dropdownLabelIndex:Number,
			//输入框初始值
			initialValue:String,
			//输入框placeholder
			placeholder:String

		}]
	}]
});
module.exports = mongoose.model('pre_report_inputs_data',PreReportInputData);