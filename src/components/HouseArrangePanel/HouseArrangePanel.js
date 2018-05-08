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
	}
	render(){
		return (
			//这里使用react-motion作为动画库，其中x是变化量，作为panel的水平位移量,注意外层容易要设置overflow:hidden防止出现滚动条
			<Motion style={{x:spring(this.props.isOpen?-350:0)}}>
				{
					({x})=>(
						<div className="house-arrange-panel" style={{
							transform: `translateX(${x}px)`
						}}>
							{/*非常重要，加一层wrap防止绝对定位元素house-arrange-panel-expand-button由于overflow:auto被隐藏*/}
							<div className="house-arrange-panel-wrap" id="house-arrange-panel-wrap">
								{/*面板收缩展开按钮,点击调用父组件的方法*/}
								<div className={`house-arrange-panel-expand-button ${!this.props.isOpen?'house-arrange-panel-shrink':'house-arrange-panel-expand'}`}
									 onClick={()=>{this.props.togglePanel()}}
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