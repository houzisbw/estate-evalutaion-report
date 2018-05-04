/**
 * 看房人员配置面板
 */
import React from 'react'
import './index.scss'
import {Button} from 'antd'
class HouseArrangeStaffConfigSubPanel extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			staffNameInputValue:''
		}
	}
	handleInputChange(e){
		this.setState({
			staffNameInputValue:e.target.value
		})
	}
	addStaffName(){

	}
	render(){
		return (
			<div className="staff-config-panel-wrapper">
				<div className="staff-config-input-wrapper">
					{/*input中可以不写value=this.state.value，写了的话改变this.state.value，input的值也变*/}
					<input className="staff-config-input"
						   placeholder="请输入员工姓名" spellCheck={false}
						   onChange={(e)=>{this.handleInputChange(e)}}
					/>
					<Button type="primary" className='staff-config-add' onClick={()=>{this.addStaffName()}}>添加</Button>
				</div>
			</div>
		)
	}
}
export default  HouseArrangeStaffConfigSubPanel