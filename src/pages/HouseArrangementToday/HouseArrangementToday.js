/**
 * 今日看房情况页面
 */

import React from 'react'
import './index.scss'
class HouseArrangementToday extends React.Component{
	constructor(props){
		super(props);
		this.state = {};
	}
	render(){
		return (
				<div className="my-page-wrapper">
					<div className="page-title">
						<div className="template-desc">
							<i className="fa fa-briefcase padding-right"></i>
							<span>最近一次看房情况</span>
						</div>
					</div>
					<div className="template-content">

					</div>
				</div>
		)
	}
}
export default  HouseArrangementToday
