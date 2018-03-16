/**
 * Created by Administrator on 2018/3/13.
 */
import React from 'react';
import './index.scss'
//返回顶部按钮
class BackToTop extends React.Component{
	//返回顶部
	handleBackToTop(){
		//window的方法将页面滚动到指定的位置:x,y
		window.scrollTo(0,0)
	}

	render(){
		return (
			<div className="back-to-top-wrapper" onClick={()=>this.handleBackToTop()}>
			</div>
		)
	}
}
export default  BackToTop