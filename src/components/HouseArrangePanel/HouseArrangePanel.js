//派单分配面板
import React from 'react'
import './index.scss'
import { Tabs } from 'antd';
import HouseArrangeStaffConfigSubPanel from './../../components/HouseArrangeStaffConfigSubPanel/HouseArrangeStaffConfigSubPanel'
import HouseArrangeAllocationSubPanel from './../../components/HouseArrangeAllocationSubPanel/HouseArrangeAllocationSubPanel'
import HouseArrangeDetailSubPanel from './../../components/HouseArrangeDetailSubPanel/HouseArrangeDetailSubPanel'
//动画库
import {Motion,spring} from 'react-motion'
import {connect} from 'react-redux'
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
								{/*此处div的id表示这个div用于设置popconfirm的挂载点，注意必须设置该div的position:relative，因为popconfirm的position是absolute*/}
								<div id="ant-panel-wrapper">
									<Tabs defaultActiveKey="1" >
										{/*forceRender必须设置，防止隐藏的时候不渲染*/}
										<TabPane tab="人员设置" key="1" forceRender={true}>
											<HouseArrangeStaffConfigSubPanel />
										</TabPane>
										{/*这里需要判断baiduMap是否已经实例化，否则渲染会出错，因为forceRender设置为true，隐藏状态下也会渲染tabPane*/}
										{
											this.props.baiduMap?(
												<TabPane tab="派单操作" key="2" forceRender={true}>
													<HouseArrangeAllocationSubPanel isEstateListUpdated={this.props.isEstateListUpdated}/>
												</TabPane>
											):null
										}
										<TabPane tab="已派详情" key="3" forceRender={true}>
											<HouseArrangeDetailSubPanel isEstateListUpdated={this.props.isEstateListUpdated}/>
										</TabPane>
									</Tabs>
								</div>
							</div>
						</div>
					)
				}
			</Motion>
		)
	}
}
const mapStateToProps = (state)=>{
	return {
		baiduMap:state.updateEstateAllocationState.map,
	}
};
export default  connect(mapStateToProps)(HouseArrangePanel)