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
	constructor(props){
		super(props);
		this.state = {
			//百度地图实例
			map:null
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
	//excel上传触发的函数
	handleExcelChange(obj){
		//获取input原生dom,不能通过obj参数获取
		let input = this.refs.fileExcel;
		if(!input.files) {
			return;
		}
		//获取上传的excel文件
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
			var jsonData = window.XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]],{header:'A'});
			//置空value，使得二次上传相同文件有效，否则无法触发onchange事件
			input.value = ''
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
								<span><i className="fa fa-upload"></i> 上传</span>
								{/*添加ref属性方便获取input的files属性*/}
								<input type="file"
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