/**
 * Created by Administrator on 2018/2/25.
 */
import React from 'react'
import './index.scss'
//登录组件
import WrappedLoginForm from './../../components/LoginBox/LoginBox'
//登录界面
class Login extends React.Component{
	constructor(props){
		super(props)
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
export default  Login