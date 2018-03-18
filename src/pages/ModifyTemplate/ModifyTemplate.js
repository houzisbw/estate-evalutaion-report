/**
 * Created by Administrator on 2018/3/12.
 */
/**
 * Created by Administrator on 2018/2/27.
 */
//模板修改页面
import React from 'react'
import './index.scss'
import axios from 'axios'
//import {Select} from 'antd'
//import {connect} from 'react-redux'
//const Option = Select.Option;
class ModifyTemplate extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			bankInputData:[],
			templateName:''
		}
	}

	componentDidMount(){
		//获取路由传递来的参数,如果直接访问页面则返回,相当于权限设置
		if(!this.props.location.state){
			this.props.history.push('/app/pre_assesment_report');
			return;
		}
		let routerParams = this.props.location.state;
		//取得预评估报告模板名字
		let templateName = routerParams.templateName;
		this.setState({
			templateName:templateName
		})
		//从数据库获取对应报告的数据显示在页面上
		this.fetchPreReportTemplateData(templateName);
	}
	//获取预评估模板数据
	fetchPreReportTemplateData(templateName){
		axios.post('/estate/getBankInputsData',{bank:templateName}).then((resp)=>{
			this.setState({
				bankInputData:resp.data.inputData
			})
		})
	}

	render(){
		let title = this.state.templateName+'预评估模板修改'
		//这只是用作显示，value是从0开始的整数，用作切换tabs
		return (
			<div>
				{/*这里复用的其他文件的css*/}
				<div className="my-page-wrapper">
					<div className="page-title">
						<div className="template-desc">
							<span>预评估模板修改</span><i className="fa fa-pencil modify-icon"></i>
						</div>
					</div>
					{/*内容区域*/}
					<div className="template-content">
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

export default  ModifyTemplate