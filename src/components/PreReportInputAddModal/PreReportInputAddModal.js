/**
 * Created by Administrator on 2018/3/16.
 */
//预评估报告添加时模态框输入组件
import React from 'react'
import {Form,Row,Col,Input,Select,Tooltip,Button,notification,InputNumber } from 'antd'
import './index.scss'
const FormItem = Form.Item;
const Option = Select.Option;
class PreReportInputAddModal extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			//输入框是否为下拉，默认否,控制其相关选项的展示与否
			isInputDropdown:false,
			//输入框左侧文字是否下拉
			isInputLabelDropdown:false,
			//右侧输入框下拉数据填写的Input
			rightDropdownInputValue:'',
			//左侧输入框下拉数据填写的Input
			leftDropdownInputValue:'',
			//右侧输入框下拉的option
			rightDropdownOptions:[],
			//左侧输入框下拉的option
			leftDropdownOptions:[],
			//右侧index
			rightIndex:'',
			//左侧index
			leftIndex:''
		}
	}
	//输入框类型选择
	handleInputTypeChange(v){
		//如果是下拉选择框则显示其相关输入选项
		if(v === 'dropdown'){
			this.setState({
				isInputDropdown:true
			})
		}else{
			this.setState({
				isInputDropdown:false
			})
		}
	}
	//输入框左侧文字是否下拉
	handleInputLabelChange(v){
		if(v === '是'){
			this.setState({
				isInputLabelDropdown:true
			})
		}else{
			this.setState({
				isInputLabelDropdown:false
			})
		}
	}
	//处理下拉框添加按钮逻辑
	handleDropdownAddButton(type){
		if(type === 'RIGHT'){
			if(!this.state.rightDropdownInputValue){
				notification['error']({
					message: '请注意~',
					description: '输入数据不能为空!',
				});
			}else{
				//判断是否有相同的添加结果
				let isExist = this.state.rightDropdownOptions.indexOf(this.state.rightDropdownInputValue)
				if(isExist !== -1){
					notification['error']({
						message: '请注意~',
						description: '输入数据不能相同!',
					});
					return;
				}
				//concat返回新数组
				let tempArr = this.state.rightDropdownOptions.concat(this.state.rightDropdownInputValue);
				this.setState({
					rightDropdownOptions:tempArr,
					rightDropdownInputValue:''
				});
				notification['success']({
					message: '恭喜~',
					description: '添加数据成功!',
				});
			}
		}else{
			if(!this.state.leftDropdownInputValue){
				notification['error']({
					message: '请注意~',
					description: '输入数据不能为空!',
				});
			}else{
				//判断是否有相同的添加结果
				let isExist = this.state.leftDropdownOptions.indexOf(this.state.leftDropdownInputValue)
				if(isExist !== -1){
					notification['error']({
						message: '请注意~',
						description: '输入数据不能相同!',
					});
					return;
				}
				//concat返回新数组
				let tempArr = this.state.leftDropdownOptions.concat(this.state.leftDropdownInputValue);
				this.setState({
					leftDropdownOptions:tempArr,
					leftDropdownInputValue:''
				});
				notification['success']({
					message: '恭喜~',
					description: '添加数据成功!',
				});
			}
		}

	}
	//右侧输入框下拉input数据
	handleRightDropdownInputValue(e,type){
		if(type === 'RIGHT'){
			this.setState({
				rightDropdownInputValue:e.target.value
			})
		}else{
			this.setState({
				leftDropdownInputValue:e.target.value
			})
		}

	}
	//处理下拉框选中时的逻辑
	handleSelectChange(v,type){
		//删除该选项
		if(type === 'RIGHT'){
			let index = this.state.rightDropdownOptions.indexOf(v);
			let t = this.state.rightDropdownOptions;
			t.splice(index,1);
			this.setState({
				rightDropdownOptions:t
			})
			notification['success']({
				message: '恭喜~',
				description: '删除数据成功!',
			});
		}else{
			let index = this.state.leftDropdownOptions.indexOf(v);
			let t = this.state.leftDropdownOptions;
			t.splice(index,1);
			this.setState({
				leftDropdownOptions:t
			})
			notification['success']({
				message: '恭喜~',
				description: '删除数据成功!',
			});
		}
	}
	//处理数字输入框变化
	handleInputNumberChange(e,type){
		let v = e.target.value;
		//校验是否是正整数
		let regExp = /^[1-9][0-9]*$/g;
		if(type === 'RIGHT_INDEX'){
			//如果不通过则清空输入框
			if(!regExp.test(v)){
				this.setState({
					rightIndex:''
				})
			}else{
				this.setState({
					rightIndex:parseInt(v,10)
				})
			}
		}else{
			//如果不通过则清空输入框
			if(!regExp.test(v)){
				this.setState({
					leftIndex:''
				})
			}else{
				this.setState({
					leftIndex:parseInt(v,10)
				})
			}
		}

	}
	render(){
		const { getFieldDecorator } = this.props.form;
		return (
			<div>
				<div className="input-type-choose-area">
					<Form layout="horizontal">
						<FormItem>
							<Row>
								<Col span={24}>
									<div className="pre-report-input-label-div">
										<span>数据所在版块名称:</span>
									</div>
									<div className="pre-report-input-input-div">
										{getFieldDecorator('partName', {
											initialValue:'实物状况',
											rules: [{message: 'Please input the captcha you got!' }],
										})(
											<Select style={{width:170}}>
												<Option value="实物状况">实物状况</Option>
												<Option value="区位状况">区位状况</Option>
												<Option value="估价结果">估价结果</Option>
											</Select>
										)}
									</div>
								</Col>
							</Row>
						</FormItem>
						<FormItem>
							<Row>
								<Col span={24} style={{borderBottom:'1px dashed #D1D1D1',marginBottom:'5px',paddingBottom:'5px'}}>
									<div className="pre-report-input-label-div">
										<span>输入框大小尺寸:</span>
									</div>
									<div className="pre-report-input-input-div">
										{getFieldDecorator('size', {
											initialValue:'1',
											rules: [{message: 'Please input the captcha you got!' }],
										})(
											<Select style={{width:170}}>
												<Option value="1">小尺寸(1/4列宽度)</Option>
												<Option value="2">中尺寸(1/2列宽度)</Option>
												<Option value="3">大尺寸(整列宽度)</Option>
											</Select>
										)}
									</div>
								</Col>
							</Row>
						</FormItem>
						<FormItem>
							<Row>
								<Col span={24} >
									<div className="pre-report-input-label-div">
										<span className="mutable-input-span">输入框种类选择:</span>
									</div>
									<div className="pre-report-input-input-div">
										{getFieldDecorator('inputType', {
											initialValue:'input',
											rules: [{message: 'Please input the captcha you got!' }],
										})(
											<Select style={{width:170}}
													onChange={(v)=>this.handleInputTypeChange(v)}>
												<Option value="input">文字输入框(单列)</Option>
												<Option value="textarea">文字输入域(多列)</Option>
												<Option value="dropdown">下拉选择框</Option>
											</Select>
										)}
									</div>
								</Col>
							</Row>
						</FormItem>
						<FormItem>
							<Row>
								<Col span={24}>
									<div className="pre-report-input-label-div">
										<Tooltip title="输入框序号(正整数，布局排序用，越小越前，有些序号已经被占用)">
											<span >输入框序号:</span>
										</Tooltip>
									</div>
									<div className="pre-report-input-input-div">
										{/*注意此处没有用getFieldDecorator,是为了自定义校验时机和内容*/}
										<Input style={{width:170}}
											   value={this.state.rightIndex}
											   onChange={(e)=>this.handleInputNumberChange(e,'RIGHT_INDEX')}
										/>
									</div>
								</Col>
							</Row>
						</FormItem>
						{
							!this.state.isInputDropdown ? (
								<FormItem>
									<Row>
										<Col span={24}>
											<div className="pre-report-input-label-div">
												<Tooltip title="输入框初始值">
													<span >输入框初始值:</span>
												</Tooltip>
											</div>
											<div className="pre-report-input-input-div">
												{getFieldDecorator('initialValue', {
													initialValue:'',
													rules: [{message: 'Please input the captcha you got!' }],
												})(
													<Input style={{width:170}}/>
												)}
											</div>
										</Col>
									</Row>
								</FormItem>
							):null
						}
						{
							this.state.isInputDropdown ? (
								<FormItem>
									<Row>
										<Col span={24}>
											<div className="pre-report-input-label-div">
												<Tooltip title="输入框下拉的数据, 输入内容点击添加按钮进行添加, 单击下拉框内容进行删除">
													<span >输入框下拉的数据:</span>
												</Tooltip>
											</div>
											<div className="pre-report-input-input-div">
												{getFieldDecorator('dropdownData', {
													initialValue:this.state.rightDropdownOptions.length>0?this.state.rightDropdownOptions[0]:'',
													rules: [{message: 'Please input the captcha you got!' }],
												})(
													<Select style={{width:170}}
															notFoundContent="请添加数据"
															allowClear={true}
															onSelect={(v)=>this.handleSelectChange(v,'RIGHT')}>
														{
															this.state.rightDropdownOptions.map((v,index)=>{
																return (
																	<Option key={index} value={v}>{v}</Option>
																)
															})
														}
													</Select>
												)}
												{/*添加数据按钮*/}
												<div className="dropdownOption-add-button">
													<Input style={{width:170,marginRight:10}} value={this.state.rightDropdownInputValue} onChange={(e)=>this.handleRightDropdownInputValue(e,'RIGHT')}/>
													<Button onClick={()=>this.handleDropdownAddButton('RIGHT')}>添加</Button>
												</div>
											</div>
										</Col>
									</Row>
								</FormItem>
							):null
						}
						{
							this.state.isInputDropdown?(
								<FormItem>
									<Row>
										<Col span={24}>
											<div className="pre-report-input-label-div">
												<Tooltip title="输入框下拉的数据不可编辑性(选是为不可编辑，只能选择数据，无法定义输入数据)">
													<span >输入框下拉的数据不可编辑性:</span>
												</Tooltip>
											</div>
											<div className="pre-report-input-input-div">
												{getFieldDecorator('canDropdownEditable', {
													initialValue:'否',
													rules: [{message: 'Please input the captcha you got!' }],
												})(
													<Select style={{width:170}}>
														<Option value="是">是</Option>
														<Option value="否">否</Option>
													</Select>
												)}
											</div>
										</Col>
									</Row>
								</FormItem>
							):null
						}

						<FormItem>
							<Row>
								<Col span={24} style={{borderTop:'1px dashed #D1D1D1',marginTop:'5px',paddingTop:'5px'}}>
									<div className="pre-report-input-label-div">
										<Tooltip title="输入框左侧文字是否下拉">
											<span className="mutable-input-span">输入框左侧文字是否下拉:</span>
										</Tooltip>
									</div>
									<div className="pre-report-input-input-div">
										{getFieldDecorator('isDropdown', {
											initialValue:'否',
											rules: [{message: 'Please input the captcha you got!' }],
										})(
											<Select style={{width:170}} onChange={(v)=>this.handleInputLabelChange(v)}>
												<Option value="是">是</Option>
												<Option value="否">否</Option>
											</Select>
										)}
									</div>
								</Col>
							</Row>
						</FormItem>
						{
							!this.state.isInputLabelDropdown?(
								<FormItem>
									<Row>
										<Col span={24}>
											<div className="pre-report-input-label-div">
												<Tooltip title="输入框左侧文字">
													<span >输入框左侧文字:</span>
												</Tooltip>
											</div>
											<div className="pre-report-input-input-div">
												{getFieldDecorator('itemName', {
													initialValue:'',
													rules: [{message: 'Please input the captcha you got!' }],
												})(
													<Input style={{width:170,marginRight:10}}/>
												)}
											</div>
										</Col>
									</Row>
								</FormItem>
							):null
						}
						{
							this.state.isInputLabelDropdown?(
								<FormItem>
									<Row>
										<Col span={24}>
											<div className="pre-report-input-label-div">
												<Tooltip title="输入框左侧下拉的数据, 输入框输入内容点击添加按钮进行添加, 单击下拉框内容进行删除">
													<span >输入框左侧下拉的数据:</span>
												</Tooltip>
											</div>
											<div className="pre-report-input-input-div">
												{getFieldDecorator('dropdownOption', {
													initialValue:'',
													rules: [{message: 'Please input the captcha you got!' }],
												})(
													<Select style={{width:170}}
															notFoundContent="请添加数据"
															allowClear={true}
															onSelect={(v)=>this.handleSelectChange(v,'LEFT')}>
														{
															this.state.leftDropdownOptions.map((v,index)=>{
																return (
																	<Option key={index} value={v}>{v}</Option>
																)
															})
														}
													</Select>
												)}
												{/*添加数据按钮*/}
												<div className="dropdownOption-add-button">
													<Input style={{width:170,marginRight:10}} value={this.state.leftDropdownInputValue} onChange={(e)=>this.handleRightDropdownInputValue(e,'LEFT')}/>
													<Button onClick={()=>this.handleDropdownAddButton('LEFT')}>添加</Button>
												</div>
											</div>
										</Col>
									</Row>
								</FormItem>
							):null
						}
						{
							this.state.isInputLabelDropdown?(
								<FormItem>
									<Row>
										<Col span={24}>
											<div className="pre-report-input-label-div">
												<Tooltip title="输入框左侧下拉的数据序号(正整数，布局用，越小越前)">
													<span >输入框左侧下拉的数据序号:</span>
												</Tooltip>
											</div>
											<div className="pre-report-input-input-div">
												<Input style={{width:170,marginRight:10}}
													   value={this.state.leftIndex}
													   onChange={(e)=>this.handleInputNumberChange(e,'LEFT_INDEX')}/>
											</div>
										</Col>
									</Row>
								</FormItem>
							):null
						}
					</Form>
				</div>
			</div>
		)
	}
}
export default Form.create()(PreReportInputAddModal)