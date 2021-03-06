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
			placeholder:String,
			//下拉框是否不可编辑,true表示不能编辑
			canDropdownEditable:Boolean,

			//input框不可删除(某些输入框不可删除，因为和其他有关联，然后代码里也写死了)
			//true不可删除，false可删除
			//index为6,7,26,34,12,27,28不可删除
			cannotDelete:Boolean

		}]
	}]
});
module.exports = mongoose.model('pre_report_inputs_data',PreReportInputData);