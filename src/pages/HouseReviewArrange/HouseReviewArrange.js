/**
 * Created by Administrator on 2018/4/19.
 */
import React from 'react'
import './index.scss'
import axios from 'axios'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import {Modal,Upload,Icon} from 'antd'
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
			//地图标注label的样式
			markerLabelStyle:{
				color:'#fff',
				backgroundColor:"#2aa056",
				border:'none',
				padding:'5px',
				borderRadius:'3px',
				boxShadow:'1px 2px 1px rgba(0,0,0,.15)'
			},
			//excel上传文件是否正在读取中
			isExcelReading:false,
			//读取失败的timerid
			isReadingSuccessTimerId:null

		}
	}
	componentDidMount(){
		//加载百度地图
		let BMap = window.BMap;
		this.setState({
			map:new BMap.Map('house-position-baiduMap')
		},()=>{
			//成都市中心坐标
			this.state.map.centerAndZoom(new BMap.Point(104.070611,30.665017), 15);
			//添加缩放控件
			var opts = {type: window.BMAP_NAVIGATION_CONTROL_LARGE}
			this.state.map.addControl(new BMap.NavigationControl(opts));
			this.state.map.enableScrollWheelZoom(true);
		})
	}

	//清除地图数据
	clearMapData(){
		this.setState({
			markerList:[]
		})
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
		//设置超时提示,10s后如果读取不出来提示失败
		var tid = setTimeout(function(){
			Modal.error({
				title:'悲剧',
				content:'由于未知原因文件读取失败，请重试'
			})
		},10*1000);
		this.setState({
			isReadingSuccessTimerId:tid
		});


		//获取上传的excel文件
		var excel = input.files[0];
		var reader = new FileReader();
		var wb;
		//读取excel
		reader.readAsBinaryString(excel);
		//异步读取完成
		var self = this;
		reader.onload = function(e) {
			var data = e.target.result;
			wb = window.XLSX.read(data, {
				type: 'binary'
			});
			var jsonData = window.XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]],{header:'A'});
			//除去excel空白单元格
			jsonData = jsonData.filter(function(item){
				return item['A']
			});
			//置空value，使得二次上传相同文件有效，否则无法触发onchange事件
			input.value = '';
			//搜索配置项
			var tempLocationList = [];
			var myGeo = new window.BMap.Geocoder();
			//地址解析,用geoCoder，这里似乎并没有并发数量限制，注意如果某一行excel为空，则point也为空
			var cnt=0;
			var promiseList = []
			for(let i=0;i<jsonData.length;i++){
				var promise = new Promise(function(resolve,reject){
					myGeo.getPoint(jsonData[i]['A'], function(point){
							if (point) {
								tempLocationList.push([point,jsonData[i]['A']]);
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
			Promise.all(promiseList).then((results)=>{
				self.setState({
					isExcelReading:false
				});
				clearTimeout(self.state.isReadingSuccessTimerId)
				//在地图上标注
				for(var i=0;i<tempLocationList.length;i++){
					var point = tempLocationList[i][0];
					var labelContent = tempLocationList[i][1];
					var marker = new window.BMap.Marker(point);
					var label = new window.BMap.Label(labelContent,{offset:new window.BMap.Size(20,-2)});
					label.setStyle(self.state.markerLabelStyle)
					marker.setLabel(label);
					self.state.map.addOverlay(marker);
					tempMarkerList.push(marker);
				}

				self.setState({
					markerList:tempMarkerList
				})
			})

		}

	}


	render(){
		return (
			//百度地图容器
			<div className="house-position-map-wrapper">
				<div className="house-position-map" id="house-position-baiduMap">
				</div>
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
			</div>
		)
	}
}

//获取用户权限
const mapStateToProps = (state)=>{
	return {
		userAuth:state.updateUserAuthState.userAuth,
	}
};
export default  withRouter(connect(mapStateToProps)(HouseReviewArrange))