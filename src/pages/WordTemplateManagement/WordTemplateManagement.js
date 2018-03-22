//Word模板模板管理页面
import React from 'react'
import './index.scss'
import axios from 'axios'
import {Modal,Tabs,Divider,Upload} from 'antd'
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import WordTemplateManagementTable from './../../components/WordTemplateManageTable/WordTemplateManageTable'
const TabPane = Tabs.TabPane;
class WordTemplateManagement extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			//预评估报告模板数组
			preTemplates:[],
			//表格是否加载中
			isTableLoading:false,
			//文件是否上传中
			isFileUploading:false,
			//upload组件参数
			fileList:[]
		}
	}

	componentDidMount(){
		//非管理员
		if(this.props.userAuth === 1){
			let self = this;
			Modal.warning({
				title:'权限不足!',
				content:'非管理员没有权限访问该页面~',
				onOk(){
					self.props.history.push('/app/pre_assesment/report')
				}
			})
		}else{
			this.readDocxFromServer('PRE');
		}
	}
	//读取服务器上的评估文件
	readDocxFromServer(type){
		//发送ajax请求到后台获取预评估模板的路径名
		this.setState({
			isTableLoading:true
		});
		axios.post('/estate/searchWordTemplateOnServer',{type:type}).then((resp)=>{
			if(resp.data.status === 1){
				//如果是预评估
				if(resp.data.type === 'PRE'){
					let formatArray = [],cnt=1;
					for(var k in resp.data.fileData){
						let obj = {};
						if(resp.data.fileData.hasOwnProperty(k)){
							obj['wordName'] = resp.data.fileData[k];
							obj['bank'] = k;
							obj['key'] = (cnt++).toString();
						}
						formatArray.push(obj);
					}
					this.setState({
						preTemplates:formatArray,
						isTableLoading:false
					})
				}
			}else{
				Modal.error({
					title:'抱歉!',
					content:'Word模板读取失败~',
				})
			}
		})
	}
	//改变tab
	changeTab(activeKey){
		if(activeKey === '1'){
			//预评估
			this.readDocxFromServer('PRE')
		}

	}
	//处理删除请求
	handleRemoveWord(record){
		//弹框确认删除
		let self = this;
		let wordName= record.wordName,
			bankName = record.bank;
		let param = {
			type:'PRE',
			wordName:wordName,
			bankName:bankName
		}
		Modal.confirm({
			title: '请注意',
			content: '确认删除该Word模板?',
			okText: '确认',
			cancelText: '取消',
			onOk(){
				axios.post('/estate/deleteWordTemplate',param).then((resp)=>{
					if(resp.data.status === 1){
						//此时要重新读取word信息
						self.readDocxFromServer('PRE')
					}else{
						Modal.warning({
							title:'不好!',
							content:'删除操作出现未知错误!'
						})
					}
				})
			}
		})
	}
	//处理word上传请求
	handleUploadWord(record){

	}
	//处理上传过程
	handleUploadChange(info){
		let fileList = info.fileList;
		//如果文件正在上传
		if (info.file.status === 'uploading') {
			console.log('uploading')
			this.setState({
				isFileUploading:true
			})
		}
		//文件上传完毕
		if (info.file.status === 'done') {
			// Get this url from response in real world.
			console.log('done')
			this.setState({
				isFileUploading:false
			})

		}
		this.setState({fileList});
	}


	render(){
		//上传组件相关的数据
		const uploadProps = {
			name:'wordPre',
			action:'/estate/upload_wordPre',
			//注前面的是doc，后面的是docx，2者都必须
			accept:'application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document',
			//不展示上传列表
			showUploadList:false
		};
		//table相关的数据
		const columns = [{
			title: 'word文件名称',
			dataIndex: 'wordName',
			key: 'wordName',
			render:(text)=>{
				return (
					text?text:<span style={{color:'red'}}>无</span>
				)
			}
		},
		{
			title: '对应银行名称',
			dataIndex: 'bank',
			key: 'bank',
		}, {
			title: '操作',
			key: 'action',
			render: (text, record) => {
				//该word模板是否存在,如果为''则不存在
				let isWordExist = record.wordName;
				return (
				<span>
					{
						isWordExist ?(
							<span>
								<a onClick={() => this.handleRemoveWord(record)}>删除</a>
								<Divider type = "vertical" />
								<a>修改</a>
								<Divider type = "vertical" />
								<a>下载</a>
							</span>
							)
						:(
							<span>
								{/*这里有坑，注意upload组件必须一直渲染,不能在上传时渲染为null，否则无法触发handleUploadChange,以至于无法触发done*/}
								<Upload {...uploadProps}
										style={{display:!this.state.isFileUploading?'block':'none'}}
										fileList={this.state.fileList}
										onChange={(info)=>this.handleUploadChange(info)}>
									<a onClick={() => this.handleUploadWord(record)}>上传</a>
								</Upload>
								{
									this.state.isFileUploading?<span>上传中...</span>:null
								}
							</span>
						)
					}
				</span>
				)
			},
		}];
		//获取用户权限，非管理员无法查看页面
		let {userAuth} = this.props;
		return (
			userAuth===0?(
				<div>
					{/*这里复用的其他文件的css*/}
					<div className="my-page-wrapper">
						<div className="page-title">
							<div className="template-desc">
								<i className="fa fa-cog modify-icon modify-icon-padding"></i><span>Word模板管理</span>
							</div>
						</div>
						{/*内容区域*/}
						<div className="template-content">
							<div className="template-content-wrapper">
								<div className="word-template-tab-wrapper">
									<Tabs onChange={(activeKey)=>this.changeTab(activeKey)} type="card">
										<TabPane tab="预评估Word模板" key="1">
											{/*展示模板的表格组件*/}
											<WordTemplateManagementTable
												columns={columns}
												isLoading={this.state.isTableLoading}
												dataSource={this.state.preTemplates}
											/>
										</TabPane>
										<TabPane tab="评估正报Word模板" key="2">Content of Tab Pane 2</TabPane>
									</Tabs>
								</div>
							</div>
						</div>
					</div>

					{/*补丁区域*/}
					<div className="bottom-padding">
					</div>
				</div>
			):(
				<div>
				</div>
			)

		)
	}
}

//获取用户权限
const mapStateToProps = (state)=>{
	return {
		userAuth:state.updateUserAuthState.userAuth,
	}
}

export default  withRouter(connect(mapStateToProps)(WordTemplateManagement))