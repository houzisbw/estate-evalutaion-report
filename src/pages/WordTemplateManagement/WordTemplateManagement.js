//Word模板模板管理页面
import React from 'react'
import './index.scss'
import axios from 'axios'
import {Modal,Tabs,Divider,Upload,Pagination} from 'antd'
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import WordTemplateManagementTable from './../../components/WordTemplateManageTable/WordTemplateManageTable'
const TabPane = Tabs.TabPane;
class WordTemplateManagement extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			//总条目数量
			totalNum:0,
			//分页器当前页码
			currentPage:1,
			//预评估报告模板数组
			preTemplates:[],
			//表格是否加载中
			isTableLoading:false,
			//文件是否上传中
			isFileUploading:false,
			//upload组件参数
			fileList:[],
			//选择的银行名称
			bankName:'',
			//上传的种类
			uploadType:''
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
		let param = {
			type:type,
			pageNum:this.state.currentPage,
			//每页容量
			pageCapacity:10
		};
		axios.post('/estate/searchWordTemplateOnServer',param).then((resp)=>{
			if(resp.data.status === 1){
				//如果是预评估
				if(resp.data.type === 'PRE'){
					let formatArray = [],cnt=1;
					for(var k in resp.data.fileData){
						//每条数据的是否在loading状态,这个很重要，不能全局只设置一个isloading
						let obj = {isLoading:false};
						if(resp.data.fileData.hasOwnProperty(k)){
							obj['wordName'] = resp.data.fileData[k];
							obj['bank'] = k;
							obj['key'] = (cnt++).toString();
						}
						formatArray.push(obj);
					}
					this.setState({
						preTemplates:formatArray,
						isTableLoading:false,
						totalNum:resp.data.total
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
	//处理word上传请求,必须记录下是上传的哪个银行的模板
	handleUploadWord(record){
		this.setState({
			bankName:record.bank,
			uploadType:'UPLOAD'
		})
	}
	//处理下载请求
	handleDownloadWord(e,record){
		e.preventDefault();
		let docName = record.wordName;
		let param = {
			docName:docName,
			type:'PRE'
		}
		//注意文件下载不能用ajax发送请求到后台，ajax默认会返回文件data数据而不是文件下载
		//问题终于搞懂，必须考虑代理，因为是开发环境，3000端口被代理到5000，生产环境可以不加http://localhost:5000(默认就是5000端口)
		window.location.href=`http://localhost:5000/estate/wordDownload?docName=${docName}&type=${param.type}`;
	}
	//处理修改word请求,修改其实就是重新上传文件覆盖原来的word文件
	//这里有要求:word必须名字和原来word的一样才行，否则会覆盖其他的
	handleModifyWord(record){
		this.setState({
			bankName:record.bank,
			uploadType:'MODIFY'
		})
	}

	//处理上传过程,bankName表明了是那一条数据被点击
	handleUploadChange(info,bankName,responseStatusWord){
		let fileList = info.fileList;
		//如果文件正在上传
		if (info.file.status === 'uploading') {
			//console.log('uploading')
			//遍历找出被点击的那条数据，改变其状态为上传中
			let t = this.state.preTemplates;
			t.forEach((item)=>{
				if(item.bank === bankName){
					item.isLoading = true;
				}
			})
			this.setState({
				preTemplates:t
			})
		}
		//文件上传完毕
		if (info.file.status === 'done') {
			//console.log('done')
			//遍历找出被点击的那条数据，改变其状态为上传完毕
			let t = this.state.preTemplates;
			t.forEach((item)=>{
				if(item.bank === bankName){
					item.isLoading = false;
				}
			})
			this.setState({
				preTemplates:t
			})
			//文件上传完毕后再判断服务端返回状态,否则无法读取responese字段
			if(info.file.response.status === -2){
				//文件重名
				Modal.warning({
					title:'请注意',
					content:responseStatusWord['-2']
				})

			}else if(info.file.response.status === -1){
				//未知错误
				Modal.warning({
					title:'糟糕',
					content:responseStatusWord['-1']
				})

			}else if(info.file.response.status === 1){
				//上传成功
				let self = this;
				Modal.success({
					title:'恭喜',
					content:responseStatusWord['1'],
					onOk(){
						//重新初始化表格数据
						self.readDocxFromServer('PRE')
					}
				})
			}

		}


		this.setState({fileList});
	}

	//分页器页码改变回调
	onPageIndexChange(page){
		this.setState({
			currentPage: page,
		},()=>{
			//重新查询数据库获取数据
			this.readDocxFromServer('PRE');
		});
	}



	render(){
		//上传文件的responseStatusWord
		let uploadResponseStatusWord = {
			'1':'文件上传成功!',
			'-1':"文件上传出现未知错误!",
			'-2':'文件名和已有的模板名称重复，请换一个名称!'
		}
		//修改状态下的上传上传文件的responseStatusWord
		let uploadModifyResponseStatusWord = {
			'1':'Word模板文件修改成功!',
			'-1':"文件上传出现未知错误!",
			'-2':'上传文件名和服务器上对应模板名字不同，请上传相同名称的word!'
		}
		//上传组件相关的数据
		let uploadProps = {
			name:'wordPre',
			action:'/estate/upload_wordPre',
			data:{
				bankName:this.state.bankName,
				uploadType:this.state.uploadType
			},
			//注前面的是doc，后面的是docx，2者都必须
			accept:'application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document',
			//不展示上传列表
			showUploadList:false
		};
		//table相关的数据
		const columns = [{
			title: 'word文件名称',
			dataIndex: 'wordName',
			width:'60%',
			key: 'wordName',
			render:(text)=>{
				return (
					text?text:<span style={{color:'red'}}>无</span>
				)
			}
		},
		{
			title: '对应银行名称',
			width:'20%',
			dataIndex: 'bank',
			key: 'bank',
		}, {
			title: '操作',
			width:'20%',
			key: 'action',
			render: (text, record) => {
				//该word模板是否存在,如果为''则不存在
				let isWordExist = record.wordName;
				let isLoading = record.isLoading;
				return (
				<span>
					{
						isWordExist ?(
							<span>
								<a onClick={() => this.handleRemoveWord(record)}>删除</a>
								<Divider type = "vertical" />
								<span>
									{/*这里有坑，注意upload组件必须一直渲染,不能在上传时渲染为null，否则无法触发handleUploadChange,以至于无法触发done*/}
										<Upload {...uploadProps}
												style={{display:!isLoading?'block':'none'}}
												fileList={this.state.fileList}
												onChange={(info)=>this.handleUploadChange(info,record.bank,uploadModifyResponseStatusWord)}>
										<a onClick={() => this.handleModifyWord(record)}>修改</a>
									</Upload>
										{
											isLoading?<span>上传中...</span>:null
										}
								</span>
								<Divider type = "vertical" />
								{/*有问题,注意这里代理到后端5000端口不是前端的3000端口*/}
								{/*为啥无法访问到后端接口?*/}
								{/*<a href='http://localhost:5000/pre/nonghang-style-right.docx' download="t">下载</a>*/}
								<a onClick={(e)=>this.handleDownloadWord(e,record)}>下载</a>
							</span>
							)
						:(
							<span>
								{/*这里有坑，注意upload组件必须一直渲染,不能在上传时渲染为null，否则无法触发handleUploadChange,以至于无法触发done*/}
								<Upload {...uploadProps}
										style={{display:!isLoading?'block':'none'}}
										fileList={this.state.fileList}
										onChange={(info)=>this.handleUploadChange(info,record.bank,uploadResponseStatusWord)}>
									<a onClick={() => this.handleUploadWord(record)}>上传</a>
								</Upload>
								{
									isLoading?<span>上传中...</span>:null
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
									{/*分页器*/}
									<div className="template-pagination-wrapper">
										<Pagination current={this.state.currentPage}
													onChange={(page)=>this.onPageIndexChange(page)}
													total={this.state.totalNum}
										/>
									</div>
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