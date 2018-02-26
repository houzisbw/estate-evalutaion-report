/**
 * Created by Administrator on 2018/2/25.
 */
//总体布局页面
import React from 'react'
import axios from 'axios'
import store from './../../store/store'
import {connect} from 'react-redux'
import LayoutComponent from './../../components/Layout/layout'
import {checkAuthentication} from './../../util/utils'
//actions
import {userLogout} from './../../store/actions/users'
class Layout extends React.Component{
	componentWillMount(){
		checkAuthentication();
	}
	render(){
		//不要通过store.getState获取状态，因为数据更新后收到不通知
		return (
			<LayoutComponent>

			</LayoutComponent>
		)
	}
}

const mapStateToProps = (state)=>{
	return {
		auth:state.updateUserAuthState.userAuth
	}
};
export default  connect(mapStateToProps)(Layout);