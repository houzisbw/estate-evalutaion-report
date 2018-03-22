/**
 * Created by Administrator on 2018/2/27.
 */
import React from 'react'
import './index.scss'
import {NavLink,withRouter} from 'react-router-dom'
class SubHeader extends React.Component{
	constructor(props){
		super(props)
	}
	render(){
		//获取当前的路由path,withRouter来获取
		let currentPath = this.props.match.path;
		//功能列表的数据
		let liData = [
			{
				pathTo:currentPath+'/pre_assesment/report',
				iconName:'fa fa-file fa-fw',
				title:'预评估报告'
			},
			{
				pathTo:currentPath+'/normal_assesment_report',
				iconName:'fa fa-file-text-o fa-fw',
				title:'评估报告正报'
			},
			{
				pathTo:currentPath+'/other1',
				iconName:'fa fa-paperclip fa-fw',
				title:'其他功能'
			},
			{
				pathTo:currentPath+'/word_template_management',
				iconName:'fa fa-floppy-o fa-fw',
				title:'Word模板管理'
			},
		]
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
export default withRouter(SubHeader)