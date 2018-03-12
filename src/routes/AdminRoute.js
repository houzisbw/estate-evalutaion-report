/**
 * Created by Administrator on 2018/3/12.
 */
//该路由只能管理员进入,普通用户不行
import React from 'react'
import {connect} from 'react-redux'
import { Route, Redirect } from 'react-router-dom'
//userAuth:0表示管理员
class AdminRoute extends React.Component {
	render() {
		const { component: Component, userAuth,...rest } = this.props;
		return (
			<Route {...rest} render={props => {
				return userAuth===0 ? <Component {...props} /> : <Redirect to="/app/pre_assesment_report" />
			}} />
		)
	}
}

//state和props的映射关系,下面2个props可以在AuthorizedRoute取得，是connect方法加上去的
//尤其注意：这里state是总体的状态，在combinedReducer里面获取相应的状态(loggedUserState)，再获取其内的子状态(pending,logged)
const mapStateToProps = (state)=>{
	return {
		userAuth:state.updateUserAuthState.userAuth,
	}
}

export default  connect(mapStateToProps)(AdminRoute);