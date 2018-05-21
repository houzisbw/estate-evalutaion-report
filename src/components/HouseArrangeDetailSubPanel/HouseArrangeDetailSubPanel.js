/**
 * 派单详情面板
 */
import React from 'react'
import './index.scss'
import {connect} from 'react-redux'
import store from './../../store/store'
import axios from 'axios'
import {Collapse,Modal,List,message } from 'antd'
const Panel = Collapse.Panel;
class HouseArrangeDetailSubPanel extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			staffList:[],
			allocationResultObj:{}
		}
	}
	//此处无法检查出数组类型的props变化，所以得特殊处理:用一个bool变量记录是否进行了派单操作
	componentWillReceiveProps(nextProps){
		if(nextProps.isArrange !== this.props.isArrange){
			this.setState({
				allocationResultObj:nextProps.allocationResultObj
			})
		}
		//当重新上传excel时清空已分配结果
		if(this.props.isEstateListUpdated !== nextProps.isEstateListUpdated){
			this.setState({
				allocationResultObj:{}
			})
		}
	}

	componentDidMount(){
		axios.get('/staff_arrange/getStaff').then((resp)=>{
			if(resp.data.status===-1){
				Modal.error({
					title: '糟糕！',
					content: '数据读取出错，请重试~',
				});
			}else{
				var staffData = resp.data.staffList;
				this.setState({
					staffList:staffData
				})
			}
		});
		this.setState({
			allocationResultObj:this.props.allocationResultObj
		})
	}
	//计算已分配的房屋数量
	caculateAllocatedEstateNum(){
		let cnt = 0;
		for(let k in this.state.allocationResultObj){
			if(this.state.allocationResultObj.hasOwnProperty(k) && this.state.allocationResultObj[k].staffName){
				this.state.allocationResultObj[k].indexList.forEach((item)=>{
					cnt++;
				})
			}
		}
		return cnt;
	}
	render(){
		//计算已分配的房屋数量
		let allocatedEstateNum = this.caculateAllocatedEstateNum();
		//生成panel的数据项
		let getPanelData = ()=>{
			return this.state.staffList.map((item,index)=>{
				//计算出每个员工对应的房屋列表
				let staffName = item.name;
				let estateListOfStaff = [];
				for(let k in this.state.allocationResultObj){
					//如果该房产已经分配给某人，且这个人的名字就是当前人员
					if(this.state.allocationResultObj.hasOwnProperty(k) && this.state.allocationResultObj[k].staffName === staffName)
					{
						estateListOfStaff.push(...this.props.allocationResultObj[k].indexList.map((idxItem)=>{
							return this.props.estateIndexToEstateNameObj[idxItem]
						}));
					}
				}
				//panel的header，reactNode类型
				let headerNode = (
					<div className="arrange-detail-headernode-wrapper  clearfix">
						<div className="arrange-detail-float-left">
							{staffName}
						</div>
						<div className={`arrange-detail-float-right ${estateListOfStaff.length>0?'arrange-detail-font-blue':''}`}>
							{estateListOfStaff.length}
						</div>
					</div>
				);
				return (
					<Panel header={headerNode} key={index}>
						{
							<List
								itemLayout="horizontal"
								locale={{emptyText:'暂无数据'}}
								dataSource={estateListOfStaff}
								renderItem={listItem => (
									<List.Item>
										<List.Item.Meta
											description={listItem}
										/>
									</List.Item>
								)}
							/>
						}
					</Panel>
				)
			})
		};
		return (
			<div className="staff-arrange-detail-wrapper">
				<div className="staff-arrange-detail-info">
					<span className="staff-arrange-detail-span">总单量: {this.props.estateList.length}</span>
					<span className="staff-arrange-detail-span">已分配: {allocatedEstateNum}</span>
					<span >未分配: {this.props.estateList.length - allocatedEstateNum}</span>
				</div>
				<Collapse accordion bordered={false}>
					{
						getPanelData()
					}
				</Collapse>
			</div>
		)
	}
}
const mapStateToProps = (state)=>{
	//注意这里用Object.assign来生成新的对象，防止检测不出对象的变化
	return {
		allocationResultObj:Object.assign({},state.updateEstateAllocationState.allocationResultObj),
		estateIndexToEstateNameObj:state.updateEstateAllocationState.estateIndexToNameObj,
		isArrange:state.updateEstateAllocationState.isArrange,
		estateList:state.updateEstateAllocationState.estateList,
	}
};
export default  connect(mapStateToProps)(HouseArrangeDetailSubPanel)
