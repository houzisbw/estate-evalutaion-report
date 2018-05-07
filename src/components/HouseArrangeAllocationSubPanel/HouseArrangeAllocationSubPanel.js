/**
 * 看房人员派单面板
 */
import React from 'react'
import './index.scss'
import {connect} from 'react-redux'
import store from './../../store/store'
import axios from 'axios'
import {UpdateEstateListSelectedIndex,UpdateEstateDataList} from './../../store/actions/estateAllocation'
import {Switch,Tooltip,Button,List,Popconfirm,Avatar,Menu,Dropdown,Modal} from 'antd'
import {Element} from 'react-scroll'
const MenuItem = Menu.Item;

class HouseArrangeAllocationSubPanel extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			//分配结果，对象，key为房地产名，value为人员
			estateAllocationResult:{},
			highLightLabelStyle:{
				backgroundColor:'#1890ff',
				display:'block',
				color:'#fff',
				border:'none',
				padding:'5px',
				borderRadius:'3px',
				boxShadow:'1px 2px 1px rgba(0,0,0,.15)'
			},
			defaultLabelStyle:{
				display:'block',
				color:'#fff',
				backgroundColor:"#2aa056",
				border:'none',
				padding:'5px',
				borderRadius:'3px',
				boxShadow:'1px 2px 1px rgba(0,0,0,.15)'
			},
			selectedMarker:null,
			//房屋派单人员
			estateAllocationStaffList:[]
		}
	}
	componentDidMount(){
		//获取房屋派单人员
		axios.get('/staff_arrange/getStaff').then((resp)=>{
			if(resp.data.status===-1){
				Modal.error({
					title: '糟糕！',
					content: '数据读取出错，请重试~',
				});
			}else{
				var staffData = resp.data.staffList;
				var staffList = staffData.map((v)=>{
					return v.name
				});
				staffList.unshift('无');
				this.setState({
					estateAllocationStaffList:staffList
				})
			}
		});

		//点击地图，取消房屋列表的选中项
		this.props.baiduMap.addEventListener('click',()=>{
			if(this.state.selectedMarker){
				var label = this.state.selectedMarker.getLabel();
				label.setStyle(this.state.defaultLabelStyle)
				//恢复右侧列表avatar颜色
				store.dispatch(UpdateEstateListSelectedIndex(-1))
			}
		});
		//更新redux
		var estateList = this.processEstateList();
		store.dispatch(UpdateEstateDataList(estateList));
		//初始化派单结果对象,将key初始化为房地产名
		var resultObj = {};
		estateList.forEach((item)=>{
			resultObj[item.estateName]=null;
		});
		this.setState({
			estateAllocationResult:resultObj
		})
	}
	handleSwitchChange(v){

	}
	//处理房屋分配
	handleAllocation(estateName,regionName){

	}
	//处理地图平移到指定房地产,且指定房产颜色高亮
	handleMapPan(estateLocation,estateIndex){
		//baiduMap实例保存在redux中
		this.props.baiduMap.panTo(estateLocation);
		this.props.markerList.forEach((item)=>{
			//如果是指定的房地产，根据位置坐标来判断
			var pos = item.getPosition();
			var label = item.getLabel();
			if(pos.lng===estateLocation.lng && pos.lat===estateLocation.lat){
				//高亮marker,获取到marker的label
				label.setStyle(this.state.highLightLabelStyle)
				this.setState({
					selectedMarker:item
				})
			}else{
				//设置style为默认
				label.setStyle(this.state.defaultLabelStyle)
			}
		});
		store.dispatch(UpdateEstateListSelectedIndex(estateIndex))

	}
	//针对estateList进行处理，获取到新的列表[片区名，小区名字]
	processEstateList(){
		//注意处理过程中如果不属于任何一个片区，则特殊处理
		var retList = this.props.estateList.map((item)=>{
			var location = item.length>1?item[1]['B']:'';
			var splitter = ['市','区','县'];
			var index = Number.MAX_SAFE_INTEGER;
			splitter.forEach((v)=>{
				var tempIndex = location.indexOf(v);
				if(tempIndex!==-1){
					//取这3个index中最小的一个,也就是最先出现的
					if(tempIndex<index){
						index=tempIndex;
					}
				}
			});
			//找到
			var regionName = '无';
			if(index!==Number.MAX_SAFE_INTEGER){
				regionName = location.substring(0,index+1);
			}
			return {
				estateName:location,
				regionName:regionName,
				location:item[0]
			}
		});
		//按区域排序
		retList.sort(function(a,b){return a.regionName.localeCompare(b.regionName)})
		retList = retList.map((v,idx)=>{
			return Object.assign(v,{index:idx+1})
		});
		return retList;
	}
	//处理人员分配
	handleMenuClick(staffName,estateName){
		var tempResult = this.state.estateAllocationResult;
		tempResult[estateName] = staffName==='无'?null:staffName;
		this.setState({
			estateAllocationResult:tempResult
		});

	}
	render(){
		var estateList = this.processEstateList();
		//生成看房人员下拉名单,小技巧:用函数返回Menu，目的是为了传入参数
		const getMenu =(estateName)=>{
			return (
				<Menu onClick={({key})=>{this.handleMenuClick(key,estateName)}}>
					{
						this.state.estateAllocationStaffList.map((item)=>{
							return (
								<MenuItem key={item}>
									{item}
								</MenuItem>
							)
						})
					}
				</Menu>
			)
		};

		return (
			<div className="staff-allocation-panel-wrapper">
				<div className="staff-allocation-operation-wrapper clearfix">
					<div className="staff-allocation-smart-select-wrapper">
						<Tooltip title="开启时，给某一房屋分配人员会自动给该片区的所有房屋分配相同人员">
							<span className="staff-allocation-smart-select-label">智能选择: </span>
						</Tooltip>
						<Switch defaultChecked onChange={(v)=>{this.handleSwitchChange(v)}} />
					</div>
					<div className="staff-allocation-button-wrapper">
						<Button type="primary" className='staff-allocation-excel-button'>生成Excel</Button>
					</div>
				</div>
				{/*房屋列表*/}
				<div className="staff-allocation-list-wrapper">
					<List
						loading={false}
						locale={{emptyText:'无房屋数据,请先导入'}}
						itemLayout="horizontal"
						dataSource={estateList}
						renderItem={item => {
							//List.item.meta的title用reactNode表示，因为要处理不同的颜色,默认是string，很局限
							let titleNode = (
								<span>
									{item.regionName} <span className="estate-allocated-staff-highlight">{this.state.estateAllocationResult[item.estateName] ? '['+this.state.estateAllocationResult[item.estateName]+']':null}</span>
								</span>
							);
							return (
								//Element标签是react-scroll插件的元素，表示滚动到的目标元素，name用于srcollTo参数
								<Element name={item.estateName}>
									<List.Item actions={[
										<Dropdown overlay={getMenu(item.estateName)}
												  getPopupContainer={() => document.getElementById('house-arrange-panel-wrap')}>
											<a onClick={() => {
												this.handleAllocation(item.estateName, item.regionName)
											}}>分配</a>
										</Dropdown>
										,
										<a onClick={() => {
											this.handleMapPan(item.location, item.index)
										}}>地图</a>
									]}>
										<List.Item.Meta
											title={titleNode}
											description={item.estateName}
											avatar={<Avatar
												style={this.props.estateSelectedIndex === item.index ? {backgroundColor: '#1890ff'} : {backgroundColor: '#39ac6a'}}
												size="small">{item.index}</Avatar>}
										/>
									</List.Item>
								</Element>
							)
						}}
					/>
				</div>
			</div>
		)
	}
}

//从redux获取房屋数据
const mapStateToProps = (state)=>{
	return {
		estateList:state.updateEstateAllocationState.estateList,
		baiduMap:state.updateEstateAllocationState.map,
		markerList:state.updateEstateAllocationState.markerList,
		estateSelectedIndex:state.updateEstateAllocationState.estateSelectedIndex
	}
};
export default  connect(mapStateToProps)(HouseArrangeAllocationSubPanel)