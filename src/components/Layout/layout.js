/**
 * Created by Administrator on 2018/2/26.
 */
import React from 'react'
import './index.scss'
import Header from './../Header/header'
class LayoutComponent extends React.Component{
	constructor(props){
		super(props)
	}
	render(){
		return (
			<div>
				{/*顶部导航条*/}
				<Header />
				{/*内容区域*/}
				{this.props.children}
			</div>
		)
	}
}
export default  LayoutComponent