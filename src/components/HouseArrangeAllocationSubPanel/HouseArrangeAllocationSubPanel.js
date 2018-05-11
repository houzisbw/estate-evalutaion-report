/**
 * 看房人员派单面板
 */
import React from 'react'
import './index.scss'
import {connect} from 'react-redux'
import store from './../../store/store'
import axios from 'axios'
import {UpdateEstateListSelectedIndex,UpdateEstateDataList,UpdateAllocationResultObj} from './../../store/actions/estateAllocation'
import {Switch,Tooltip,Button,List,Popconfirm,Avatar,Menu,Dropdown,Modal} from 'antd'
import {Element} from 'react-scroll'
const MenuItem = Menu.Item;

class HouseArrangeAllocationSubPanel extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			//分配结果，对象，key为房地产名，value为人员
			estateAllocationResult:{},
			//选中标签的颜色
			highLightLabelStyle:{
				backgroundColor:'#1890ff',
				display:'block',
				color:'#fff',
				border:'none',
				padding:'5px',
				borderRadius:'3px',
				boxShadow:'1px 2px 1px rgba(0,0,0,.15)'
			},
			//默认标签的颜色
			defaultLabelStyle:{
				display:'block',
				color:'#fff',
				backgroundColor:"#2aa056",
				border:'none',
				padding:'5px',
				borderRadius:'3px',
				boxShadow:'1px 2px 1px rgba(0,0,0,.15)'
			},
			//已被分配的标签的颜色
			allocatedLabelStyle:{
				display:'block',
				color:'#fff',
				backgroundColor:"#7b7b7b",
				border:'none',
				padding:'5px',
				borderRadius:'3px',
				boxShadow:'1px 2px 1px rgba(0,0,0,.15)'
			},
			selectedMarker:null,
			//房屋派单人员
			estateAllocationStaffList:[],
			//是否智能选择
			isSmartChooseOn:true,
			//房地产名字和编号的对应关系对象
			estateIndexToEstateNameObj:{}
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
			this.props.markerList.forEach((item)=>{
				item.setAnimation(null)
			})
		});
		//更新redux
		var estateList = this.processEstateList();
		store.dispatch(UpdateEstateDataList(estateList));
		//初始化派单结果对象,将key初始化为房地产名
		var resultObj = {};
		estateList.forEach((item)=>{
			resultObj[item.estateName]=null;
		});
		//存储对应关系
		this.mapIndexToName();
		this.setState({
			estateAllocationResult:resultObj
		})
	}
	//智能选择开关
	handleSwitchChange(v){
		this.setState({
			isSmartChooseOn:v
		})
	}
	//处理地图平移到指定房地产,且指定房产颜色高亮
	handleMapPan(estateLocation,estateIndex){
		//baiduMap实例保存在redux中
		this.props.baiduMap.panTo(estateLocation);
		this.props.markerList.forEach((item)=>{
			//如果是指定的房地产，根据位置坐标来判断
			var pos = item.getPosition();
			if(pos.lng===estateLocation.lng && pos.lat===estateLocation.lat){
				//设置marker弹跳动画
				item.setAnimation(window.BMAP_ANIMATION_BOUNCE);
				this.setState({
					selectedMarker:item
				})
			}else {
				//取消弹跳动画
				item.setAnimation(null);
			}
		});
		store.dispatch(UpdateEstateListSelectedIndex(estateIndex))
	}
	//保存{编号:房屋名}的对应关系
	mapIndexToName(){
		var tempObj = {};
		this.props.estateList.forEach((item)=>{
			//存储{编号:名称}的对应关系
			tempObj[item[1]['A']] = item[1]['B'];
		});
		//保存对应关系
		this.setState({
			estateIndexToEstateNameObj:tempObj
		});
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
	handleMenuClick(staffName,estateName,regionName){
		var tempResult = this.state.estateAllocationResult;
		//处理人员和房产的分配结果
		//如果智能选择开启
		if(this.state.isSmartChooseOn){
			for(var key in tempResult){
				if(tempResult.hasOwnProperty(key) && key.indexOf(regionName)!==-1){
					tempResult[key]= (staffName==='无')?null:staffName;
				}
			}
		}else{

			tempResult[estateName] = (staffName==='无')?null:staffName;
			console.log(tempResult[estateName])
		}
		//marker的label类型
		var labelType = this.props.labelType;
		//地图上对应的marker的文本变成紫色
		//从redux获取到labelList
		var labelList = this.props.labelList;
		labelList.forEach((item)=>{
			//如果是显示房地产名称
			if(labelType === 'ESTATE_NAME'){
				if(tempResult[item.getContent()]){
					//如果该label对应的文本被选中,则变成灰色
					item.setStyle(this.state.allocatedLabelStyle)
				}else{
					//默认绿色
					item.setStyle(this.state.defaultLabelStyle)
				}
			}else{
				//显示房地产编号
				let labelContent = item.getContent();
				//获取内容前面的index部分
				let splitted = labelContent.split(' ');
				let labelIndexPart = splitted[0];
				let staffNamePart = splitted.length>1?splitted[1]:null;
				if(tempResult[this.state.estateIndexToEstateNameObj[labelIndexPart]]){
					//如果该label对应的文本被选中,则变成灰色
					item.setStyle(this.state.allocatedLabelStyle);
					//将内容设置为index+人员名字
					console.log(labelIndexPart+' ['+staffName+']');
					if(staffName==='无'){
						item.setContent(labelIndexPart+' ['+staffNamePart.substring(1,staffNamePart.length-1)+']');
					}else{
						item.setContent(labelIndexPart+' ['+staffName+']');
					}

				}else{
					//默认绿色
					item.setStyle(this.state.defaultLabelStyle);
					//内容只有index部分
					item.setContent(labelIndexPart);
				}
			}

		});
		//更新redux
		store.dispatch(UpdateAllocationResultObj(tempResult))
		this.setState({
			estateAllocationResult:tempResult
		});

	}
	render(){
		var estateList = this.processEstateList();
		//生成看房人员下拉名单,小技巧:用函数返回Menu，目的是为了传入参数
		const getMenu =(estateName,regionName)=>{
			return (
				<Menu onClick={({key})=>{this.handleMenuClick(key,estateName,regionName)}}>
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
										<Dropdown overlay={getMenu(item.estateName,item.regionName)}
												  getPopupContainer={() => document.getElementById('house-arrange-panel-wrap')}>
											<a>分配</a>
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
		estateSelectedIndex:state.updateEstateAllocationState.estateSelectedIndex,
		labelList:state.updateEstateAllocationState.labelList,
		labelType:state.updateEstateAllocationState.labelType
	}
};
export default  connect(mapStateToProps)(HouseArrangeAllocationSubPanel)