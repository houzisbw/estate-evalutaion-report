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
import axios from 'axios'
import {Select,Modal} from 'antd'
const Option = Select.Option;
class PreAssesment extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			//当前选中模板index
			currentTemplateIndex:0,
			//银行信息
			bankInfo:['包商']
		}
	}
	//下拉框值改变触发,切换模板
	handleSelectChange(v){
		this.setState({
			currentTemplateIndex:v
		})
	}
	componentDidMount(){
		//获取银行信息
		axios.get('/estate/bankInfo').then((resp)=>{
			if(resp.data.status === 1){
				this.setState({
					bankInfo:resp.data.bankInfo
				})
			}else{
				Modal.warning({
					title:'客官请注意',
					content:'未查找到相关银行信息~'
				})
			}

		})
	}
	render(){
		//这只是用作显示，value是从0开始的整数，用作切换tabs
		return (
			<div>
				<div className="my-page-wrapper">
					<div className="page-title">
						<div className="template-desc">
							<span>选择报告模板</span>
						</div>
						<div className="select-wrapper">
							{
								//此处尤其注意，defaultValue只有在首次设置后生效，后面再修改没用的
								//所以做法是ajax请求完成后再渲染select组件，否则不渲染
								this.state.bankInfo.length>0?(
									<Select defaultValue={this.state.bankInfo[0]} style={{ width: 150 }} onChange={(v)=>{this.handleSelectChange(v)}}>
									{
										this.state.bankInfo.map((value,index)=>{
											return (
												<Option value={index} key={index}>{value}</Option>
											)
										})
									}
								</Select>
								):null
							}

						</div>
					</div>
					{/*模板内容区域,遍历bankInfo生成各个模板*/}
					<div className="template-content">
						<TabComponent currentIndex={this.state.currentTemplateIndex}>
							{
								this.state.bankInfo.map((value,index)=>{
									return (
										<ReportTemplate templateName={value} key={index}/>
									)
								})
							}
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