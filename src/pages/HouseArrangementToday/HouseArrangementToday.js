/**
 * 今日看房情况页面
 */
import React from 'react'
import './index.scss'
import {Icon,Tabs} from 'antd'
import HouseArrangeExcelContentList from './../../components/HouseArrangeExcelContentList/HouseArrangeExcelContentList'
const {TabPane} = Tabs;
class HouseArrangementToday extends React.Component{
	constructor(props){
		super(props);
		this.state = {};
	}
	tabOnChange(key){

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
							{/*看房时间*/}
							<div className="latest-visit-wrapper">
								<Icon type="clock-circle-o" style={{fontSize:'25px',color:'#39ac6a'}}/>
								<span className="latest-visit-time">2018年7月16日</span>
							</div>
							{/*tab区域*/}
							<div className="latest-visit-tab">
								<Tabs defaultActiveKey="1" size={'large'} onChange={(activeKey)=>this.tabOnChange(activeKey)}>
									<TabPane tab="全部房屋(100)" key="1">
										<HouseArrangeExcelContentList/>
									</TabPane>
									<TabPane tab="已看房屋(12)" key="2">
										<HouseArrangeExcelContentList/>
									</TabPane>
									<TabPane tab="未看房屋(88)" key="3">
										<HouseArrangeExcelContentList/>
									</TabPane>
								</Tabs>
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
export default  HouseArrangementToday
