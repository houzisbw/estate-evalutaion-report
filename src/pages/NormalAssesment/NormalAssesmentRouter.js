//专门处理正式报告路由的子路由，对于子路由必须模块化处理，不能单独写一条路由
import React, { Component } from 'react';
//引入路由
import AdminRoute from './../../routes/AdminRoute'
import {Route,Switch,Redirect} from 'react-router-dom'
import NormalAssesment from './../NormalAssesment/NormalAssesment'
//分路由组件,目的是简化外层的路由,这里不需要加外层的<Router>,因为最外面已经加了
class NormalAssesmentRouter extends Component {
	render() {
		return (
			<Switch>
				{/*<AdminRoute exact path="/app/normal_assesment/add" component={AddPreReportTemplate}/>*/}
				<Route  path="/app/normal_assesment/report" component={NormalAssesment}/>
				<Redirect exact from="/app/normal_assesment" to="/app/pre_assesment/report"/>
			</Switch>
		);
	}
}

export default NormalAssesmentRouter;
