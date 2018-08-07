//excel看房数据新增页面的modal内容
import React from 'react'
import {Form,Row,Col,Input,Select,Modal} from 'antd'
import './index.scss'
import axios from 'axios'
const FormItem = Form.Item;
const Option = Select.Option;
class HouseExcelDataAddModal extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			staffData:[],
			validateRules:{
				//校验派单序号
				validateIndex:(rule,value,callback)=>{
					var regExp = /^\d+$/g;
					if(regExp.test(value)){
						callback()
					}else{
						callback('请输入整数类型的序号!')
					}
				},
				validateTelephone:(rule,value,callback)=>{
					var regExp = /^(\s|\d)+$/g;
					if(regExp.test(value)){
						callback()
					}else{
						callback('请输入正确的手机号码!')
					}
				}
			}
		}
	}
	//获取看房人员
	getStaffList(){
		axios.get('/staff_arrange/getStaff').then((resp)=>{
			if(resp.data.status===-1){
				Modal.error({
					title: '糟糕！',
					content: '人员数据读取出错，请重试~',
				});
			}else{
				let staffData = resp.data.staffList.map((item)=>item[Object.keys(item)[0]]);
				this.setState({
					staffData:staffData
				})
			}
		})
	}
	//提交表单
	validateInputsAndSendToParent(){
		let ret = {};
		this.props.form.validateFieldsAndScroll((err, values) => {
			if (!err) {
				//校验全部通过
				ret = {
					status:1,
					values:values
				}
			}else{
				ret = {status:-1}
			}
		});
		return ret;
	}
	componentDidMount(){
		this.getStaffList();
	}

	render(){
		const { getFieldDecorator } = this.props.form;
		return (
				<div>
					<div className="excel-add-input-type-choose-area">
						<Form layout="horizontal">
							<FormItem>
								<Row>
									<Col span={24}>
										<div className="excel-add-label">
											<span>派单序号:</span>
										</div>
										<div className="excel-add-input">
											{getFieldDecorator('index', {
												rules: [{
													required: true,validator: this.state.validateRules.validateIndex,
												}],
											})(
													<Input style={{width:170}}/>
											)}
										</div>
									</Col>
								</Row>
							</FormItem>
							<FormItem>
								<Row>
									<Col span={24}>
										<div className="excel-add-label">
											<span>房屋街道号:</span>
										</div>
										<div className="excel-add-input">
											{getFieldDecorator('roadNumber', {
												initialValue:'',
												rules: [{message: '请输入房屋街道号!',required:true}],
											})(
													<Input style={{width:170}}/>
											)}
										</div>
									</Col>
								</Row>
							</FormItem>
							<FormItem>
								<Row>
									<Col span={24}>
										<div className="excel-add-label">
											<span>房屋具体地址:</span>
										</div>
										<div className="excel-add-input">
											{getFieldDecorator('detailPosition', {
												initialValue:'',
												rules: [{message: '请输入房屋具体地址!',required:true}],
											})(
													<Input style={{width:170}}/>
											)}
										</div>
									</Col>
								</Row>
							</FormItem>
							<FormItem>
								<Row>
									<Col span={24}>
										<div className="excel-add-label">
											<span>房屋面积:</span>
										</div>
										<div className="excel-add-input">
											{getFieldDecorator('area', {
												initialValue:'',
												rules: [{message: '请输入房屋面积!',required:true}],
											})(
													<Input style={{width:170}}/>
											)}
										</div>
									</Col>
								</Row>
							</FormItem>
							<FormItem>
								<Row>
									<Col span={24}>
										<div className="excel-add-label">
											<span>担保公司:</span>
										</div>
										<div className="excel-add-input">
											{getFieldDecorator('company', {
												initialValue:'',
												rules: [{message: '请输入担保公司!',required:true}],
											})(
													<Input style={{width:170}}/>
											)}
										</div>
									</Col>
								</Row>
							</FormItem>
							<FormItem>
								<Row>
									<Col span={24}>
										<div className="excel-add-label">
											<span>银行:</span>
										</div>
										<div className="excel-add-input">
											{getFieldDecorator('bank', {
												initialValue:'',
												rules: [{message: '请输入银行!',required:true}],
											})(
													<Input style={{width:170}}/>
											)}
										</div>
									</Col>
								</Row>
							</FormItem>
							<FormItem>
								<Row>
									<Col span={24}>
										<div className="excel-add-label">
											<span>电话号码:</span>
										</div>
										<div className="excel-add-input">
											{getFieldDecorator('telephone', {
												initialValue:'',
												rules: [{validator: this.state.validateRules.validateTelephone,required:true}],
											})(
													<Input style={{width:170}}/>
											)}
										</div>
									</Col>
								</Row>
							</FormItem>
							<FormItem>
								<Row>
									<Col span={24}>
										<div className="excel-add-label">
											<span>看房人员:</span>
										</div>
										<div className="excel-add-input">
											{getFieldDecorator('staffName', {
												initialValue:'',
												rules: [{message: '请选择看房人员!',required:true}],
											})(
													<Select style={{width:170}}>
														{
															this.state.staffData.map((item,index)=>{
																return (
																		<Option value={item} key={index}>{item}</Option>
																)
															})
														}
													</Select>
											)}
										</div>
									</Col>
								</Row>
							</FormItem>
						</Form>
					</div>
				</div>
		)
	}
}
export default Form.create()(HouseExcelDataAddModal)