/**
 * 画圈找房弹出的modal中的内容组件
 */
import React from 'react'
import './index.scss'
import {List,Avatar} from 'antd'
class DrawingArrangeResultPanel extends React.Component{
	constructor(props){
		super(props);
		this.state={
			selectedStaffIndex:null
		}
	}
	//List组件并未提供点击事件接口，自己写一个就行
	handleItemClick(name,index){
		this.setState({
			selectedStaffIndex:index
		});
		this.props.changeAllocatedStaff(name);
	}
	render(){
		let staffData = this.props.staffList.map((item,index)=>{
			return {name:item,index:index}
		});
		let estateData = this.props.estateList.map((item,index)=>{
			return {name:item,index:index+1}
		});
		return (
			<div className="drawing-result-wrapper clearfix">
				<div className="drawing-result-left-wrapper">
					<List size="large"
						  dataSource={estateData}
						  locale={{emptyText:'当前圈内无房屋数据,请重新画圈'}}
						  renderItem={item=>(
						  		<List.Item style={{paddingLeft:'20px'}}>
									<List.Item.Meta
										description={item.name}
										avatar={<Avatar
											style={{backgroundColor: '#39ac6a'}}
											size="small">{item.index}</Avatar>}
									/>
								</List.Item>
						  )}
					/>
				</div>
				{/*看房人员名单*/}
				<div className="drawing-result-right-wrapper">
					<List size="small"
						  dataSource={staffData}
						  renderItem={item => (<List.Item onClick={()=>{this.handleItemClick(item.name,item.index)}}
														  className={`drawing-result-right-item ${this.state.selectedStaffIndex===item.index?'drawing-right-item-active':''}`}>
							  							  {item.name}
							  					</List.Item>)}
					/>
				</div>
			</div>
		)
	}
}
export default  DrawingArrangeResultPanel