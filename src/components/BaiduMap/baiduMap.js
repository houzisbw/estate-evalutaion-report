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

	}
	render(){

		return(
			<div className='baidu-map' id="baiduMap"></div>
		)
	}
}
export default BaiduMap