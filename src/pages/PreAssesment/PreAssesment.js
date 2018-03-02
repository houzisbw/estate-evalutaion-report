/**
 * Created by Administrator on 2018/2/27.
 */
//预评估报告页面
import React from 'react'
import './index.scss'
//引入tab组件
import TabComponent from './../../components/Tab/tab'
//引入预评估报告模板
import ReportTemplate from './../../components/ReportTemplates/reportTemplate'

import {Select} from 'antd'
const Option = Select.Option;
class PreAssesment extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			//当前选中模板index
			currentTemplateIndex:0
		}
	}
	//下拉框值改变触发,切换模板
	handleSelectChange(v){
		this.setState({
			currentTemplateIndex:v
		})
	}
	render(){
		//这只是用作显示，value是从0开始的整数，用作切换tabs
		let templatesDataList = [
			'包商','农行','农行划拨'
		];
		return (
			<div>
				<div className="my-page-wrapper">
					<div className="page-title">
						<div className="template-desc">
							<span>选择报告模板</span>
						</div>
						<div className="select-wrapper">
							<Select defaultValue="包商" style={{ width: 150 }} onChange={(v)=>{this.handleSelectChange(v)}}>
								{
									templatesDataList.map((value,index)=>{
										return (
											<Option value={index} key={index}>{value}</Option>
										)
									})
								}
							</Select>
						</div>
					</div>
					{/*模板内容区域*/}
					<div className="template-content">
						<TabComponent currentIndex={this.state.currentTemplateIndex}>
							<ReportTemplate templateName="包商"/>
							<ReportTemplate templateName="农行"/>
							<ReportTemplate templateName="农行划拨"/>
						</TabComponent>
					</div>
				</div>
				{/*补丁区域*/}
				<div className="bottom-padding">
				</div>
			</div>
		)
	}
}
export default  PreAssesment