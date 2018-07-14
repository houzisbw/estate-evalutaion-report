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
//正报
import NormalAssesment from './../NormalAssesment/NormalAssesment'
import WordTemplateManagement from './../WordTemplateManagement/WordTemplateManagement'
//看房的总路由
import HouseReviewArrangeRouter from './../HouseReviewArrange/HouseReviewArrangeRouter'
//处理预评估的总路由
import PreAssesmentRouter from './../PreAssesment/PreAssesmentRouter'
//正报的总路由
import NormalAssesmentRouter from './../NormalAssesment/NormalAssesmentRouter'
//处理业务登记路由
import BusinessRegistering from './../BusinessRegistering/BusinessRegistering'
//当天看房情况路由
import HouseArrangementRouter from './../HouseArrangementToday/HouserArrangementTodayRouter'
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
					{/*预评估页面总路由*/}
					<Route path="/app/pre_assesment"  component={PreAssesmentRouter}/>
					{/*word模板管理路由*/}
					<Route path="/app/word_template_management" component={WordTemplateManagement}/>
					{/*业务登记页面路由*/}
					<Route path="/app/business_registering" component={BusinessRegistering}/>
					{/*看房派单分配*/}
					<Route path="/app/arrange_house_review" component={HouseReviewArrangeRouter}/>
					{/*当天看房情况*/}
					<Route path="/app/house_arrangement_today" component={HouseArrangementRouter}/>
					{/*正式报告页面总路由*/}
					<Route path="/app/normal_assesment" component={NormalAssesmentRouter}/>
					<Redirect from="/app" to="/app/pre_assesment"/>
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