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
import NormalAssesment from './../NormalAssesment/NormalAssesment'
//处理预评估的总路由
import PreAssesmentRouter from './../PreAssesment/PreAssesmentRouter'
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
					<Route path="/app/normal_assesment_report" component={NormalAssesment}/>
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