//专门处理预评估报告路由的子路由，对于子路由必须模块化处理，不能单独写一条路由
import React, { Component } from 'react';
//引入路由
import AdminRoute from './../../routes/AdminRoute'
//修改模板(预评估)
import ModifyTemplate from './../ModifyTemplate/ModifyTemplate'
import PreAssesment from './../PreAssesment/PreAssesment'
import AddPreReportTemplate from './../AddPreReportTemplate/AddPreReportTemplate'
import {Route,Switch,Redirect} from 'react-router-dom'
//分路由组件,目的是简化外层的路由,这里不需要加外层的<Router>,因为最外面已经加了
class PreAssesmentRouter extends Component {
	render() {
		return (
			<Switch>
				<AdminRoute exact path="/app/pre_assesment/add" component={AddPreReportTemplate}/>
				<Route  path="/app/pre_assesment/report" component={PreAssesment}/>
				<Route  path="/app/pre_assesment/modify" component={ModifyTemplate}/>
				<Redirect exact  from="/app/pre_assesment" to="/app/pre_assesment/report"/>
			</Switch>
		);
	}
}

export default PreAssesmentRouter;
