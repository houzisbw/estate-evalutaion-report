import React from 'react'
import BaiduMap from './../BaiduMap/baiduMap'
import BaiduMapSearchResultItem from './../BaiduMapSearchResultItem/BaiduMapSearchResultItem'
import { Tabs,Modal } from 'antd';
import './index.scss'
const TabPane = Tabs.TabPane;
//评估报告模板,具体的内容由props传入
class ReportTemplate extends React.Component{
	constructor(props){
		super(props);
		let BMap = window.BMap;
		this.state = {
			//房地产坐标点
			estatePosition:null,
			//marker容器
			markerList:[],
			//选中的marker
			selectedMarker:null,
			//infoBox：用户展示设施信息
			estateInfoBox:null,
			estateInfoBoxOption:{
				boxStyle:{
					width:"280px",
					minHeight:"90px",
					background:"#fff",
					padding:"20px",
					boxShadow:"0 0 5px rgba(0,0,0,0.3)",
					position:'relative'
				},
				closeIconUrl:require('./../../assets/img/infoWindowClose.jpg'),
				offset : new BMap.Size(0, 35)
			},
			//房地产marker图标路径
			estateMarkerPath:require('./../../assets/img/icon/estateMarker.png'),
			//鼠标点击或者悬浮时的marker图标路径
			facilityMarkerActivePath:require('./../../assets/img/icon/facilityMarkerActive.png'),
			facilityMarkerPath:require('./../../assets/img/icon/facilityMarker.png'),
			//百度地图实例
			map:null,
			//预评估城市
			assesmentCity:'成都市',
			//预评估报告字段
			_reportEstateName:'翰林南城',



			//百度地图搜索关键字,选择子tab确定关键字,默认是第一个tab的第一个子tab
			keyword:'地铁站',
			//百度地图搜索结果列表
			mapSearchResultList:[],
			tabData:[
				{
					mainTabName:'交通',
					subTab:{
						subTabNamesList:['地铁站','公交站']
					}
				},
				{
					mainTabName:'教育',
					subTab:{
						subTabNamesList:['幼儿园','小学','中学','大学']
					}
				},
				{
					mainTabName:'医疗',
					subTab:{
						subTabNamesList:['医院']
					}
				},
				{
					mainTabName:'购物',
					subTab:{
						subTabNamesList:['商场','超市','市场']
					}
				},
				{
					mainTabName:'生活',
					subTab:{
						subTabNamesList:['银行','餐厅']
					}
				},
				{
					mainTabName:'娱乐',
					subTab:{
						subTabNamesList:['公园','电影院','健身房','体育馆']
					}
				},
				{
					mainTabName:'补丁',
					subTab:{
						subTabNamesList:[]
					}
				}
			]
		}
	}

	componentDidMount(){
		//加载百度地图
		let BMap = window.BMap;
		let BMapLib = window.BMapLib;
		this.setState({
			map:new BMap.Map('baiduMap')

		},()=>{
			//成都市中心坐标
			this.state.map.centerAndZoom(new BMap.Point(104.070611,30.665017), 12);
			this.state.map.enableScrollWheelZoom(true);
			//点击地图关闭infoBox
			this.state.map.addEventListener('click',()=>{
				var iconInactive = new BMap.Icon(this.state.facilityMarkerPath, new BMap.Size(32, 32), {
					anchor: new BMap.Size(10, 25)
				});
				//如果已选择的marker存在则置为null
				if(this.state.selectedMarker){
					this.state.selectedMarker.setIcon(iconInactive);
					this.setState({
						selectedMarker:null
					});
				}
				if(this.state.estateInfoBox){
					this.state.estateInfoBox.close();
				}
			});
			//测试搜索
			this.searchEstate();
		})
	}
	//计算距离
	getDistance(estatePoint,markerPoint){
		return Math.ceil(this.state.map.getDistance(estatePoint,markerPoint));
	}
	//添加标注，icon自定义
	addMarker(point,iconPath,name,address){
		let BMap = window.BMap;
		var myIcon = new BMap.Icon(iconPath, new BMap.Size(32, 32), {
			// 指定定位位置。
			// 当标注显示在地图上时，其所指向的地理位置距离图标左上
			// 角各偏移10像素和25像素。您可以看到在本例中该位置即是
			// 图标中央下端的尖角位置。
			anchor: new BMap.Size(10, 25)
		});
		//计算该点到房地产中心距离
		let distance = this.getDistance(this.state.estatePosition, point);
		// 创建标注对象并添加到地图
		var marker = new BMap.Marker(point, {icon: myIcon});
		//创建信息窗口
		var BMapLib = window.BMapLib;
		//这是模板字符串,是infoBox里面的内容
		var content =  `<div class="infobox-title-wrapper">
							<div class="infobox-title-left">
								<i class="fa fa-subway font-awesome-grey"></i>
								<span class="infobox-title-word">${name}</span>
							</div>
							<div class="infobox-title-right">
								<i class="fa fa-paper-plane-o font-awesome-grey"></i>
								<span class="infobox-title-word">${distance}米</span>
							</div>
						</div>
						<div class="infobox-content">
							地址: ${address}
						</div>
						<div class="triangle-down"></div>`;
		var infoBox = new BMapLib.InfoBox(this.state.map, content,this.state.estateInfoBoxOption);
		//激活状态的图标
		var iconActive = new BMap.Icon(this.state.facilityMarkerActivePath, new BMap.Size(32, 32), {
			// 指定定位位置。
			// 当标注显示在地图上时，其所指向的地理位置距离图标左上
			// 角各偏移10像素和25像素。您可以看到在本例中该位置即是
			// 图标中央下端的尖角位置。
			anchor: new BMap.Size(10, 25)
		});
		//非激活状态的图标
		var iconInactive = new BMap.Icon(this.state.facilityMarkerPath, new BMap.Size(32, 32), {
			// 指定定位位置。
			// 当标注显示在地图上时，其所指向的地理位置距离图标左上
			// 角各偏移10像素和25像素。您可以看到在本例中该位置即是
			// 图标中央下端的尖角位置。
			anchor: new BMap.Size(10, 25)
		});
		//click
		marker.addEventListener('click',(e)=>{
			this.setState({
				selectedMarker:marker
			},()=>{
				//消除之前的marker激活标记,遍历之前全部marker
				this.state.markerList.forEach((item)=>{
					if(item !== marker){
						item.setIcon(iconInactive)
					}
				})
			});

			//防止冒泡
			e.domEvent.stopPropagation();
			marker.setIcon(iconActive);
			//只能同时存在一个infoBox
			if(this.state.estateInfoBox){
				this.state.estateInfoBox.close();
			}
			this.state.estateInfoBox = infoBox;
			infoBox.open(point);
		});
		//mouseover
		marker.addEventListener('mouseover',(e)=>{
			marker.setIcon(iconActive);
		});
		//mouseout
		marker.addEventListener('mouseout',(e)=>{
			//如果当前的marker不是已经选中的marker，则恢复图标为inactive
			if(marker !== this.state.selectedMarker){
				marker.setIcon(iconInactive);
			}
		});
		//设置title
		marker.setTitle(name);

		this.state.markerList.push(marker);
		this.state.map.addOverlay(marker);

	}
	//搜索小区附近的设施
	searchPointNearby(point){
		//搜索local对象实例
		let BMap = window.BMap;
		let local = new BMap.LocalSearch(this.state.map,
			{
				//每页容量,在地图上一次展示的数量
				pageCapacity:10,
				//搜索结束，展示结果(多关键字检索:results是数组,每个元素是LocalResult)
				onSearchComplete:(results)=>{
					//检索成功
					if (local.getStatus() === 0){
						let tempResultList = [];
						for(var j=0;j<results.getCurrentNumPois();j++){
							tempResultList.push({
								title:results.getPoi(j).title,
								position:results.getPoi(j).point,
								url:results.getPoi(j).url,
								address:results.getPoi(j).address
							});
						}

						this.setState({
							mapSearchResultList:tempResultList
						},()=>{
							//添加marker
							this.state.mapSearchResultList.forEach((item)=>{
								this.addMarker(item.position, this.state.facilityMarkerPath, item.title,item.address)
							})
						})


					}
				}
			});

		//第一个参数是关键字(此处为数组，多关键字搜索)，第二个是搜索中心，第三个是半径
		local.searchNearby('网吧',point,1000);
	}
	//搜索小区
	searchEstate(){
		//清除覆盖物和结果数组
		this.state.map.clearOverlays();
		this.state.mapSearchResultList = [];
		this.state.markerList = [];
		//首先获取输入地址的位置信息
		// 创建地址解析器实例
		let BMap = window.BMap;
		let myGeo = new BMap.Geocoder();
		// 将地址解析结果显示在地图上，并调整地图视野
		myGeo.getPoint(this.state._reportEstateName, (point)=>{
				if (point) {
					//保存坐标点
					this.setState({
						estatePosition:point
					});
					this.state.map.centerAndZoom(point, 16);
					//添加文字说明
					var label = new BMap.Label(this.state._reportEstateName);
					label.setStyle({
						transform:'translate(-35%,90%)',
						padding:'10px 10px',
						backgroundColor:'#3d80ff',
						color:'#fff',
						border:'none',
						borderRadius:'3px'
					})
					var marker  = new BMap.Marker(point);
					marker.setLabel(label);
					this.state.map.addOverlay(marker);
					//根据坐标点搜索附近的设施(不能直接使用searchNearby,因为center是字符串的话半径被忽略)
					this.searchPointNearby(point);
				}else{
					//未搜索到结果
					Modal.warning({
						title: '客官请注意',
						content: '没有找到相关小区信息，请重新搜索~',
					});
				}
			},
			this.state.assesmentCity);
	}
	//子tab改变:第一个参数是主tab的activeIndex，第二个是子tab的activeIndex
	tabOnChange(mainTabActiveIndex,subTabActiveIndex){
		//获取选中的子tab名称，即为搜索关键字
		this.setState({
			keyword:this.state.tabData[mainTabActiveIndex].subTab.subTabNamesList[subTabActiveIndex-1]
		},()=>{
			//搜索关键字
		})
	}
	//主tab改变:目的是设置关键字并搜索，默认子tab第一个被激活，即是关键字
	mainTabOnChange(activeIndex){
		let activeSubTabName = this.state.tabData[activeIndex-1].subTab.subTabNamesList[0];
		this.setState({
			keyword:activeSubTabName
		},()=>{
			//搜索关键字
		})
	}
	//点击搜索结果
	handleResultItemClick(e){
		//注意这里必须用currentTarget,简单的说，e.curretnTarget是指注册了事件监听器的对象，e.target是指对象里的子对象，实际触发这个事件的对象
		let itemIndex = e.currentTarget.getAttribute('data-index');
		console.log(itemIndex)
	}
	render(){
		let self = this;
		return (
			<div>
				<div className="template-content-wrapper">
					{/*{this.props.templateName}*/}
				</div>
				<div className="baidu-map-wrapper">
					{/*百度地图*/}
					<div className="baidu-map-container">
						<BaiduMap />
					</div>
					{/*百度地图查询结果显示*/}
					<div className="baidu-map-search-container">
						<Tabs className="main-tab-resize" type="card" onChange={(activeIndex)=>{this.mainTabOnChange(activeIndex)}}>
							{
								this.state.tabData.map((item,index)=>{
									return (
										<TabPane key={(index+1).toString()} tab={item.mainTabName}>
											{/*子tab*/}
											<Tabs defaultActiveKey="1" className="sub-tab-resize" size="small" onChange={(subActiveKey)=>{this.tabOnChange(index,subActiveKey)}}>
												{
													item.subTab.subTabNamesList.map((subItem,subIndex)=>{
														return (
															<TabPane tab={subItem} key={(subIndex+1).toString()}>
																{/*该div控制内容显示最大高度，超出就出现滚动轴*/}
																<div className="sub-tab-content-container">
																	{
																		this.state.mapSearchResultList.map((item,index)=>{
																			let distance = this.getDistance(this.state.estatePosition, item.position)
																			return (
																				//注意自定义属性必须是data-xxx格式
																				<BaiduMapSearchResultItem key={index}
																										  data-index={index}
																										  estateName={item.title}
																										  distance={distance}
																										  onClick={(e)=>{self.handleResultItemClick(e)}}
																										  address={item.address}
																				/>
																			)
																		})
																	}


																</div>
															</TabPane>
														)
													})
												}
											</Tabs>
										</TabPane>
									)
								})
							}

						</Tabs>
					</div>
				</div>
			</div>
		)
	}
}
export default ReportTemplate