/**
 * 看房人员配置面板
 */
import React from 'react'
import './index.scss'
import {Button, notification,List,Avatar,Modal,Popconfirm} from 'antd'
import axios from 'axios'
notification.config({
	duration: 1,
});
class HouseArrangeStaffConfigSubPanel extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			staffNameInputValue:'',
			isAddStaffButtonLoading:false,
			staffData:[]
		}
	}
	componentDidMount(){
		this.initStaffList();
	}
	//初始化人员名单
	initStaffList(){
		axios.get('/staff_arrange/getStaff').then((resp)=>{
			if(resp.data.status===-1){
				Modal.error({
					title: '糟糕！',
					content: '数据读取出错，请重试~',
				});
			}else{
				var staffData = resp.data.staffList;
				this.setState({
					staffData:staffData
				})
			}
		})
	}
	handleInputChange(e){
		this.setState({
			staffNameInputValue:e.target.value
		})
	}
	addStaffName(){
		var name = this.state.staffNameInputValue.trim();
		if(name === '' || name === '无'){
			notification['error']({
				message: '注意啦',
				description: '人员姓名不能为空，请重新填写~',
			});
			return
		}
		//名字不能过长
		if(name.length>10){
			notification['error']({
				message: '注意啦',
				description: '人员姓名不能超过10个字符~',
			});
			return
		}
		this.setState({
			isAddStaffButtonLoading:true
		});
		axios.post('/staff_arrange/addStaff',{staffName:name}).then((resp)=>{
			this.setState({
				isAddStaffButtonLoading:false
			});
			if(resp.data.status===-1){
				Modal.error({
					title: '糟糕！',
					content: '数据保存出错，请重试~',
				});
			}else if(resp.data.status === 1){
				Modal.error({
					title: '糟糕！',
					content: '员工姓名重复，请重新填写~',
				});
			}else{
				notification['success']({
					message: '恭喜',
					description: '保存成功~',
				});
				this.setState({
					staffNameInputValue:''
				});
				this.initStaffList();
			}
		})

	}
	//删除员工
	handleRemoveStaff(staffName){
		axios.post('/staff_arrange/deleteStaff',{staffName:staffName}).then((resp)=>{
			if(resp.data.status === -1){
				Modal.error({
					title: '糟糕！',
					content: '数据删除出错，请重试~',
				});
			}else{
				notification['success']({
					message: '恭喜',
					description: '删除成功~',
				});
			}
			this.initStaffList()
		})
	}

	render(){
		return (
			<div className="staff-config-panel-wrapper">
				<div className="staff-config-input-wrapper">
					{/*input中可以不写value=this.state.value，写了的话改变this.state.value，input的值也变*/}
					<input className="staff-config-input"
						   placeholder="请输入员工姓名" spellCheck={false}
						   value={this.state.staffNameInputValue}
						   onChange={(e)=>{this.handleInputChange(e)}}
					/>
					<Button type="primary"
							loading={this.state.isAddStaffButtonLoading}
							className='staff-config-add'
							onClick={()=>{this.addStaffName()}}>添加
					</Button>
				</div>
				{/*员工列表*/}
				<div className="staff-list-wrapper">
					<List
						loading={false}
						locale={{emptyText:'没有数据'}}
						itemLayout="horizontal"
						dataSource={this.state.staffData}
						renderItem={item => (
							<List.Item actions={[
								<Popconfirm placement="left" title="确认删除?" okText="是" cancelText="否" onConfirm={()=>{this.handleRemoveStaff(item.name)}}>
									<a>删除</a>
								</Popconfirm>
							]}>
								<List.Item.Meta
									title={item.name}
									avatar={<Avatar style={{backgroundColor:'#39ac6a'}} size="small">{item.index}</Avatar>}
								/>
							</List.Item>
						)}
					/>
				</div>
			</div>
		)
	}
}
export default  HouseArrangeStaffConfigSubPanel