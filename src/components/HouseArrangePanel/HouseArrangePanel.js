//派单分配面板
import React from 'react'
import './index.scss'
import { Tabs } from 'antd';
import HouseArrangeStaffConfigSubPanel from './../../components/HouseArrangeStaffConfigSubPanel/HouseArrangeStaffConfigSubPanel'
import HouseArrangeAllocationSubPanel from './../../components/HouseArrangeAllocationSubPanel/HouseArrangeAllocationSubPanel'
//动画库
import {Motion,spring} from 'react-motion'
const TabPane = Tabs.TabPane;
class HouseArrangePanel extends React.Component{
	constructor(props){
		super(props)
		this.state = {
			isPanelOpen:false
		}
	}
	togglePanel(){
		this.setState({
			isPanelOpen:!this.state.isPanelOpen
		})
	}
	render(){
		return (
			//这里使用react-motion作为动画库，其中x是变化量，作为panel的水平位移量,注意外层容易要设置overflow:hidden防止出现滚动条
			<Motion style={{x:spring(this.state.isPanelOpen?-350:0)}}>
				{
					({x})=>(
						<div className="house-arrange-panel" style={{
							transform: `translateX(${x}px)`
						}}>
							{/*非常重要，加一层wrap防止绝对定位元素house-arrange-panel-expand-button由于overflow:auto被隐藏*/}
							<div className="house-arrange-panel-wrap">
								{/*面板收缩展开按钮*/}
								<div className={`house-arrange-panel-expand-button ${!this.state.isPanelOpen?'house-arrange-panel-shrink':'house-arrange-panel-expand'}`}
									 onClick={()=>{this.togglePanel()}}
								>
								</div>
								{/*tab，看房人员配置 和 派单*/}
								<Tabs defaultActiveKey="1" >
									<TabPane tab="看房人员配置" key="1">
										<HouseArrangeStaffConfigSubPanel />
									</TabPane>
									<TabPane tab="派单" key="2">
										<HouseArrangeAllocationSubPanel />
									</TabPane>
								</Tabs>
							</div>
						</div>
					)
				}
			</Motion>
		)
	}
}
export default  HouseArrangePanel