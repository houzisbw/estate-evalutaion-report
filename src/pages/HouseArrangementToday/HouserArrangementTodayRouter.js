//专门处理正式报告路由的子路由，对于子路由必须模块化处理，不能单独写一条路由
import React, { Component } from 'react';
//引入路由
import AdminRoute from './../../routes/AdminRoute'
import {Route,Switch,Redirect} from 'react-router-dom'
import HouseArrangementToday from './HouseArrangementToday'
//分路由组件,目的是简化外层的路由,这里不需要加外层的<Router>,因为最外面已经加了
class HouserArrangementTodayRouter extends Component {
	render() {
		return (
				<Switch>
					<AdminRoute exact path="/app/house_arrangement_today/show" component={HouseArrangementToday}/>
					<Redirect exact from="/app/normal_assesment" to="/app/pre_assesment/report"/>
				</Switch>
		);
	}
}

export default HouserArrangementTodayRouter;
