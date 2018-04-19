/**
 * Created by Administrator on 2018/4/19.
 */
//看房派单的总路由
import React, { Component } from 'react';
//引入路由
import AdminRoute from './../../routes/AdminRoute'
import HouseReviewArrange from './../HouseReviewArrange/HouseReviewArrange'
import {Switch,Redirect} from 'react-router-dom'
//分路由组件,目的是简化外层的路由,这里不需要加外层的<Router>,因为最外面已经加了
class HouseReviewArrangeRouter extends Component {
	render() {
		return (
			<Switch>
				<AdminRoute exact path="/app/arrange_house_review" component={HouseReviewArrange}/>
				<Redirect exact  from="/app/arrange_house_review" to="/app/pre_assesment/report"/>
			</Switch>
		);
	}
}

export default HouseReviewArrangeRouter;
