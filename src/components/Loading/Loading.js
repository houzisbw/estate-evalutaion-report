import React from 'react';
import './index.scss'
//返回顶部按钮
class Loading extends React.Component{
	render(){
		return (
			<div className="pre-report-loading">
				<div className="pre-report-loading-inner">
					<span></span>
					<span></span>
					<span></span>
					<span></span>
					<span></span>
					<span></span>
					<span></span>
				</div>
			</div>
		)
	}
}
export default  Loading