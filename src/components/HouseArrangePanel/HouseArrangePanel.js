//派单分配面板
import React from 'react'
import './index.scss'
//动画库
import {Motion,spring} from 'react-motion'
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
							{/*面板收缩展开按钮*/}
							<div className={`house-arrange-panel-expand-button ${!this.state.isPanelOpen?'house-arrange-panel-shrink':'house-arrange-panel-expand'}`}
								 onClick={()=>{this.togglePanel()}}
							>
							</div>
						</div>
					)
				}
			</Motion>
		)
	}
}
export default  HouseArrangePanel