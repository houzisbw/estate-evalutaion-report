/**
 * Created by Administrator on 2018/4/19.
 */
import React from 'react'
import './index.scss'
import axios from 'axios'
import store from './../../store/store'
import { bindActionCreators } from 'redux'
//react滚动插件,scroller用于滚动到element处,可以不用link
import {scroller} from 'react-scroll'
//动画库
import {Motion,spring} from 'react-motion'
//actions
import {UpdateEstateAllocationList,
		SaveBaiduMapInstance,
		SaveMapEstateMarker,
		UpdateMarkerLabelType,
		UpdateEstateListSelectedIndex,
		UpdateMapEstateLabel} from './../../store/actions/estateAllocation'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import {Modal,Icon,Button,Tooltip,Radio} from 'antd'
import HouseArrangePanel from './../../components/HouseArrangePanel/HouseArrangePanel'
const RadioGroup = Radio.Group;
class HouseReviewArrange extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			//百度地图实例
			map: null,
			//搜索结果的坐标数组
			locationList: [],
			//地图标注的marker数组
			markerList:[],
			//地图标注的label数组
			labelList:[],
			//地图标注label的样式
			markerLabelStyle:{
				display:'block',
				color:'#fff',
				backgroundColor:"#2aa056",
				border:'none',
				padding:'5px',
				borderRadius:'3px',
				boxShadow:'1px 2px 1px rgba(0,0,0,.15)'
			},
			highLightLabelStyle:{
				backgroundColor:'#1890ff',
				display:'block',
				color:'#fff',
				border:'none',
				padding:'5px',
				borderRadius:'3px',
				boxShadow:'1px 2px 1px rgba(0,0,0,.15)'
			},
			//excel上传文件是否正在读取中
			isExcelReading:false,
			//读取失败的timerid
			isReadingSuccessTimerId:null,
			//地图标注文本的显示
			showMarkerLabel:true,
			//右下角radiobutton显示与否的flag
			radioButtonVisible:false,
			//选择的是哪一个radioButton，控制地图标签类型显示,1是序号，2是小区名
			markerType:1,
			//右侧派单面板是否展开的标志
			isAllocationPanelOpen:false,
			//默认marker的icon
			defaultIcon:null,
			//用户是否上传了新的excel文件
			isEstateListUpdated:false,

			//折线覆盖物
			polyline:null,
			polyPointArray:[],
			lastPolyLine:null,

			//是否处于画圈派单状态
			isInDrawingMode:false,
			//是否处于画圈派单中鼠标按下状态
			isInMouseDown:false,
			//默认鼠标样式
			defaultCursorStyle:'',
			//画圈完成后生成的多边形
			ploygonAfterDraw:null

		}
	}
	//toggle右侧派单面板
	toggleAllocationPanelOpen(){
		this.setState({
			isAllocationPanelOpen:!this.state.isAllocationPanelOpen
		})
	}

	componentDidMount(){
		//加载百度地图
		let BMap = window.BMap;
		let self = this;
		this.setState({
			//禁用地图可点击功能
			map:new BMap.Map('house-position-baiduMap',{enableMapClick:false})
		},()=>{
			//成都市中心坐标
			this.state.map.centerAndZoom(new BMap.Point(104.070611,30.665017), 15);
			//添加缩放控件
			var opts = {type: window.BMAP_NAVIGATION_CONTROL_LARGE}
			this.state.map.addControl(new BMap.NavigationControl(opts));
			this.state.map.enableScrollWheelZoom(true);
			//设置默认鼠标样式
			this.setState({
				defaultCursorStyle:this.state.map.getDefaultCursor()
			});
			//添加鼠标移动事件，触发画线
			this.state.map.addEventListener('mousemove',function(e){
				//如果处于鼠标按下状态才能画线
				if(self.state.isInMouseDown){
					self.state.polyPointArray.push(e.point);
					self.setState({
						polyPointArray:self.state.polyPointArray
					},()=>{
						//除去上次的画线
						if(self.state.lastPolyLine){
							self.state.map.removeOverlay(self.state.lastPolyLine)
						}
						let polylineOverlay = new window.BMap.Polyline(self.state.polyPointArray,{
							strokeColor:'#00ae66',
							strokeOpacity:1
						});
						//添加新的画线
						self.state.map.addOverlay(polylineOverlay);
						self.setState({
							lastPolyLine:polylineOverlay
						})
					});
				}
			});
			//给地图设置鼠标按下事件
			this.state.map.addEventListener('mousedown',(e)=> {
				//如果处于派单状态下
				if(this.state.isInDrawingMode){
					this.setState({
						isInMouseDown:true,
						polyPointArray:[],
						lastPolyLine:null
					})
				}
			});
			//给地图设置鼠标抬起事件
			this.state.map.addEventListener('mouseup',(e)=> {
				//如果处于派单状态下
				if(this.state.isInDrawingMode){
					//如果处于画线状态下
					if(this.state.isInMouseDown){
						//退出画线状态
						this.setState({
							isInMouseDown:false
						});
						//添加多边形覆盖物,设置为禁止点击
						var polygonAfterDraw = new window.BMap.Polygon(this.state.polyPointArray,{
							strokeColor:'#00ae66',
							strokeOpacity:1,
							fillColor:'#00ae66',
							fillOpacity:0.3,
							enableClicking:false
						});
						this.state.map.addOverlay(polygonAfterDraw);
						//保存多边形,用于后续删除该多边形
						this.setState({
							ploygonAfterDraw:polygonAfterDraw
						})
						//计算房屋对于多边形的包含情况
						this.caculateEstateContainedInPolygon(polygonAfterDraw);
					}
				}
			});
			//保存map实例到redux
			this.props.saveBaiduMapInstance(this.state.map)
		})
	}

	//计算多边形包含房屋的数量
	caculateEstateContainedInPolygon(polygon){
		//得到多边形的点数组
		var pointArray = polygon.getPath();
		//获取多边形的外包矩形
		var bound = polygon.getBounds();
		//在多边形内的点的数组
		var pointInPolygonArray = [];
		//计算每个点是否包含在该多边形内
		for(var i=0;i<this.state.markerList.length;i++){
			//该marker的坐标点
			var markerPoint = this.state.markerList[i].getPosition();
			if(this.isPointInPolygon(markerPoint,bound,pointArray)){
				pointInPolygonArray.push(this.state.markerList[i])
			}
		}

		//测试
		for(var i=0;i<pointInPolygonArray.length;i++){
			console.log(pointInPolygonArray[i].getLabel().getContent())
		}

	}
	//判定一个点是否包含在多边形内
	isPointInPolygon(point,bound,pointArray){
		//首先判断该点是否在外包矩形内，如果不在直接返回false
		if(!bound.containsPoint(point)){
			return false;
		}
		//如果在外包矩形内则进一步判断
		//该点往右侧发出的射线和矩形边交点的数量,若为奇数则在多边形内，否则在外
		var crossPointNum = 0;
		for(var i=0;i<pointArray.length;i++){
			//获取2个相邻的点
			var p1 = pointArray[i];
			var p2 = pointArray[(i+1)%pointArray.length];
			//如果点相等直接返回true
			if((p1.lng===point.lng && p1.lat===point.lat)||(p2.lng===point.lng && p2.lat===point.lat)){
				return true
			}
			//如果point在2个点所在直线的下方则continue
			if(point.lat < Math.min(p1.lat,p2.lat)){
				continue;
			}
			//如果point在2个点所在直线的上方则continue
			if(point.lat > Math.max(p1.lat,p2.lat)){
				continue;
			}
			//有相交情况:2个点一上一下,计算交点
			//特殊情况2个点的横坐标相同
			var crossPointLng;
			if(p1.lng === p2.lng){
				crossPointLng = p1.lng;
			}else{
				//计算2个点的斜率
				var k = (p2.lat - p1.lat)/(p2.lng - p1.lng);
				//得出水平射线与这2个点形成的直线的交点的横坐标
				crossPointLng = (point.lat - p1.lat)/k + p1.lng;
			}
			//如果crossPointLng的值大于point的横坐标则算交点(因为是右侧相交)
			if(crossPointLng > point.lng){
				crossPointNum++;
			}

		}
		//如果是奇数个交点则点在多边形内
		return crossPointNum%2===1

	}
	//清除地图数据
	clearMapData(){
		this.setState({
			markerList:[],
			locationList:[],
			labelList:[]
		})
		this.state.map.clearOverlays();
	}

	//设置所有marker的label种类
	setMarkerLabel(labelType){
		if(labelType===2){
			//序号
			this.state.labelList.forEach((v)=>{
				for(var i=0;i<this.state.locationList.length;i++){
					var point = this.state.locationList[i][0];
					var content = this.state.locationList[i][1]['A'];
					var pos = v.getPosition();
					//对应的分配到的人员名字
					let tempObj  = this.props.allocationResultObj[this.state.locationList[i][1]['B']];
					let allocatedStaffName  = tempObj?tempObj.staffName:'';
					//如果2者位置相同则找到对应的label
					if(pos.lng === point.lng && pos.lat === point.lat){
						v.setContent(content+(allocatedStaffName?' ['+allocatedStaffName+']':''));
						break;
					}
				}
			})
		}else{
			//地名
			this.state.labelList.forEach((v,idx)=>{
				for(var i=0;i<this.state.locationList.length;i++){
					var point = this.state.locationList[i][0];
					var content = this.state.locationList[i][1]['B'];
					var pos = v.getPosition();
					if(pos.lng === point.lng && pos.lat === point.lat){
						v.setContent(content)
						break;
					}
				}
			})
		}
	}

	//excel上传触发的函数
	handleExcelChange(obj){
		//清除地图数据
		this.clearMapData()
		//获取input原生dom,不能通过obj参数获取
		let input = this.refs.fileExcel;
		if(!input.files) {
			return;
		}
		//文件读取中
		this.setState({
			isExcelReading:true
		});
		var self = this;
		//设置超时提示,10s后如果读取不出来提示失败
		var tid = setTimeout(function(){
			self.setState({
				isExcelReading:false
			});
			Modal.error({
				title:'悲剧',
				content:'由于未知原因文件读取失败，请重试'
			})
		},10*1000);
		this.setState({
			isReadingSuccessTimerId:tid
		});

		//获取上传的excel文件,A列是序号，B列是地址
		var excel = input.files[0];
		var reader = new FileReader();
		var wb;
		//读取excel
		reader.readAsBinaryString(excel);
		//异步读取完成
		reader.onload = function(e) {
			var data = e.target.result;
			wb = window.XLSX.read(data, {
				type: 'binary'
			});
			//headerA是将excel的表头字母作为key
			var jsonData = window.XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]],{header:'A'});
			//除去excel空白单元格以及所有的空白
			jsonData = jsonData.filter(function(item){
				return item['B'] && item['A']
			});
			//置空value，使得二次上传相同文件有效，否则无法触发onchange事件
			input.value = '';
			//搜索配置项
			var tempLocationList = [];
			var myGeo = new window.BMap.Geocoder();
			//地址解析,用geoCoder，这里似乎并没有并发数量限制，注意如果某一行excel为空，则point也为空
			var cnt=0;
			var promiseList = [];
			for(let i=0;i<jsonData.length;i++){
				//除去字符串中所有空格
				jsonData[i]['A'] = jsonData[i]['A'].replace(/\s/g,'');
				jsonData[i]['B'] = jsonData[i]['B'].replace(/\s/g,'');
				var promise = new Promise(function(resolve,reject){
					myGeo.getPoint(jsonData[i]['B'], function(point){
							if (point) {
								tempLocationList.push([point,jsonData[i]]);
								cnt++;
							}
							resolve()
						},
						"成都市");
				});
				promiseList.push(promise);
			}
			//等待所有异步请求都完成
			var tempMarkerList = [];
			var tempLabelList = [];
			Promise.all(promiseList).then((results)=>{
				self.setState({
					isExcelReading:false
				});
				clearTimeout(self.state.isReadingSuccessTimerId)
				//在地图上标注
				for(let i=0;i<tempLocationList.length;i++){
					let point = tempLocationList[i][0];
					//b作为key才是地址,a是序号
					let labelContent = self.state.markerType===1?tempLocationList[i][1]['B']:tempLocationList[i][1]['A'];
					let marker = new window.BMap.Marker(point);
					//给marker添加点击事件,传入labelContent，注意闭包

					marker.addEventListener('click',function(e){
						e.domEvent.stopPropagation();
						//滚动目标的name
						let scrollTargetName = labelContent;
						//滚动到目标元素,containerId是滚动区域容器的id
						//注意这里的offset表示滚动到元素位置+offset的位置，方向朝下，
						scroller.scrollTo(scrollTargetName, {
							duration: 500,
							smooth: true,
							containerId: 'house-arrange-panel-wrap',
							offset: -200,
						});

						//动画
						this.setAnimation(window.BMAP_ANIMATION_BOUNCE)
						self.state.markerList.forEach((markerItem)=>{
							//其余marker取消动画
							if(markerItem!==marker){
								markerItem.setAnimation(null)
							}
						});

						//房屋列表选中项也要高亮,list是保存在redux中
						self.props.estateDataList.forEach((item)=>{
							if(item.estateName === labelContent){
								//通过更新redux数据来使得房屋列表组件数据更新
								self.props.updateEstateListSelectedIndex(item.index)
							}
						})
					});

					let label = new window.BMap.Label(labelContent,{offset:new window.BMap.Size(20,-2)});
					label.setStyle(self.state.markerLabelStyle);
					tempLabelList.push(label);
					marker.setLabel(label);
					self.state.map.addOverlay(marker);
					tempMarkerList.push(marker);
				}
				//更新redux房屋列表数据,便于其他组件获取
				self.props.updateEstateAllocationList(tempLocationList);
				//更新marker到redux
				self.props.saveMapEstateMarker(tempMarkerList);
				//更新label到redux
				self.props.updateMapEstateLabel(tempLabelList);
				self.setState({
					markerList:tempMarkerList,
					labelList:tempLabelList,
					locationList:tempLocationList,
					isEstateListUpdated:!self.state.isEstateListUpdated
				})
			})

		}

	}

	//显示/隐藏地图标注文本
	handleToggleLabelShow(){
		//隐藏label
		if(this.state.showMarkerLabel){
			this.state.labelList.forEach((value)=>{
				value.setStyle({
					display:'none'
				})
			});
			this.setState({
				showMarkerLabel:false
			})
		}else{
			//显示label
			this.state.labelList.forEach((value)=>{
				value.setStyle(this.state.markerLabelStyle)
			});
			this.setState({
				showMarkerLabel:true
			})
		}
	}
	handleRadioButtonMouseover(){
		this.setState({
			radioButtonVisible:true
		})
	}
	handleRadioButtonMouseout(){
		this.setState({
			radioButtonVisible:false
		})
	}
	handleRadioButtonChange(e){
		var type = parseInt(e.target.value,10);
		if(type === 1){
			this.props.updateMarkerLabelType('ESTATE_NAME')
		}else{
			this.props.updateMarkerLabelType('ESTATE_INDEX')
		}
		this.setState({
			markerType:type
		},()=>{
			this.setMarkerLabel(this.state.markerType)
		});
	}
	//画圈派单按钮
	toggleDrawCircleArrange(e){
		//如果不是处于画圈状态,则跳转到画圈状态，禁用地图缩放移动
		if(!this.state.isInDrawingMode){
			this.state.map.disableDragging();
			this.state.map.disableScrollWheelZoom();
			this.state.map.disableDoubleClickZoom();
			this.state.map.disableKeyboard();
			this.state.map.setDefaultCursor("url("+require('./../../assets/img/icon/pen.cur')+"),default");
		}else{
			this.state.map.enableDragging();
			this.state.map.enableScrollWheelZoom();
			this.state.map.enableDoubleClickZoom();
			this.state.map.enableKeyboard();
			this.state.map.setDefaultCursor(this.state.defaultCursorStyle);
		}
		this.setState({
			isInDrawingMode:!this.state.isInDrawingMode
		})
	}
	//重新画圈
	handleRedraw(){

	}
	render(){
		return (
			//百度地图容器
			<div className="house-position-map-wrapper">
				<div className="house-position-map" id="house-position-baiduMap">
				</div>
				{/*右侧分配人员的面板*/}
				<HouseArrangePanel togglePanel={()=>{this.toggleAllocationPanelOpen()}}
								   isEstateListUpdated={this.state.isEstateListUpdated}
								   isOpen={this.state.isAllocationPanelOpen}/>
				{/*右侧栏操作区域*/}
				<div className="right-side-map-operation-wrapper">
					{/*文件上传区域，上传excel,注意这里不上传到服务器，只是前端读取excel内容*/}
					<div className="right-size-map-operation-block right-size-map-operation-block-file">
						<div className="right-size-map-operation-block-title">
							<i className="fa fa-file-excel-o"></i>
							<span className="right-size-map-operation-block-title-word">房屋地址Excel上传</span>
						</div>
						<div className="right-size-map-operation-block-content">
							<span className="fileinput-button">
								{
									this.state.isExcelReading?(
										<span>读取中...</span>
									):(<span><i className="fa fa-upload"></i> 上传</span>)
								}
								{/*添加ref属性方便获取input的files属性*/}
								<input type="file"
									   disabled={this.state.isExcelReading}
									   ref = 'fileExcel'
									   onChange={(e)=>{this.handleExcelChange(e)}}
									   accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
								/>
							</span>
						</div>
					</div>
				</div>
				{/*左下角画圈派单的区域,这里进入画圈状态时需要隐藏地图上其他按钮*/}
				<div className="map-left-bottom-button-area">
					{
						this.state.isInDrawingMode?(
							<div>
								<Tooltip title="退出画圈派单">
									<Button icon="close"
											style={{marginRight:'10px'}}
											type="primary"
											shape="circle"
											onClick={(e)=>{this.toggleDrawCircleArrange(e)}}
											size="large"/>
								</Tooltip>
								<Tooltip title="重新画圈">
									<Button icon="sync"
											style={{marginRight:'10px'}}
											type="primary"
											shape="circle"
											onClick={(e)=>{this.handleRedraw(e)}}
											size="large"/>
								</Tooltip>
							</div>
						):(
							<Tooltip title="画圈派单">
								<Button icon="edit"
										type="primary"
										shape="circle"
										onClick={(e)=>{this.toggleDrawCircleArrange(e)}}
										size="large"/>
							</Tooltip>
						)
					}

				</div>
				{/*隐藏/显示地图标注label的按钮*/}
				{/*动画效果是动态添加类触发transition*/}
				<Motion style={{x:spring(this.state.isAllocationPanelOpen?-350:0)}}>
					{
						({x}) => (
							<div className="map-right-bottom-button-area" style={{
								transform: `translateX(${x}px)`
							}}>
								{/*注意，over和out事件都得放外层，因为其子元素都可以触发这2个事件*/}
								<div className="map-right-bottom-button"
									 onMouseOut={()=>{this.handleRadioButtonMouseout()}}
									 onMouseOver={()=>{this.handleRadioButtonMouseover()}}>
									<Button type="primary"
											shape="circle"
											icon="eye-o"
											size="large"
											title="点击隐藏/显示地图标注的文本"
											onClick={()=>{this.handleToggleLabelShow()}}
									/>
										<div className={`marker-label-type-select ${this.state.radioButtonVisible ? 'marker-label-type-select-active' : ''}`}>
											<RadioGroup onChange={(e) => {
												this.handleRadioButtonChange(e)
											}}
														className={this.state.radioButtonVisible ? 'marker-radio-button-active' : 'marker-radio-button-inactive'}
														value={this.state.markerType}>
												<Radio value={1}>小区名</Radio>
												<Radio value={2}>序号</Radio>
											</RadioGroup>
										</div>
								</div>
							</div>
						)
					}
				</Motion>
			</div>
		)
	}
}

//获取用户权限
const mapStateToProps = (state)=>{
	return {
		userAuth:state.updateUserAuthState.userAuth,
		estateDataList:state.updateEstateAllocationState.estateDataList,
		estateList:state.updateEstateAllocationState.estateList,
		allocationResultObj:state.updateEstateAllocationState.allocationResultObj
	}
};
//组件里面可直接使用props更新redux，不用import store
const mapDispatchToProps = {} = (dispatch,ownProps)=>{
	return bindActionCreators({
		saveBaiduMapInstance: (state)=>SaveBaiduMapInstance(state),
		updateMarkerLabelType: (type)=>UpdateMarkerLabelType(type),
		updateEstateListSelectedIndex:(index)=>UpdateEstateListSelectedIndex(index),
		updateEstateAllocationList:(list)=>UpdateEstateAllocationList(list),
		saveMapEstateMarker:(marker)=>SaveMapEstateMarker(marker),
		updateMapEstateLabel:(labelList)=>UpdateMapEstateLabel(labelList)
	}, dispatch);
};
export default  withRouter(connect(mapStateToProps,mapDispatchToProps)(HouseReviewArrange))