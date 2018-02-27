/**
 * Created by Administrator on 2018/2/27.
 */
import React from 'react'
import BaiduMap from './../../BaiduMap/baiduMap'
import './index.scss'
//包商评估报告 模板
class BaoShangTemplate extends React.Component{
	constructor(props){
		super(props)
	}
	render(){
		return (
			<div>
				<div className="template-content-wrapper">
				</div>
				<div className="baidu-map-wrapper">
					<BaiduMap />
				</div>
			</div>
		)
	}
}
export default BaoShangTemplate