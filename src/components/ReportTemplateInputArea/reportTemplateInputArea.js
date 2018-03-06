/**
 * Created by Administrator on 2018/3/2.
 */
//模板表单输入组件
import React from 'react';
import './index.scss';
import {Row,Col,Form,Input,Tooltip,Select} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const Search = Input.Search;
const TextArea = Input.TextArea;
class ReportTemplateInputArea extends React.Component{
	constructor(props){
		super(props);
	}
	//清空输入框
	handleClearInputs(inputsNameList){
		let obj = {};
		inputsNameList.forEach((item)=>{
			obj[item] = ''
		});
		this.props.form.setFieldsValue(obj);
	}
	//处理父组件传来的值，分类处理
	handleInputChange(dataObj){
		//如果是临路状况和区位状况
		if(dataObj.type === 'ROAD_AND_AREA'){
			this.props.form.setFieldsValue({
				'临路状况':dataObj.data.road,
				'区域概况':dataObj.data.facility
			})
		//点击搜索结果改变区位概况
		}else if(dataObj.type === 'AREA_FACILITY'){
			let resultString = '';
			let estateConditionList = [],
				busConditionList = [],
				metroConditionList = [],
				schoolConditionStr = '',
				hospitalConditionStr = '',
				buyConditionStr = '',
				bankConditionStr = '';
			dataObj.data.forEach((item)=>{
				if(item.type === '小区'){
					estateConditionList.push(item.name)
				}else if(item.type === '地铁站'){
					//进行特殊处理，有可能address是多个地铁站,有可能address根本没有xx路相关信息
					//只写一个地铁站
					if(metroConditionList.length === 0){
						metroConditionList.push([item.address,item.distance,item.name]);
					}
				}else if(item.type === '公交站'){
					//进行特殊处理，有可能address是多个地铁站,有可能address根本没有xx路相关信息
					//split处理
					let splitted = item.address.split(';')
					//正则判断是否是正确的公交线路
					let regExp = /[0-9]+路$/;
					splitted.forEach((item)=>{
						//去首尾空格
						item = item.replace(/(^\s*)|(\s*$)/g, "");
						if(regExp.test(item)){
							if(busConditionList.indexOf(item)===-1){
								busConditionList.push(item);
							}
						}
					});
				}else if(item.type === '幼儿园' || item.type === '小学' || item.type === '中学' || item.type === '大学'){
					schoolConditionStr+=item.name+"、"
				}else if(item.type === '医院'){
					hospitalConditionStr+=item.name+"、"
				}else if(item.type === '商场' || item.type === '超市' || item.type === '市场'){
					buyConditionStr+=item.name+"、"
				}else if(item.type ==='银行'){
					bankConditionStr+=item.name+"、"
				}
			});
			//处理小区字符串
			resultString += '周边有';
			estateConditionList.forEach((item,index)=>{
				resultString += index === estateConditionList.length-1 ?'“'+item+"”" :'“'+item+"”、"
			});
			resultString += '等住宅楼盘，区域内有';

			//处理其他字符串
			resultString+=schoolConditionStr+hospitalConditionStr+buyConditionStr+bankConditionStr;
			if(resultString[resultString.length-1] === '、'){
				resultString = resultString.substr(0,resultString.length-1);
			}
			resultString+="等公共及生活配套设施，区域内有";

			//处理公交字符串
			busConditionList.forEach((item,index)=>{
				resultString += index === busConditionList.length-1 ?item :item+"、"
			})
			resultString+='等公交车经过，';

			//处理地铁字符串,如果没有不写这一句
			if(metroConditionList.length>0){
				let tempAddress = metroConditionList[0][0].split(';')[0];
				let tempDist = (parseInt(metroConditionList[0][1],10)/1000).toFixed(1);
				let formatDistance = tempDist < 0.1 ? '0.1':tempDist;
				resultString+='距'+tempAddress+"“"+metroConditionList[0][2]+"”站沿路距离约"+formatDistance+'公里，公共交通便捷度和道路通达度较好，区域内居家生活较便利。'
			}
			this.props.form.setFieldsValue({
				'区域概况':resultString
			})

		}
	}

	//生成表单
	generateInputFields(){
		const {getFieldDecorator} = this.props.form;
		const children = [];
		//根据输入框类型的不同显示不同的输入框
		const getInput = (t)=>{
			if(t.type === 'input') return <Input  placeholder={t.itemName} />;
			else if(t.type === 'dropdown') {
					return (
					//combobox属性的下拉框含有输入属性，可以自定义输入,很棒
					<Select mode="combobox">
						{
							t.dropdownData.map((item,index)=>{
								return(
										<Option value={item} key={index}>
											<Tooltip title={item} placement="topLeft">
												{item}
											</Tooltip>
										</Option>
								)
							})
						}
					</Select>
				)
			}
			else if(t.type === 'textarea') {
				let placeholder = t.placeholder ? t.placeholder: '';
				return (
					<TextArea  placeholder={placeholder} autosize={{ minRows: 3, maxRows: 6 }} />
				)
			}else if(t.type === 'search'){
				return (<div className="search-input-special-green">
							<Search  placeholder="请输入小区名称查找临路状况和区域概况~" onSearch={(value)=>{this.props.onInputSearch(value)}} enterButton/>
						</div>)
			}
		};
		for(let i=0;i<this.props.dataList.length;i++){
			let t = this.props.dataList[i];
			let spanNumber = t.size === '1' ? 6 : (t.size === '2'?12:24);
			//独占一行的input必须重新设定宽度，为了美观
			let labelDivStyle = t.size === '3' ? {width:'17%'}:{};
			let inputDivStyle = t.size === '3' ? {width:'83%'}:{};
			//注意必须设置key
			children.push(
				<Col span={spanNumber} key={t.itemName}>
					<div className="col-input-wrapper clearfix">
						<div className="label-div tool-tip-color" style={labelDivStyle}>
							<Tooltip title={t.itemName} >
								<span>{t.itemName}:</span>
							</Tooltip>
						</div>
						<div className="input-div" style={inputDivStyle}>
							{
								<FormItem >
								{getFieldDecorator(t.itemName)(
									getInput(t)
								)}
								</FormItem>
							}

						</div>
					</div>
				</Col>
			)
		}
		return children;

	}
	render(){
		return (
			<Form layout="horizontal">
				{/*gutter定义了一行内col的间隔*/}
				<Row gutter={16}>
					{this.generateInputFields()}
				</Row>
			</Form>
		)
	}
}

export default 	Form.create()(ReportTemplateInputArea)
