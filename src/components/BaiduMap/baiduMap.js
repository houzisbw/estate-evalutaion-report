/**
 * Created by Administrator on 2018/2/27.
 */
import React from 'react'
import './index.scss'
class BaiduMap extends React.Component{
	constructor(props){
		super(props)
	}
	componentDidMount(){
		//加载百度地图
		let BMap = window.BMap;
		let map = new BMap.Map('baiduMap');
		//成都市中心坐标
		map.centerAndZoom(new BMap.Point(104.070611,30.665017), 12);
		map.enableScrollWheelZoom(true);
		map.addControl(new BMap.MapTypeControl()); //添加地图类型控件
	}
	render(){

		return(
			<div className='baidu-map' id="baiduMap"></div>
		)
	}
}
export default BaiduMap