/**
 * 房屋excel内容列表组件，用于[当天看房情况]模块
 */
import React from 'react';
import {List,Card,Tag} from 'antd';
import './index.scss'
class HouseArrangeExcelContentList extends React.Component{
	constructor(props){
		super(props);
		this.state = {}
	}
	render(){
		//卡片标题ReactNode
		const TitleNode = (index,isVisit)=>{
			return (
					<div>
						<span>{'序号: '+index}</span>
						<span className={`isvisit-badge ${isVisit?'':'novisit'}`}>{isVisit?'已看':'未看'}</span>
					</div>
			)
		};
		return (
				<div className="house-arrange-excel-wrapper">
					<List
							grid={{ gutter: 16, column: 2}}
							locale={{emptyText:'数据空空如也~'}}
							dataSource={this.props.excelLatestData}
							renderItem={item => (
									<List.Item>
										<Card title={TitleNode(item.index,item.isVisit)}
													hoverable={true}
										>
											<div className="house-arrange-excel-content">
												<div className="house-arrange-excel-content-line-wrapper">
													<Tag color={item.isVisit?'#39ac6a':'#ff9e1e'}>房屋地址</Tag>
													<span className="house-arrange-excel-content-desc">{item.roadNumber+item.detailPosition}</span>
												</div>
												<div className="house-arrange-excel-content-line-wrapper">
													<Tag color={item.isVisit?'#39ac6a':'#ff9e1e'}>反馈情况</Tag>
													<span className="house-arrange-excel-content-desc">{item.feedback}</span>
												</div>
												<div className="house-arrange-excel-content-line-wrapper no-margin-bottom">
													<Tag color={item.isVisit?'#39ac6a':'#ff9e1e'}>反馈时间</Tag>
													<span className="house-arrange-excel-content-desc">{item.feedTime}</span>
												</div>
											</div>
										</Card>
									</List.Item>
							)}
					/>
				</div>
		)
	}
}
export default HouseArrangeExcelContentList