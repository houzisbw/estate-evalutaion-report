/**
 * Created by Administrator on 2018/3/2.
 */
//模板表单输入组件
import React from 'react';
import './index.scss';
import {Row,Col,Form,Input,Tooltip,Select,Modal} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const Search = Input.Search;
const TextArea = Input.TextArea;
class ReportTemplateInputArea extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			//成新率的表,从数据库读出
			buildingNewRate:[
				[1995,54,62],
				[1996,56,63],
				[1997,58,65],
				[1998,60,67],
				[1999,62,68],

				[2000,64,70],
				[2001,66,72],
				[2002,68,73],
				[2003,70,75],
				[2004,72,77],

				[2005,74,78],
				[2006,76,80],
				[2007,78,82],
				[2008,80,83],
				[2009,82,85],

				[2010,84,87],
				[2011,86,88],
				[2012,88,90],
				[2013,90,92],
				[2014,92,93],

				[2015,94,95],
				[2016,96,97],
				[2017,98,98],
				[2018,100,100]

			],
			buildingNewRateDescription:[
				[60,'一般损坏房'],
				[80,'基本完好房'],
				[101,'完好房']
			],
			buildingStructure:{
				'混合':1,
				'砖混':1,
				'钢混':1,
				'框架':2,
				'框剪':2,
				'剪力墙':2
			}
		}
	}

	//提交表单
	handleSubmit(){
		this.props.form.validateFields((err, values) => {
			if (!err) {
				console.log('Received values of form: ', values);
			}else{
				Modal.warning({
					title: '客官请注意',
					content: '信息填写有误，请检查~',
				});
				return;
			}
		});
	}

	//获取成新率
	getBuildingNewRate(buildingYear, buildingStructure){
		let rate='',rateStr='';
		for(let j=0;j<this.state.buildingNewRate.length;j++){
			let item  = this.state.buildingNewRate[j];
			if(item[0] === parseInt(buildingYear,10)){
				rate = item[this.state.buildingStructure[buildingStructure]];
				if(rate){
					for(let i=0;i<this.state.buildingNewRateDescription.length;i++){
						if(rate < this.state.buildingNewRateDescription[i][0]){
							rateStr = this.state.buildingNewRateDescription[i][1];
							break;
						}
					}
					break;
				}
			}
		}
		return !rate?'':rate+'%，属于'+rateStr+"。"
	}
	//处理select的onChange,v是选中的option的value
	handleSelectOnChange(v,itemName){
		//如果是建筑结构下拉
		if(itemName === '建筑结构'){
			//判断建筑年代是否有值,首先通过getFieldValue获取input的值
			let buildingDateValue = this.props.form.getFieldValue('建成年代');
			if(buildingDateValue){
				let newRateStr = this.getBuildingNewRate(buildingDateValue, v);
				this.props.form.setFieldsValue({
					'成新率':newRateStr
				})
			}
		}
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
				let dist = parseInt(metroConditionList[0][1],10);
				let formatDistance = dist < 500 ? Math.ceil(dist/100)*100+'米，' : (dist/1000).toFixed(1)+'公里，';
				resultString+='距'+tempAddress+"“"+metroConditionList[0][2]+"”站沿路距离约"+formatDistance;
			}
			resultString+='公共交通便捷度和道路通达度较好，区域内居家生活较便利。';
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
			if(t.type === 'input') return (
				<Input   />
			);
			else if(t.type === 'dropdown') {
					return (
					//combobox属性的下拉框含有输入属性，可以自定义输入,很棒
					<Select mode="combobox" onChange={(v)=>{this.handleSelectOnChange(v,t.itemName)}} placeholder={t.itemName+',下拉框'}>
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
							{/*注意这里可能是下拉框,也可能是label,需要判断*/}
							{
								t.isDropdown ? (
									<FormItem>
										{/*注意如果组件被getFieldDecorator包裹，则不能用defaultValue,改用initialValue*/}
										{/*这里如果输入框的label也是下拉框，则要单独算一个值,单独命名dropdownItemName*/}
										{getFieldDecorator(t.dropdownItemName,{
											initialValue:t.dropdownOption[0]
										})(
											<Select className="select-input-margin-offset">
												{
													t.dropdownOption.map((item,index)=>{
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
										)}
									</FormItem>
								) :
												(<Tooltip title={t.itemName} >
														<span className="label-span-only">{t.itemName}:</span>
												 </Tooltip>)
							}

						</div>
						<div className="input-div" style={inputDivStyle}>
							{
								<FormItem >
								{getFieldDecorator(t.itemName,{
									initialValue:t.initialValue?t.initialValue:''
								})(
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
