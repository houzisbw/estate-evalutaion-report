/**
 * 看房人员派单面板
 */
import React from 'react'
import './index.scss'
import {connect} from 'react-redux'
import {Switch,Tooltip,Button,List,Popconfirm,Avatar } from 'antd'
import {Element} from 'react-scroll'
class HouseArrangeAllocationSubPanel extends React.Component{
	constructor(props){
		super(props);
		this.state = {
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
			//当前选中的房地产列表项的index
			currentSelectedEstateItemIndex:-1,
			//当前选中的marker
			selectedMarker:null
		}
	}
	componentDidMount(){
		//点击地图，取消房屋列表的选中项
		this.props.baiduMap.addEventListener('click',()=>{
			if(this.state.selectedMarker){
				var label = this.state.selectedMarker.getLabel();
				label.setStyle(this.state.defaultLabelStyle)
				//恢复右侧列表avatar颜色
				this.setState({
					currentSelectedEstateItemIndex:-1
				})
			}
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
		this.setState({
			currentSelectedEstateItemIndex:estateIndex
		})

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
	render(){
		var estateList = this.processEstateList();
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
						renderItem={item => (
							//Element标签是react-scroll插件的元素，表示滚动到的目标元素，name用于srcollTo参数
							<Element name={item.estateName}>
								<List.Item actions={[
									<a onClick={()=>{this.handleAllocation(item.estateName,item.regionName)}}>分配</a>,
									<a onClick={()=>{this.handleMapPan(item.location,item.index)}}>地图</a>
								]}>
									<List.Item.Meta
										title={item.regionName}
										description={item.estateName}
										avatar={<Avatar style={this.state.currentSelectedEstateItemIndex === item.index ? {backgroundColor:'#1890ff'}:{backgroundColor:'#39ac6a'}} size="small">{item.index}</Avatar>}
									/>
								</List.Item>
							</Element>
						)}
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
		markerList:state.updateEstateAllocationState.markerList
	}
};
export default  connect(mapStateToProps)(HouseArrangeAllocationSubPanel)