/**
 * Created by Administrator on 2018/2/27.
 */
//预评估报告页面
import React from 'react'
import './index.scss'
import {withRouter} from 'react-router-dom'
//引入tab组件
import TabComponent from './../../components/Tab/tab'
//引入预评估报告模板
import ReportTemplate from './../../components/ReportTemplates/reportTemplate'
import axios from 'axios'
import {Select,Modal,Tooltip} from 'antd'
import {connect} from 'react-redux'
const Option = Select.Option;
class PreAssesment extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			//是否显示序号
			showIndex:false,
			//当前选中模板index
			currentTemplateIndex:0,
			//银行信息
			bankInfo:[]
		}
	}
	//下拉框值改变触发,切换模板
	handleSelectChange(v){
		this.setState({
			currentTemplateIndex:v
		})
	}
	//修改模板
	handleModifyTemplate(){
		//获取当前模板名字
		let templateName = this.state.bankInfo[this.state.currentTemplateIndex];
		//跳转到模板修改界面,路径是绝对路径,不是基于当前路径再加
		//目标页面通过location.state获取参数
		this.props.history.push({pathname:'/app/pre_assesment/modify',state:{
			templateName:templateName
		}})
	}
	//添加预评估模板
	handleAddTemplate(){
		this.props.history.push({pathname:'/app/pre_assesment/add'})
	}
	//删除模板
	handleRemoveTemplate(){
		let self = this;
		Modal.confirm({
			title: '删除',
			content: '确认删除该预评估报告模板(该操作不可逆)?',
			okText: '确认',
			cancelText: '取消',
			onOk(){
				let param = {
					templateNameToDelete:self.state.bankInfo[self.state.currentTemplateIndex]
				};
				axios.post('/estate/deletePreReportTemplate',param).then((resp)=>{
					if(resp.data.status === 1){
						self.props.history.push('/app/pre_assesment');
					}else{
						Modal.warning({
							title:'很不巧',
							content:'删除操作出现未知错误，请重试~'
						})
					}
				})
			}
		})
	}
	//显示/隐藏输入框的序号
	showIndex(){
		this.setState({
			showIndex:!this.state.showIndex
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
						{/*修改模板按钮区域，管理员可见*/}
						<div className="template-modify-wrapper">
							{
								this.props.userAuth===0?(
									<Tooltip title="显示数据序号,同word模板对应">
										<button className="template-modify-button fa fa-tags" onClick={()=>{this.showIndex()}}></button>
									</Tooltip>
								) :null
							}
							{
								//判断权限，管理员(0)才能修改,userAuth是redux中传来的state
								this.props.userAuth===0?(
									<Tooltip title="预评估模板修改">
										<button className="template-modify-button fa fa-pencil" onClick={()=>{this.handleModifyTemplate()}}></button>
									</Tooltip>
								) :null
							}
							{
								//判断权限，管理员(0)才能修改,userAuth是redux中传来的state
								this.props.userAuth===0?(
									<Tooltip title="添加预评估模板">
										<button className="template-modify-button fa fa-plus fa-plus-padding" onClick={()=>{this.handleAddTemplate()}}></button>
									</Tooltip>
								) :null
							}
							{
								//删除该模板
								this.props.userAuth===0?(
									<Tooltip title="删除该预评估模板">
										<button className="template-modify-button fa fa-bitbucket fa-plus-padding" onClick={()=>{this.handleRemoveTemplate()}}></button>
									</Tooltip>
								) :null
							}
						</div>
					</div>
					{/*模板内容区域,遍历bankInfo生成各个模板*/}
					<div className="template-content">
						<TabComponent currentIndex={this.state.currentTemplateIndex}>
							{
								this.state.bankInfo.map((value,index)=>{
									return (
										<ReportTemplate
											templateName={value}
											key={index}
											showIndex={this.state.showIndex}
										/>
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

//设置权限字段userAuth,作为PreAssesment的props传入,需要权限的地方用该字段判断即可,注意不能用store.getState,因为state不会变化
const mapStateToProps = (state)=>{
	return {
		userAuth:state.updateUserAuthState.userAuth,
	}
}
export default  withRouter(connect(mapStateToProps)(PreAssesment))