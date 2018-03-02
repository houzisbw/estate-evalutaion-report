import React from 'react'
import BaiduMap from './../BaiduMap/baiduMap'
import BaiduMapSearchResultItem from './../BaiduMapSearchResultItem/BaiduMapSearchResultItem'
import { Tabs,Modal,Form,Input} from 'antd';
import {notificationPopup} from './../../util/utils'
import ReportTemplateInputArea from './../ReportTemplateInputArea/reportTemplateInputArea'
//import {findDOMNode} from 'react-dom'
import './index.scss'
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
//评估报告模板,具体的内容由props传入
class ReportTemplate extends React.Component{
	constructor(props){
		super(props);
		let BMap = window.BMap;
		this.state = {
			//主tab激活项的index
			mainTabActiveKey:'1',
			//子tab激活项的index，目的是为了每次切换主tab时重置子tab为第一项激活
			subTabActiveKey:'1',
			//已经选择的设施列表
			selectedFacilityList:[],
			//当前的图标种类
			currentIconType:'',
			//搜索结果滚动容器的domNode
			scrollDivNode:null,
			//搜索结果选中的项的index
			activeResultIndex:'',
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
			notFoundImgPath:require('./../../assets/img/icon/notFound.png'),
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
			iconTypeClassName:{
				'地铁站':'fa-subway',
				'公交站':'fa-bus',
				'幼儿园':'fa-child',
				'小学':'fa-university',
				'中学':'fa-university',
				'大学':'fa-university',
				'医院':'fa-hospital-o',
				'商场':'fa-shopping-bag',
				'超市':'fa-shopping-basket',
				'市场':'fa-shopping-basket',
				'银行':'fa-money',
				'餐厅':'fa-coffee',
				'公园':'fa-tree',
				'电影院':'fa-film',
				'健身房':'fa-soccer-ball-o',
				'体育馆':'fa-cubes'
			},
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
			,
			//测试数据
			inputTypeDataList:[
				{
					partName:'实物状况',
					data:[
						{
							itemName:'委托人',
							type:'input',
							size:'1'
						},
						{
							itemName:'房屋所有权人',
							type:'input',
							size:'1'
						},
						{
							type:'input',
							itemName:'建成年代',
							size:'1'
						},
						{
							type:'input',
							itemName:'建筑结构',
							size:'1'
						},
						{
							type:'input',
							itemName:'总楼层',
							size:'1'
						},
						{
							type:'input',
							itemName:'所在楼层',
							size:'1'
						},
						{
							type:'input',
							itemName:'几梯几户',
							size:'1'
						},
						{
							type:'input',
							itemName:'建筑面积',
							size:'1'
						},
						{
							type:'input',
							itemName:'室内层高',
							size:'1'
						},
						{
							type:'input',
							itemName:'朝向',
							size:'1'
						},
						{
							type:'input',
							itemName:'登记用途',
							size:'1'
						},
						{
							type:'input',
							itemName:'实际用途',
							size:'1'
						},
						{
							type:'input',
							itemName:'利用现状',
							size:'1'
						},
						{
							type:'input',
							itemName:'外墙',
							size:'1'
						},
						{
							type:'input',
							itemName:'噪音源',
							size:'1'
						},
						{
							type:'input',
							itemName:'维修保养',
							size:'1'
						}
						,
						{
							type:'input',
							itemName:'户型结构',
							size:'1'
						},
						{
							type:'input',
							itemName:'空间布局',
							size:'1'
						},
						{
							type:'input',
							itemName:'设施设备',
							size:'1'
						},
						{
							type:'input',
							itemName:'成新率',
							size:'1'
						},

						//////中
						{
							type:'input',
							itemName:'《房屋所有权证》证号',
							size:'2'
						},
						{
							type:'input',
							itemName:'业务件号',
							size:'2'
						},
						/////下拉选择框,大
						{
							itemName:'室内装修',
							type:'dropdown',
							dropdownData:[
								'天棚石膏板造型，刷乳胶漆；卧室：地面贴地砖，内墙、天棚刷乳胶漆；厨房、卫生间：地面铺防滑地砖，内墙贴瓷砖到顶，天棚为铝扣板吊顶。',
								'入户防盗门，室内套装木门，塑钢玻璃窗，普通灯具照明，水电设施暗敷设；客厅、卧室：地面铺木地板，内墙、天棚刷乳胶漆；厨房、卫生间：地面铺防滑地砖，内墙贴瓷砖到顶，天棚为铝扣板吊顶。'
							],
							size:'2'
						},
						{
							itemName:'所在小区概况',
							type:'dropdown',
							dropdownData:[
								'小区内部绿化环境较好，专业物业物管，设地下停车位。',
								'小区内部绿化环境整洁，小区门卫，设地面停车位。'
							],
							size:'2'
						},
						{
							itemName:'房屋产权坐落',
							type:'input',
							size:'2'
						},
						{
							itemName:'实地勘察地址',
							type:'input',
							size:'2'
						},
					]
				},
				{
					partName:'区位状况',
					data:[
						{
							itemName:'临路状况',
							type:'input',
							size:'3'
						},
						{
							itemName:'区域概况',
							type:'textarea',
							placeholder:'在下方输入小区名字，点击搜索按钮进行小区周边设施搜索，点击地图右侧搜索结果即可自动生成区域概况文字~',
							size:'3'
						},
						{
							itemName:'小区名字',
							type:'search',
							placeholder:'请输入小区名字~',
							size:'3'
						}

					]
				}
			]
		}
	}

	componentDidMount(){
		//加载百度地图
		let BMap = window.BMap;
		this.setState({
			map:new BMap.Map('baiduMap')

		},()=>{
			//成都市中心坐标
			this.state.map.centerAndZoom(new BMap.Point(104.070611,30.665017), 12);
			//添加缩放控件
			var opts = {type: window.BMAP_NAVIGATION_CONTROL_LARGE}
			this.state.map.addControl(new BMap.NavigationControl(opts));
			//this.state.map.enableScrollWheelZoom(true);
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

		})
	}
	//计算距离
	getDistance(estatePoint,markerPoint){
		return Math.ceil(this.state.map.getDistance(estatePoint,markerPoint));
	}
	//当地图上标注被点击触发的事件,单独写一个方法是为了让搜索内容条目被点击也可以触发该方法
	markerOnClick(marker,infoBox,iconActive,iconInactive,point){
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
		marker.setIcon(iconActive);
		//只能同时存在一个infoBox
		if(this.state.estateInfoBox){
			this.state.estateInfoBox.close();
		}
		this.setState({
			estateInfoBox:infoBox
		},()=>{
			infoBox.open(point);
		});
	}
	//获取信息窗口和icon,复用
	getInfoBoxAndIcons(name, distance, address){
		//注意类名里面的变量需要包在引号内
		let className = "fa font-awesome-grey "+this.state.currentIconType;
		let content = `<div class="infobox-title-wrapper">
							<div class="infobox-title-left">
								<i class="${className}"></i>
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
		//创建信息窗口
		let BMapLib = window.BMapLib;
		let BMap = window.BMap;
		let infoBox = new BMapLib.InfoBox(this.state.map, content,this.state.estateInfoBoxOption);
		//激活状态的图标
		let iconActive = new BMap.Icon(this.state.facilityMarkerActivePath, new BMap.Size(32, 32), {
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
		//返回对象
		return {
			infoBox,
			iconActive,
			iconInactive
		}
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

		let {iconActive, iconInactive, infoBox} = this.getInfoBoxAndIcons(name ,distance, address);

		//click
		marker.addEventListener('click',(e)=>{
			//防止冒泡
			e.domEvent.stopPropagation();
			this.markerOnClick(marker,infoBox, iconActive, iconInactive, point);
			//点击地图上的标注，激活内容列表的对应项，通过index来判断
			this.state.markerList.forEach((item,index)=>{
				if(marker === item){
					this.resultItemOnClick(index);
				}
			})
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
		local.searchNearby(this.state.keyword,point,1000);
	}
	//检查是否选中了搜索结果项,参数是item的名字，即设施名字
	checkItemSelected(itemName){
		//forEach无法return，必须执行完全部数据
		for(var i=0;i<this.state.selectedFacilityList.length;i++){
			if(this.state.selectedFacilityList[i] === itemName){
				return true;
			}
		}
		return false;

	}
	//清空搜索结果
	clearSearchResults(){
		if(this.state.estateInfoBox){
			this.state.estateInfoBox.close();
		}
		this.state.markerList.forEach((item)=>{
			this.state.map.removeOverlay(item);
		})
		this.setState({
			mapSearchResultList:[],
			markerList:[],
			selectedMarker:null,
			estateInfoBox:null
		})
	}

	//搜索小区
	searchEstate(){
		//清除相关数据
		this.setState({
			selectedFacilityList:[]
		});

		//清除覆盖物和结果数组
		this.state.map.clearOverlays();
		this.clearSearchResults();

		//首先获取输入地址的位置信息
		// 创建地址解析器实例
		let BMap = window.BMap;
		let myGeo = new BMap.Geocoder();
		// 将地址解析结果显示在地图上，并调整地图视野
		myGeo.getPoint(this.state._reportEstateName, (point)=>{
				if (point) {
					//通知消息提示框
					notificationPopup('恭喜~','找到'+this.state._reportEstateName+'相关信息!',4,'success');
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
	//子tab改变:第一个参数是主tab的activeIndex(从1开始)，第二个是子tab的activeIndex
	tabOnChange(mainTabActiveIndex,subTabActiveIndex){
		//获取选中的子tab名称，即为搜索关键字
		this.setState({
			keyword:this.state.tabData[mainTabActiveIndex].subTab.subTabNamesList[subTabActiveIndex-1],
			subTabActiveKey:subTabActiveIndex.toString()
		},()=>{
			this.setState({
				currentIconType:this.getIconType(this.state.keyword)
			},()=>{
				//清空之前的结果
				this.clearSearchResults();
				//搜索关键字
				this.searchPointNearby(this.state.estatePosition);
			});


		})
	}
	//主tab改变:目的是设置关键字并搜索，默认子tab第一个被激活，即是关键字
	mainTabOnChange(activeIndex){
		let activeSubTabName = this.state.tabData[activeIndex-1].subTab.subTabNamesList[0];
		this.setState({
			keyword:activeSubTabName,
			subTabActiveKey:"1"
		},()=>{
			this.setState({
				currentIconType:this.getIconType(this.state.keyword)
			});
			this.clearSearchResults();
			//搜索关键字
			this.searchPointNearby(this.state.estatePosition);
		})
	}
	getIconType(keyword){
		if(this.state.iconTypeClassName.hasOwnProperty(keyword)){
			return this.state.iconTypeClassName[keyword]
		}
		return 'fa-check-square'
	}
	resultItemOnClick(activeResultIndex){
		this.setState({
			activeResultIndex:activeResultIndex
		})
	}
	//点击搜索结果
	handleResultItemClick(e,index,title,address,distance){
		//注意这里必须用currentTarget,简单的说，e.curretnTarget是指注册了事件监听器的对象，e.target是指对象里的子对象，实际触发这个事件的对象
		//let itemIndex = e.currentTarget.getAttribute('data-index');
		//let currentTarget = e.currentTarget;
		//toggle该项是否选中
		let isSelected = this.checkItemSelected(title);
		if(isSelected){
			//找到该项在已选择列表中的位置
			let index = this.state.selectedFacilityList.indexOf(title);
			let tempList = this.state.selectedFacilityList;
			if(index !== -1){
				//删除位于index处的元素
				tempList.splice(index,1)
			}
			this.setState({
				selectedFacilityList:tempList
			})

		}else{
			let tempList = this.state.selectedFacilityList;
			tempList.push(title);
			this.setState({
				selectedFacilityList:tempList
			})
		}


		this.setState({
			activeResultIndex:index
		},()=>{
			//遍历markerList，找到对应的marker，通过marker.getTitle方法获取到title
			this.state.markerList.forEach((item)=>{
				if(item.getTitle() === title){
					//获取该marker的位置
					let point = item.getPosition();
					//获取相关信息
					let {iconActive, iconInactive, infoBox} = this.getInfoBoxAndIcons(title ,distance, address);
					//实质上点击右侧搜索结果只是触发了marker的点击函数(模拟点击)，并没有做其他的
					this.markerOnClick(item,infoBox, iconActive, iconInactive, point)
					//地图平移到目的marker中心
					this.state.map.panTo(point);
					//scroll滚动测试
					//let domNodeScrollTop = findDOMNode(this.refs.scrollDiv).scrollTop;
					// e.persist();
					// console.log(domNodeScrollTop)
					// //offsetTop是当前元素上边距和父元素的上边距的距离
					// //计算当前元素距离父容器底部的距离
					// console.log('offsettop: '+currentTarget.offsetTop)
					// console.log(currentTarget.offsetParent)

				}
			})
		})

	}
	//进行小区搜索
	searchEstateFacility(estateName){
		//判断非空
		if(!estateName){
			//未搜索到结果
			Modal.warning({
				title: '客官请注意',
				content: '小区名字不能为空~',
			});
			return;
		}
		this.setState({
			_reportEstateName:estateName,
			subTabActiveKey:'1',
			mainTabActiveKey:'1'
		},()=>{
			//测试搜索
			this.searchEstate();
		})
	}

	render(){
		let self = this;

		return (
			<div>
				<div className="template-content-wrapper">
					{/*模板标题*/}
					<div className="template-title">
						包商预评估
					</div>
					{/*表单输入框区域*/}
					<div className="template-input-area">
						{
							this.state.inputTypeDataList.map((item,index)=>{
								return (
									<div key={index}>
										{/*标题*/}
										<div className="template-input-type-title-wrapper">
											<div className="template-input-type-title">
												{item.partName}
											</div>
										</div>
										{/*输入框展示组件,传递的方法onInputSearch是搜索小区周边设施的方法*/}
										<ReportTemplateInputArea dataList={item.data} onInputSearch={(v)=>{this.searchEstateFacility(v)}}/>
									</div>
								)
							})
						}

					</div>
				</div>
				<div className="baidu-map-wrapper clearfix">
					{/*百度地图*/}
					<div className="baidu-map-container">
						<BaiduMap />
					</div>
					{/*百度地图查询结果显示*/}
					<div className="baidu-map-search-container">
						<Tabs defaultActiveKey="1"  className="main-tab-resize" type="card" onChange={(activeIndex)=>{this.mainTabOnChange(activeIndex)}}>
							{
								this.state.tabData.map((item,index)=>{
									return (
										<TabPane key={(index+1).toString()} tab={item.mainTabName}>
											{/*子tab,activeKey重置切换主tab后的子tab为第一个，防止tab和内容不匹配*/}
											<Tabs defaultActiveKey="1" activeKey={this.state.subTabActiveKey} className="sub-tab-resize" size="small" onChange={(subActiveKey)=>{this.tabOnChange(index,subActiveKey)}}>
												{
													item.subTab.subTabNamesList.map((subItem,subIndex)=>{
														return (
															<TabPane tab={subItem} key={(subIndex+1).toString()}>
																{/*该div控制内容显示最大高度，超出就出现滚动轴*/}
																<div ref='scrollDiv' className="sub-tab-content-container">
																	{
																		this.state.mapSearchResultList.length > 0 ?
																		this.state.mapSearchResultList.map((item,index)=>{
																			let distance = this.getDistance(this.state.estatePosition, item.position);
																			return (
																				//注意自定义属性必须是data-xxx格式
																				<BaiduMapSearchResultItem key={index}
																										  activeClass={index === this.state.activeResultIndex ? 'search-result-wrap-active':''}
																										  activeBorderClass={index === this.state.activeResultIndex ? 'search-result-wrap-border-active':''}
																										  itemSelected={this.checkItemSelected(item.title)}
																										  data-index={index}
																										  iconType={this.state.currentIconType}
																										  estateName={item.title}
																										  distance={distance}
																										  onClick={(e)=>{self.handleResultItemClick(e,index,item.title,item.address, distance)}}
																										  address={item.address}
																				/>
																			)
																		}): (
																				<div className="search-result-empty-wrapper">
																					<div className="search-result-empty-img">
																						<img src={this.state.notFoundImgPath} alt="图片"/>
																					</div>
																			 	</div>
																			)
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