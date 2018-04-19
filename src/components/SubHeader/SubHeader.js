/**
 * Created by Administrator on 2018/2/27.
 */
import React from 'react'
import './index.scss'
import {NavLink,withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
class SubHeader extends React.Component{
	constructor(props){
		super(props)
	}
	render(){
		//获取当前的路由path,withRouter来获取
		let currentPath = this.props.match.path;
		//功能列表的数据,此处是所有用户都有的,通过权限auth字段来区分,0管理员
		let liData = [
			{
				pathTo:currentPath+'/pre_assesment/report',
				iconName:'fa fa-file fa-fw',
				title:'预评估报告',
				auth:[0,1]
			},
			{
				pathTo:currentPath+'/normal_assesment_report',
				iconName:'fa fa-file-text-o fa-fw',
				title:'评估报告正报',
				auth:[0,1]
			},
			{
				pathTo:currentPath+'/business_registering',
				iconName:'fa fa-paperclip fa-fw',
				title:'业务登记',
				auth:[0]
			},
			{
				pathTo:currentPath+'/word_template_management',
				iconName:'fa fa-cog fa-fw',
				title:'Word模板管理',
				auth:[0]
			},
			{
				pathTo:currentPath+'/arrange_house_review',
				iconName:'fa fa-map fa-fw',
				title:'看房派单分配',
				auth:[0]
			},
		];
		//获取用户身份
		let userAuth = this.props.userAuth;
		//过滤出只有自己权限的li
		liData = liData.filter((item)=>{
			return item.auth.indexOf(userAuth)>-1
		});

		return (
			<div className="sub-header">
				<div className="sub-header-wrapper">
					<ul className="sub-header-ul">
						<li className="sub-header-li">
							{
								liData.map((value,index)=>{
									return (
										<NavLink exact key={index} className="navlink" activeClassName="active-menu" to={value.pathTo}>
											<i className={value.iconName}></i>
											<span className="word-span">{value.title}</span>
										</NavLink>
									)
								})
							}
						</li>
					</ul>
				</div>
			</div>
		)
	}
}

const mapStateToProps = (state)=>{
	return {
		userAuth:state.updateUserAuthState.userAuth,
	}
};

export default withRouter(connect(mapStateToProps)(SubHeader))