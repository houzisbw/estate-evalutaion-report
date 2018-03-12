/**
 * Created by Administrator on 2018/3/12.
 */
//模板修改页面
import React from 'react'
import './index.scss'
import axios from 'axios'
import {Select,Modal,Tooltip} from 'antd'
//import {connect} from 'react-redux'
const Option = Select.Option;
class AddPreReportTemplate extends React.Component{
	constructor(props){
		super(props);
		this.state = {}
	}

	componentDidMount(){
	}

	render(){
		let title = '添加预评估模板'
		//这只是用作显示，value是从0开始的整数，用作切换tabs
		return (
			<div>
				{/*这里复用的其他文件的css*/}
				<div className="my-page-wrapper">
					<div className="page-title">
						<div className="template-desc">
							<span>添加预评估模板</span><i className="fa fa-plus modify-icon"></i>
						</div>
					</div>
					{/*内容区域*/}
					<div className="template-content">
						{/*template-content-wrapper的作用是解决overflow:hidden与margin:0 auto之间的冲突:chrome下不会居中*/}
						<div className="template-content-wrapper">
							<div className="template-title">
								{title}
							</div>
						</div>
					</div>
				</div>

				{/*补丁区域*/}
				<div className="bottom-padding">
				</div>
			</div>
		)
	}
}

export default  AddPreReportTemplate