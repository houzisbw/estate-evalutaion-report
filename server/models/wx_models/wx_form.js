/**
 * Created by Administrator on 2018/9/2.
 */
//小程序表单结构
var mongoose = require('mongoose');
var formSchema = new mongoose.Schema({
		//该字段序号
		index:Number,
		//该字段中文名
		name:String,
		//英文key
		key:String,
		//该表单项类型(input,radio,checkbox,structure,slider)
		type:String,
		//父类型名称，只用于折叠组件
		parentCollapseName:String,
		//默认值(该值种类可能是任何一个)
		defaultValue:mongoose.Schema.Types.Mixed,
		//如果是输入框，输入框的类型(number,digit,text)
		inputType:String,
		//如果是单选组件，是否有其他选项
		hasOther:Boolean,
		//取值范围，如果是单选多选，表示为分号分隔的字符串
		range:String,

});
module.exports = mongoose.model('wx_form',formSchema);
