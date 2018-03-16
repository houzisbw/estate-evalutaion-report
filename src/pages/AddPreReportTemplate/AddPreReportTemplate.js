/**
 * Created by Administrator on 2018/3/12.
 */
//模板修改页面
import React from 'react'
import './index.scss'
import axios from 'axios'
import {Select,Modal,Tooltip,Affix} from 'antd'
import PreReportInputAddModal from './../../components/PreReportInputAddModal/PreReportInputAddModal'
//import {connect} from 'react-redux'
const Option = Select.Option;
class AddPreReportTemplate extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			//模态框是否可见
			modalVisible:false,
			//输入input的数据
			inputTypeDataList:[]
		};
	}
	//弹出添加预评估数据对话框
	showModalAdd(){
		this.setState({
			modalVisible: true,
		});
	}
	handleCancel(){
		this.setState({
			modalVisible: false,
		});
	}
	handleOk(){
		this.setState({
			modalVisible: false,
		});
	}

	componentDidMount(){
	}

	render(){
		let title = '添加预评估模板';
		//这只是用作显示，value是从0开始的整数，用作切换tabs
		return (
			<div>
				{/*模态框,点击显示添加数据页面*/}
				<Modal
					title="添加模板数据"
					okText="确定"
					width={600}
					maskClosable={false}
					wrapClassName="vertical-center-modal"
					cancelText="取消"
					destroyOnClose={true}
					visible={this.state.modalVisible}
					onOk={()=>this.handleOk()}
					onCancel={()=>this.handleCancel()}
				>
					<PreReportInputAddModal />
				</Modal>
				{/*这里复用的其他文件的css*/}
				<div className="my-page-wrapper">
					<div className="page-title">
						<div className="template-desc">
							<i className="fa fa-plus-square-o modify-icon-add"></i><span>添加预评估模板</span>
						</div>
					</div>
					{/*内容区域*/}
					<div className="template-content">
						{/*template-content-wrapper的作用是解决overflow:hidden与margin:0 auto之间的冲突:chrome下不会居中*/}
						<div className="template-content-wrapper">
							<Affix offsetTop={120}>
								<div className="template-title-wrapper">
									<Tooltip title="点此添加数据项">
										<div className="template-title template-input-add-button" onClick={()=>this.showModalAdd()}>
											<i className="fa fa-plus template-input-add-button-icon"></i>
										</div>
									</Tooltip>
								</div>
							</Affix>
						</div>
					</div>
					{/*svg测试,坐标是针对于父容器,viewBox表示视野，越小的话图像越大，只显示局部*/}
					{/*<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="400" viewBox="0 0 50 50">*/}
						{/*<circle cx="50" cy="50" r="40" stroke="red"  fill="#ffffff"/>*/}
					{/*</svg>*/}
				</div>

				{/*补丁区域*/}
				<div className="bottom-padding">
				</div>
			</div>
		)
	}
}

export default  AddPreReportTemplate