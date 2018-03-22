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