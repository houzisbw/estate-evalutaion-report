/**
 * Created by Administrator on 2018/2/26.
 */
import React from 'react'
import './index.scss'
import {connect} from 'react-redux'
import {Modal} from 'antd'
import axios from 'axios'
import store from './../../store/store'
import {withRouter} from 'react-router-dom'
import {userLogout} from './../../store/actions/users'
const confirm = Modal.confirm;
//顶部导航条
class Header extends React.Component{
	//登出
	logout(){
		axios.get('/users/logout').then((resp)=>{
			store.dispatch(userLogout());
			this.props.history.push('/login');
		})
	}
	handleLogout(){
		let self  = this;
		confirm({
			title: '确定退出登录?',
			okText:'确定',
			cancelText:'取消',
			onOk() {
				self.logout();
			},
			onCancel() {

			},
		});
	}
	render(){
		//必须要require
		let headerLogoSrc = require('./../../assets/img/icon/house.png');
		let headerTitleSrc = require('./../../assets/img/icon/header-title.png');
		let userInfo = this.props.auth === 0 ? '管理员':'普通用户';
		return (
			<div className="header-bar">
				<div className="header-wrapper">
					<img src={headerLogoSrc} className="header-logo"/>
					<img src={headerTitleSrc} className="header-title"/>
					<div className="header-info">
						<span className="user-info">您好, {userInfo}</span>
						<span className="header-logout" onClick={()=>{this.handleLogout()}}>退出</span>
					</div>
				</div>
			</div>
		)
	}
}

const mapStateToProps = (state)=>{
	return{
		auth:state.updateUserAuthState.userAuth
	}
}
export default  withRouter(connect(mapStateToProps)(Header));