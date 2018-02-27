/**
 * Created by Administrator on 2018/2/25.
 */
import React from 'react'
import './index.scss'
import {connect} from 'react-redux'
import store from './../../store/store'
import axios from 'axios'
//登录组件
import WrappedLoginForm from './../../components/LoginBox/LoginBox'
//登录界面
class Login extends React.Component{
	constructor(props){
		super(props)
	}
	//重要：如果登录状态下再次访问登录页面，则直接跳转到其他界面
	componentWillMount(){
		axios.get('/users/checkAuth').then((resp)=>{
			let status = resp.data.status;
			if(status === 1){
				this.props.history.push('/app');
			}
		})
	}
	render(){
		return (
			<div className="bg-img">
				<div className="bg-cover">
					<p className="system-title">欢迎使用 <span className="system-title-blue">房地产评估报告生成系统</span></p>
					<div className="login-wrapper">
						<div className="login-title">
							用户登录
						</div>
						<div className="login-box">
							<WrappedLoginForm/>
						</div>
					</div>
				</div>
			</div>
		)
	}
}
const mapStateToProps = (state)=>{
	return{
		isLogin:state.loggedUserState.logged
	}
}
export default  connect(mapStateToProps)(Login)