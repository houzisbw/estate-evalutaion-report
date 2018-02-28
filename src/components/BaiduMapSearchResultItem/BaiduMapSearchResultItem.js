/**
 * Created by Administrator on 2018/2/28.
 */
import React from 'react'
import './index.scss'
//百度地图搜索结果项，右边内容展示
class BaiduMapSearchResultItem extends React.Component{
	constructor(props){
		super(props);
	}
	render(){
		return (
			//获取props里面的data自定义属性需要加括号获取
			<div className="search-result-wrap" data-index={this.props['data-index']} onClick={this.props.onClick}>
				<div className="search-result-wrap-inner">
					<div className="search-result-inner-up">
						<div className="search-result-inner-up-left">
							<i className="fa fa-subway"></i>
							<span>{this.props.estateName}</span>
						</div>
						<div className="search-result-inner-up-right">
							<i className="fa fa-paper-plane-o"></i>
							<span>{this.props.distance}米</span>
						</div>
					</div>
					<div className="search-result-inner-down">
						<span>{this.props.address}</span>
					</div>
				</div>
			</div>
		)
	}
}
export default BaiduMapSearchResultItem