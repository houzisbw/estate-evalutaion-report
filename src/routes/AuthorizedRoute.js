/**
 * Created by Administrator on 2018/2/25.
 */
import React from 'react'
import { Route, Redirect } from 'react-router-dom'
//需要登录认证的路由,凡是进入以app开头的路径都需要进行身份认证，失败则跳回登录界面
class AuthorizedRoute extends React.Component {
	componentWillMount() {

	}

	render() {
		const { component: Component, ...rest } = this.props;

		return (
			<Route {...rest} render={props => {
				return <Component {...props} />
			}} />
		)
	}
}

export default  AuthorizedRoute;