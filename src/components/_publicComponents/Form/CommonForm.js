/**
 * Created by Administrator on 2018/3/28.
 */
//公用的通用表单组件，数据由props传入，方法也要传入
import React from 'react'
import {Form,Col,Row,Input,Select,Tooltip} from 'antd'
import './index.scss'
const FormItem = Form.Item;
const Option = Select.Option;
class CommonForm extends React.Component{
	constructor(props){
		super(props);
	}
	//表单提交
	handleSubmit(){
		let value = this.props.form.getFieldsValue();
		return value
	}
	render(){
		const { getFieldDecorator } = this.props.form;
		return (
			<div className="input-type-choose-area" id="commonform-scroll-area" style={{position:'relative'}}>
				<Form layout="horizontal" >
					{
						this.props.formData.map((value,index)=>{
							let type = value.type;
							let formInputJSX = '';
							//大小
							let width = parseInt(value.size,10)===1?'50%':'100%';
							//区分不同输入框,getPopupContainer用于处理滚动时下拉框不动的问题,默认下拉框挂载body上
							//body没有滚动时下拉框不变位置,所以得改变挂载位置
							switch(type){
								case 'input':
									formInputJSX = <Input style={{width:width}}/>
									break;
								case 'select':
									formInputJSX = (
										<Select style={{width:width}}
												getPopupContainer={() => document.getElementById('commonform-scroll-area')}
												mode={value.mode}
												showArrow={true}
												filterOption={false}>
											{
												value.selectionData?(
													value.selectionData.map((selectValue,selectIndex)=>{
														return (
															<Option key={selectIndex} value={selectValue.value}>{selectValue.text}</Option>
														)
													})
												):null
											}
										</Select>
									)
									break;
								default:break;
							}
							return (
								<FormItem key={index}>
									<Row>
										<Col span={24}>
											<div className="pre-report-input-label-div">
												<Tooltip title={value.label}>
													<span>{value.label}:</span>
												</Tooltip>
											</div>
											<div className="pre-report-input-input-div">
												{getFieldDecorator(value.FieldDecoratorName, {
													initialValue:value.initialValue?value.initialValue:''
												})(
													formInputJSX ? formInputJSX : null
												)}
											</div>
										</Col>
									</Row>
								</FormItem>
							)

						})
					}
				</Form>
			</div>
		)
	}
}
export default Form.create()(CommonForm)