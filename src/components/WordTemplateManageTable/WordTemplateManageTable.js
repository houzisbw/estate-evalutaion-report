/**
 * Created by Administrator on 2018/3/21.
 */
import React from 'react'
import './index.scss'
import {Table,Divider} from 'antd'
class WordTemplateManageTable extends React.Component{
	constructor(props){
		super(props);
		this.state = {

		}
	}
	render(){
		return (
			//注意分页器必须自己写，因为每点击一次页码就要查询数据库而不是使用table默认的，无法自定义事件
			<div>
				<Table columns={this.props.columns}
					   pagination={false}
					   loading={this.props.isLoading}
					   dataSource={this.props.dataSource}
				/>
			</div>
		)
	}
}
export default  WordTemplateManageTable