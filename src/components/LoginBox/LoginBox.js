/**
 * Created by Administrator on 2018/2/25.
 */
import React from 'react'
import axios from 'axios'
import {Form,Icon,Input,Button,Checkbox,message} from 'antd'
import {withRouter} from 'react-router-dom'
import './index.scss'
import store from './../../store/store'
import {updateUserAuth} from './../../store/actions/users'
const FormItem = Form.Item;
//配置消息框距离顶部距离(px)
message.config({
	top: 20,
	duration:3
});
class NormalLoginForm extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			isSubmitButtonDisabled:false,
			submitButtonText:<pre>登   录</pre>
		}
	}
	handleSubmit = (e) => {
		message.config({
			top: 20,
			duration:3
		});
		//阻止默认提交
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			//这里进入的条件是都2个表单都填写了值
			if (!err) {
				//console.log('Received values of form: ', values);
				//禁用按钮,登录中状态
				this.setState({
					isSubmitButtonDisabled:true,
					submitButtonText:'登录中...'
				});
				//登录请求,userName是下面getFieldDecorator对应的id值
				let param = {
					username:values.userName,
					password:values.password,
					remember:values.remember ? '1': '0'
				};
				axios.post('/users/login',param).then((resp)=>{
					let status = resp.data.status;
					let userAuth = resp.data.auth;
					//登录成功
					if(status === 1){
						//将用户权限存在state中
						store.dispatch(updateUserAuth(userAuth));
						//首先提示登录成功,1秒后执行回调函数进行页面跳转
						message.success('登录成功!',1,()=>{
							//页面跳转
							this.props.history.push('/app');
						});
					}else if(status === -1){
						//查询错误
						message.error('遇到未知错误,请重试!');
						this.setState({
							isSubmitButtonDisabled:false,
							submitButtonText:<pre>登   录</pre>
						});
					}else{
						//用户名或密码错误
						message.error('用户名或密码错误!');
						this.setState({
							isSubmitButtonDisabled:false,
							submitButtonText:<pre>登   录</pre>
						});
					}
				})
			}
		});
	}
	render() {
		const { getFieldDecorator } = this.props.form;
		let isDisabled = this.state.isSubmitButtonDisabled,
			buttonText = this.state.submitButtonText;
		return (
			<Form onSubmit={this.handleSubmit} className="login-form">
				<FormItem>
					{getFieldDecorator('userName', {
						rules: [{ required: true, message: '请输入用户名!' }],
						initialValue: '',
					})(
						<Input autoComplete="new-password" prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="用户名" />
					)}
				</FormItem>
				<FormItem>
					{getFieldDecorator('password', {
						rules: [{ required: true, message: '请输入密码!' }],
						initialValue: '',
					})(
						<Input autoComplete="new-password" prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="密码" />
					)}
				</FormItem>
				<FormItem>
					{getFieldDecorator('remember', {
						valuePropName: 'checked',
						initialValue: true,
					})(
						<Checkbox className="remember-color">记住我</Checkbox>
					)}
					<Button type="primary" htmlType="submit" className="login-form-button" disabled={isDisabled}>
						{buttonText}
					</Button>
				</FormItem>
			</Form>
		);
	}
}

const WrappedNormalLoginForm = Form.create()(NormalLoginForm);
//withRouter使得该组件获得history,match,location属性,否则无法使用history.push进行页面跳转
export default withRouter(WrappedNormalLoginForm);