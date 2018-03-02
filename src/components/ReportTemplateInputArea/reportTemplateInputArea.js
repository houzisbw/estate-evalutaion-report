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
					<TextArea placeholder={placeholder} autosize={{ minRows: 3, maxRows: 6 }} />
				)
			}else if(t.type === 'search'){
				return (<div className="search-input-special-green">
							<Search placeholder="请输入小区名称~" onSearch={(value)=>{this.props.onInputSearch(value)}} enterButton/>
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
