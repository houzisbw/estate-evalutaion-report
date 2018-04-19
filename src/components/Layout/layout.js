/**
 * Created by Administrator on 2018/2/26.
 */
import React from 'react'
import './index.scss'
import Header from './../Header/header'
import SubHeader from './../SubHeader/SubHeader'
import BackToTop from './../BackToTop/BackToTop'
import {withRouter} from 'react-router-dom'
class LayoutComponent extends React.Component{
	render(){
		//不显示backtop的路由
		let backToTopInvisibleRouters = ['/app/arrange_house_review'];
		//当前路由
		let currentPath = this.props.location.pathname;
		let isBackTopVisible = backToTopInvisibleRouters.indexOf(currentPath) === -1;
		return (
			<div className="layout-component-div">
				{/*顶部导航条*/}
				<Header />
				{/*功能选择区域SubHeader*/}
				<SubHeader />
				{/*内容区域*/}
				{this.props.children}
				{/*返回顶部按钮*/}
				{
					isBackTopVisible?<BackToTop />:null
				}
			</div>
		)
	}
}
export default  withRouter(LayoutComponent)