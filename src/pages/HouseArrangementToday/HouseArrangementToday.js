/**
 * 今日看房情况页面
 */
import React from 'react'
import './index.scss'
import {Icon,Tabs,Modal,Tooltip,notification,Input} from 'antd'
import axios from 'axios'
import Loading from './../../components/Loading/Loading'
import HouseArrangeExcelContentList from './../../components/HouseArrangeExcelContentList/HouseArrangeExcelContentList'
import HouseExcelDataAddModal from './../../components/HouseExcelDataAddModal/HouseExcelDataAddModal'
const {TabPane} = Tabs;
const Search = Input.Search;
class HouseArrangementToday extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			excelLatestData:[],
			excelLatestVisitedData:[],
			excelLatestUnvisitedData:[],
			totalNum:0,
			isLoading:false,
			latestDate:'',
			activeTabKey:'1',
			addDataModalVisible:false,
			addModalConfirmLoading:false
		};
	}
	componentDidMount(){
		//向后端请求excel数据：最近一天的所有的数据
		this.fetchData();
	}
	fetchData(){
		//防止多次点击
		if(this.state.isLoading){
			return;
		}
		this.setState({isLoading:true});
		axios.post('/house_arrangement_today/getLatestExcelData').then((resp)=>{
			this.setState({isLoading:false});
			if(resp.data.status===-1){
				Modal.error({
					title:'悲剧',
					content:'数据读取失败，请重试'
				})
			}else if(resp.data.status===0){
				//数据为空
			}else{
				this.setState({
					excelLatestData:resp.data.excelData,
					excelLatestVisitedData:resp.data.visit,
					excelLatestUnvisitedData:resp.data.unvisit,
					totalNum:resp.data.total,
					latestDate:resp.data.latestDate
				})
			}
		})
	}
	tabOnChange(key){
		this.setState({
			activeTabKey:key
		})
	}
	//刷新数据
	refresh(){
		this.fetchData();
	}
	//添加数据
	addData(){
		this.setState({
			addDataModalVisible:true
		})
	}
	//提交表单，调用子组件的方法
	onAddDataModalOK(){
		//调用<HouseExcelDataAddModal>组件的submit方法
		let formValues = this['HouseExcelDataAddModal'].validateInputsAndSendToParent();
		//如果校验通过
		if(formValues.status === 1){
			let values = formValues.values;
			this.setState({
				addModalConfirmLoading:true
			});
			//传递给后台
			axios.post('/house_arrangement_today/saveAddedHouseData',{
				values:values
			}).then((resp)=>{
				if(resp.data.status===1){
					//保存成功
					notification['success']({
						message: '恭喜',
						description: '数据添加成功!',
					});
				}else{
					//保存失败
					notification['error']({
						message: 'Oops',
						description: '数据添加失败!请重试',
					});
				}
				//关闭对话框
				this.setState({
					addDataModalVisible:false,
					addModalConfirmLoading:false
				});
				this.refresh();
			})
		}else{
			//校验不通过
		}
	}
	onAddDataModalCancel(){
		this.setState({
			addDataModalVisible:false
		})
	}
	//搜索派单
	searchHouseData(v){
		if(!v){
			notification['error']({
				message: '注意',
				description: '关键词不能为空!',
			});
			return
		}
		//进入loading状态
		this.setState({
			isLoading:true
		});
		axios.post('/house_arrangement_today/searchHouseData',{
			keyword:v,
			latestDate:this.state.latestDate
		}).then((resp)=>{
			this.setState({
				isLoading:false
			});
			if(resp.data.status === -1){
				notification['error']({
					message: '注意',
					description: '搜索出错请稍后重试!',
				});
			}else{
				this.setState({
					excelLatestData:resp.data.excelData,
					excelLatestVisitedData:resp.data.visit,
					excelLatestUnvisitedData:resp.data.unvisit,
					totalNum:resp.data.total
				})
			}
		})
	}
	render(){
		return (
				<div>
					<div className="my-page-wrapper">
						{/*添加数据的对话框*/}
						<Modal
								title="添加看房数据"
								centered={true}
								wrapClassName="vertical-center-modal"
								maskClosable={false}
								destroyOnClose={true}
								confirmLoading={this.state.addModalConfirmLoading}
								visible={this.state.addDataModalVisible}
								onOk={() => this.onAddDataModalOK()}
								onCancel={() => this.onAddDataModalCancel()}
								okText="添加"
								cancelText="取消"
						>
								<HouseExcelDataAddModal wrappedComponentRef={(inst) => this['HouseExcelDataAddModal'] = inst}/>
						</Modal>
						{/*页面title*/}
						<div className="page-title">
							<div className="template-desc">
								<i className="fa fa-briefcase padding-right"></i>
								<span>最近一次看房情况</span>
							</div>
						</div>
						<div className="template-content">
							{
								this.state.isLoading?(<Loading />):(
										<div>
											{/*看房时间*/}
											<div className="latest-visit-wrapper">
												<Icon type="clock-circle-o" style={{fontSize:'25px',color:'#39ac6a'}}/>
												<span className="latest-visit-time">{this.state.latestDate}</span>
												<Tooltip title="点此刷新数据">
													<Icon type="sync" onClick={()=>{this.refresh()}} style={{cursor:'pointer',fontSize:'25px',color:'#39ac6a',float:'right',marginRight:'20px'}}/>
												</Tooltip>
												<Tooltip title="点此添加数据">
													<Icon type="plus-square-o" onClick={()=>{this.addData()}} style={{cursor:'pointer',fontSize:'25px',color:'#39ac6a',float:'right',marginRight:'20px'}}/>
												</Tooltip>
												<div className="house-data-search-wrapper">
													<Search
															placeholder="派单关键字"
															onSearch={(v)=>{this.searchHouseData(v)}}
															enterButton
													/>
												</div>
											</div>
											{/*tab区域*/}
											<div className="latest-visit-tab">
												<Tabs defaultActiveKey={this.state.activeTabKey} size={'large'} onChange={(activeKey)=>this.tabOnChange(activeKey)}>
													<TabPane tab={"全部房屋("+this.state.totalNum+')'} key="1">
														<HouseArrangeExcelContentList
																refreshData={()=>this.refresh()}
																latestDate={this.state.latestDate}
																excelLatestData={this.state.excelLatestData}
														/>
													</TabPane>
													<TabPane tab={"已看房屋("+this.state.excelLatestVisitedData.length+')'} key="2">
														<HouseArrangeExcelContentList
																refreshData={()=>this.refresh()}
																latestDate={this.state.latestDate}
																excelLatestData={this.state.excelLatestVisitedData}
														/>
													</TabPane>
													<TabPane tab={"未看房屋("+this.state.excelLatestUnvisitedData.length+')'} key="3">
														<HouseArrangeExcelContentList
																refreshData={()=>this.refresh()}
																latestDate={this.state.latestDate}
																excelLatestData={this.state.excelLatestUnvisitedData}
														/>
													</TabPane>
												</Tabs>
											</div>
										</div>
								)
							}
						</div>
					</div>
					{/*补丁区域*/}
					<div className="bottom-padding">
					</div>
				</div>
		)
	}
}
export default  HouseArrangementToday
