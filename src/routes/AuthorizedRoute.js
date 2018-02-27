/**
 * Created by Administrator on 2018/2/25.
 */
import React from 'react'
import {checkAuthentication} from './../util/utils'
import {connect} from 'react-redux'
import { Route, Redirect } from 'react-router-dom'
//需要登录认证的路由,凡是进入以app开头的路径都需要进行身份认证，失败则跳回登录界面
class AuthorizedRoute extends React.Component {
	componentWillMount() {
		//进行身份验证检查
		checkAuthentication();
	}

	render() {
		const { component: Component, logged,pending,...rest } = this.props;
		//pending是加载中状态,此时logged还是false
		//console.log('pending:'+pending,'logged:'+logged)
		return (
			<Route {...rest} render={props => {
				if(pending) return null;
				return logged ? <Component {...props} /> : <Redirect to="/login" />
			}} />
		)
	}
}

//state和props的映射关系,下面2个props可以在AuthorizedRoute取得，是connect方法加上去的
//尤其注意：这里state是总体的状态，在combinedReducer里面获取相应的状态(loggedUserState)，再获取其内的子状态(pending,logged)
const mapStateToProps = (state)=>{
	return {
		pending:state.loggedUserState.pending,
		logged:state.loggedUserState.logged
	}
}

export default  connect(mapStateToProps)(AuthorizedRoute);