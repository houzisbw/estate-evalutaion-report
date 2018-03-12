/**
 * Created by Administrator on 2018/2/25.
 */
//总体布局页面
import React from 'react'
//import axios from 'axios'
//import store from './../../store/store'
import {connect} from 'react-redux'
import LayoutComponent from './../../components/Layout/layout'
import {checkAuthentication} from './../../util/utils'
import {Switch, Route, Redirect} from 'react-router-dom'
import PreAssesment from './../PreAssesment/PreAssesment'
import NormalAssesment from './../NormalAssesment/NormalAssesment'
import AdminRoute from './../../routes/AdminRoute'
//修改模板(预评估)
import ModifyTemplate from './../ModifyTemplate/ModifyTemplate'
//添加预评估报告模板
import AddPreReportTemplate from './../AddPreReportTemplate/AddPreReportTemplate'
//actions
//import {userLogout} from './../../store/actions/users'
class Layout extends React.Component{
	componentWillMount(){
		checkAuthentication();
	}
	componentDidMount(){
		//this.props.history.push('/pre_assesment_report')
	}
	render(){
		//不要通过store.getState获取状态，因为数据更新后收到不通知
		return (
			//LayoutComponent包含2个header
			<LayoutComponent>
				<Switch>
					{/*预评估页面*/}
					<Route path="/app/pre_assesment_report"  component={PreAssesment}/>
					<Route path="/app/normal_assesment_report" component={NormalAssesment}/>
					{/*模板修改页面*/}
					<Route path="/app/pre_assesment_modify" component={ModifyTemplate}/>
					{/*添加预评估报告模板,只有管理员可进入该路由*/}
					<AdminRoute path="/app/pre_assesment_add" component={AddPreReportTemplate}/>
					{/*进入页面直接选中预评估子页面,/app被重定向到/app/pre_assesment_report*/}
					{/*redirect的from参数是当前所在的路径(需要跳转)*/}
					<Redirect from="/app" to="/app/pre_assesment_report"/>
				</Switch>
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