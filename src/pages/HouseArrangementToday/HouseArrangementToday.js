/**
 * 今日看房情况页面
 */
import React from 'react'
import './index.scss'
import {Icon,Tabs,Modal,Tooltip} from 'antd'
import axios from 'axios'
import Loading from './../../components/Loading/Loading'
import HouseArrangeExcelContentList from './../../components/HouseArrangeExcelContentList/HouseArrangeExcelContentList'
const {TabPane} = Tabs;
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
			activeTabKey:'1'
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
	render(){
		return (
				<div>
					<div className="my-page-wrapper">
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
											</div>
											{/*tab区域*/}
											<div className="latest-visit-tab">
												<Tabs defaultActiveKey={this.state.activeTabKey} size={'large'} onChange={(activeKey)=>this.tabOnChange(activeKey)}>
													<TabPane tab={"全部房屋("+this.state.totalNum+')'} key="1">
														<HouseArrangeExcelContentList
																refreshData={()=>this.refresh()}
																excelLatestData={this.state.excelLatestData}
														/>
													</TabPane>
													<TabPane tab={"已看房屋("+this.state.excelLatestVisitedData.length+')'} key="2">
														<HouseArrangeExcelContentList
																refreshData={()=>this.refresh()}
																excelLatestData={this.state.excelLatestVisitedData}
														/>
													</TabPane>
													<TabPane tab={"未看房屋("+this.state.excelLatestUnvisitedData.length+')'} key="3">
														<HouseArrangeExcelContentList
																refreshData={()=>this.refresh()}
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
