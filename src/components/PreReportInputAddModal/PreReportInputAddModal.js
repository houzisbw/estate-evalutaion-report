/**
 * Created by Administrator on 2018/3/16.
 */
//预评估报告添加时模态框输入组件
import React from 'react'
import {Form,Row,Col,Input} from 'antd'
import './index.scss'
const FormItem = Form.Item
class PreReportInputAddModal extends React.Component{
	constructor(props){
		super(props);
	}
	render(){
		const { getFieldDecorator } = this.props.form;
		return (
			<div>
				<Form layout="horizontal">
					<FormItem label="数据名称"
							  labelCol={{span:3}}
					>
						<Row>
							<Col span={6}>
								{getFieldDecorator('itemName', {
									rules: [{message: 'Please input the captcha you got!' }],
								})(
									<Input />
								)}
							</Col>
						</Row>
					</FormItem>
				</Form>
			</div>
		)
	}
}
export default Form.create()(PreReportInputAddModal)