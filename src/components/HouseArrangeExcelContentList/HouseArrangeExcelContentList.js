/**
 * 房屋excel内容列表组件，用于[当天看房情况]模块
 */
import React from 'react';
import {List,Card,Tag,Tooltip,Icon,Select,Modal,notification,Input} from 'antd';
import './index.scss'
import axios from 'axios'
const Option = Select.Option;
const confirm = Modal.confirm;
class HouseArrangeExcelContentList extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			//修改看房人员的modal
			modifyModalVisible:false,
			//加急的modal
			modifyUrgentModalVisible:false,
			//初始加急信息
			defaultUrgentInfo:"",
			//是否加急
			isUrgentLoading:false,
			modifiedIndex:0,
			currentStaff:'',
			totalStaffNameList:[],
			//确定修改的按钮的loading
			confirmLoading:false,
			okText:'确定修改'
		}
	}
	componentDidMount(){

	}
	//修改加急信息
	handleModifyUrgent(index,urgentInfo,staff){
		this.setState({
			modifyUrgentModalVisible:true,
			modifiedIndex:index,
			okText:'确定修改',
			currentStaff:staff,
			defaultUrgentInfo:urgentInfo
		})
	}
	//加急信息输入框内容变化
	handleUrgentInfoChange(e){
		if(e.target.value.length>5){
			return
		}
		this.setState({
			defaultUrgentInfo:e.target.value
		})

	}
	//加急信息点ok确定
	handleUrgentModalOK(){
		this.setState({
			confirmLoading:true,
			okText:'保存中...'
		});
		axios.post('/house_arrangement_today/modifyUrgent',{
			index:this.state.modifiedIndex,
			urgentInfo:this.state.defaultUrgentInfo,
			staff:this.state.currentStaff
		}).then((resp)=>{
			if(resp.data.status===-1){
				//数据保存失败
				Modal.error({
					title:'悲剧',
					content:'加急信息保存失败!请重试'
				})
			}else{
				notification['success']({
					message: '恭喜',
					description: '加急信息修改成功',
				});
			}
			this.setState({
				confirmLoading:false,
				okText:'确定修改',
				modifyUrgentModalVisible:false
			});
			//刷新数据
			this.props.refreshData();
		})
	}
	//修改看房人员
	handleModifyStaff(index,staff){
		this.setState({
			modifyModalVisible:true,
			modifiedIndex:index,
			currentStaff:staff,
			okText:'确定修改'
		})
		//获取看房人员名单
		axios.get('/staff_arrange/getStaff').then((resp)=>{
			if(resp.data.status===-1){
				Modal.error({
					title: '糟糕！',
					content: '数据读取出错，请重试~',
				});
			}else{
				var staffData = resp.data.staffList;
				this.setState({
					totalStaffNameList:staffData.map((item)=>item.name)
				})
			}
		})
	}
	//确定修改，保存到数据库,然后刷新数据
	handleModifyModalOK(){
		this.setState({
			confirmLoading:true,
			okText:'保存中...'
		});
		axios.post('/house_arrangement_today/modifyStaff',{
			index:this.state.modifiedIndex,
			staffName:this.state.currentStaff
		}).then((resp)=>{
			if(resp.data.status===-1){
				//数据保存失败
				Modal.error({
					title:'悲剧',
					content:'人员修改保存失败!请重试'
				})
			}else{
				notification['success']({
					message: '恭喜',
					description: '看房人员修改成功',
				});
			}
			this.setState({
				confirmLoading:false,
				okText:'确定修改',
				modifyModalVisible:false
			});
			//刷新数据
			this.props.refreshData();
		})
	}
	handleModifyModalCancel(){
		this.setState({
			modifyModalVisible:false,
			modifyUrgentModalVisible:false,
		})
	}
	handleStaffSelect(v){
		this.setState({
			currentStaff:v
		})
	}

	render(){
		//卡片标题ReactNode
		const TitleNode = (index,isVisit)=>{
			return (
					<div>
						<span>{'序号: '+index}</span>
						<span className={`isvisit-badge ${isVisit?'':'novisit'}`}>{isVisit?'已看':'未看'}</span>
					</div>
			)
		};
		return (
				<div className="house-arrange-excel-wrapper">
					<Modal
							title={"序号"+this.state.modifiedIndex+": 修改看房人员"}
							wrapClassName="vertical-center-modal"
							visible={this.state.modifyModalVisible}
							onOk={() => this.handleModifyModalOK()}
							confirmLoading={this.state.confirmLoading}
							okText={this.state.okText}
							cancelText={'取消修改'}
							onCancel={() => this.handleModifyModalCancel()}
					>
						<p style={{textAlign:'center'}}>当前看房人员: <span style={{color:'#39ac6a'}}>{this.state.currentStaff}</span></p>
						<div className="house-arrange-radio-group-wrapper">
							<Select defaultValue={this.state.currentStaff} style={{ width: 200 }} onChange={(v)=>this.handleStaffSelect(v)}>
								{
									this.state.totalStaffNameList.map((item,index)=>{
										return (
												<Option value={item} key={index}>{item}</Option>
										)
									})
								}
							</Select>
						</div>
					</Modal>
					{/*修改加急信息的modal*/}
					<Modal
							title={"加急信息修改"}
							wrapClassName="vertical-center-modal"
							visible={this.state.modifyUrgentModalVisible}
							onOk={() => this.handleUrgentModalOK()}
							confirmLoading={this.state.confirmLoading}
							okText={this.state.okText}
							cancelText={'取消修改'}
							onCancel={() => this.handleModifyModalCancel()}
					>
						<Input addonBefore="加急详情"  value={this.state.defaultUrgentInfo} onChange={(e)=>this.handleUrgentInfoChange(e)}/>
					</Modal>
					<List
							grid={{ gutter: 16, column: 2}}
							locale={{emptyText:'数据空空如也~'}}
							dataSource={this.props.excelLatestData}
							renderItem={item => (
									<List.Item>
										<Card title={TitleNode(item.index,item.isVisit)}
													hoverable={true}
										>
											<div className="house-arrange-excel-content">
												<div className="house-arrange-excel-content-line-wrapper">
													<Tag color={item.isVisit?'#39ac6a':'#ff9e1e'}>房屋地址</Tag>
													<Tooltip title={item.roadNumber+item.detailPosition}>
														<span className="house-arrange-excel-content-desc">{item.roadNumber+item.detailPosition}</span>
													</Tooltip>
												</div>
												<div className="house-arrange-excel-content-line-wrapper">
													<Tag color={item.isVisit?'#39ac6a':'#ff9e1e'}>看房人员</Tag>
													<span className="house-arrange-excel-content-desc short-desc">{item.staffName}</span>
													<Tooltip title="修改看房人员">
														<Icon type="edit"
																	onClick={()=>this.handleModifyStaff(item.index,item.staffName)}
																	style={{marginLeft:'10px',position:'relative',top:'1px',cursor:'pointer'}}>
														</Icon>
													</Tooltip>
												</div>
												<div className="house-arrange-excel-content-line-wrapper">
													<Tag color={item.isVisit?'#39ac6a':'#ff9e1e'}>反馈情况</Tag>
													<span className="house-arrange-excel-content-desc">{item.feedback?(item.feedback.split('*##*').join(';')):<span className="ready-to-feed" style={{color:item.isVisit?'#39ac6a':'#ff9e1e'}}>待反馈</span>}</span>
												</div>
												<div className="house-arrange-excel-content-line-wrapper ">
													<Tag color={item.isVisit?'#39ac6a':'#ff9e1e'}>反馈时间</Tag>
													<span className="house-arrange-excel-content-desc">{item.feedTime?item.feedTime:<span className="ready-to-feed" style={{color:item.isVisit?'#39ac6a':'#ff9e1e'}}>待反馈</span>}</span>
												</div>
												<div className="house-arrange-excel-content-line-wrapper no-margin-bottom">
													<Tag color={item.isVisit?'#39ac6a':'#ff9e1e'} >加急情况</Tag>
													<span className="house-arrange-excel-content-desc short-desc">{item.isUrgent?item.urgentInfo:<span className="not-urgent">不加急</span>}</span>
													<Tooltip title="修改加急信息">
														<Icon type="edit"
																	onClick={()=>this.handleModifyUrgent(item.index,item.urgentInfo,item.staffName)}
																	style={{marginLeft:'10px',position:'relative',top:'1px',cursor:'pointer'}}>
														</Icon>
													</Tooltip>
												</div>
											</div>
										</Card>
									</List.Item>
							)}
					/>
				</div>
		)
	}
}
export default HouseArrangeExcelContentList