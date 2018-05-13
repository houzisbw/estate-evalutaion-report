/**
 * 评估报告正报生成页面
 */

import React from 'react'
import './index.scss'
import {Button,Upload,Icon} from 'antd'
class NormalAssesment extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			preReportParagraphData:[]
		};
	}
	render(){
		//上传word相关配置项,name字段用于标记服务端req.files里面对应的文件
		let uploadProps = {
			name:'wordPreReport',
			action:'/normal_assesment/getPreReportDocx',
			data:{},
			//注前面的是doc，后面的是docx，2者都必须
			accept:'application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document',
			//不展示上传列表
			showUploadList:false,
			onChange(info) {
				let file = info.file;
				//获取上传中的服务端响应内容，包含了上传进度等信息，高级浏览器支持
				const status = file.status;
				//文件上传完成返回数据
				if (status === 'done') {
					this.setState({
						preReportParagraphData:file.response.data
					})

				}else if (status === 'error') {
					console.log('error')
				}
			},
		};
		return (
			<div className="my-page-wrapper">
				<div className="page-title">
					<div className="template-desc">
						<span>选择报告模板</span>
					</div>
				</div>
				<div className="template-content">
					<Upload {...uploadProps}>
						<Button>
							<Icon type="upload" /> 上传word文件
						</Button>
					</Upload>
				</div>
			</div>
		)
	}
}
export default  NormalAssesment