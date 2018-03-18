/**
 * Created by Administrator on 2018/3/12.
 */
//模板修改页面
import React from 'react'
import './index.scss'
import axios from 'axios'
import {withRouter} from 'react-router-dom'
import {Select,Modal,Tooltip,Affix,Form,Input} from 'antd'
import PreReportInputAddModal from './../../components/PreReportInputAddModal/PreReportInputAddModal'
//import {connect} from 'react-redux'
const Option = Select.Option;
const FormItem = Form.Item;
class AddPreReportTemplate extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			//最终保存数据库的模板名字
			bankName:'',
			//模板名字输入框提交按钮是否loading状态，即不可点击状态
			isPreReportInputNameLoading:false,
			//模板名字
			preReportName:'',
			//模板名字输入框校验文字
			preReportNameHelpString:'',
			//模板名字输入框校验状态:success,error,warning
			preReportValidateStatus:'',
			//模态框是否可见
			modalVisible:false,
			//输入预评估模板名字的模态框是否可见
			preReportNameModalVisible:true,
			//输入input的数据
			inputTypeDataList:[]
		};
	}
	//模板名称输入框事件,获取input的值要用onChange事件,js原生的,否则要用getFieldDecorator
	preReportNameInputOnChange(e){
		let inputValue = e.target.value;
		this.setState({
			preReportName:inputValue,
			preReportValidateStatus:'',
			preReportNameHelpString:''
		})
	}
	//弹出添加预评估数据对话框
	showModalAdd(){
		this.setState({
			modalVisible: true,
		});
	}
	//处理modal框取消按钮
	handleCancel(type){
		switch (type){
			case 'PRE_REPORT_INPUT_ADD':{
				this.setState({
					modalVisible: false,
				});
				break;
			}
			case 'PRE_REPORT_NAME':{
				this.setState({
					preReportNameModalVisible: false,
				});
				//返回预评估首页
				this.props.history.push('/app/pre_assesment_report');
				break;
			}
			default:break;
		}

	}
	//处理modal框确定按钮
	handleOk(type){
		switch (type){
			case 'PRE_REPORT_INPUT_ADD':{
				this.setState({
					modalVisible: false,
				});
				break;
			}
			case 'PRE_REPORT_NAME':{
				//判断输入是否为空
				if(!this.state.preReportName){
					this.setState({
						preReportValidateStatus:'error',
						preReportNameHelpString:'输入名称不得为空!'
					});
					return;
				}
				//设置查询状态,禁用提交
				this.setState({
					preReportValidateStatus:'validating',
					preReportNameHelpString:'',
					isPreReportInputNameLoading:true
				});
				//后台查询是否该名字已存在
				axios.get('/estate/bankInfo').then((resp)=>{
					let status = resp.data.status;
					this.setState({
						isPreReportInputNameLoading:false
					});
					if(status === 1){
						//查询成功
						let isExist = resp.data.bankInfo.indexOf(this.state.preReportName) !== -1;
						//如果存在
						if(isExist){
							this.setState({
								preReportValidateStatus:'error',
								preReportNameHelpString:'输入名称已经存在,请重新输入!'
							});
							return;
						}else{
							//如果不存在,保存名字
							this.setState({
								preReportValidateStatus:'success',
								preReportNameHelpString:'输入名称合法!',
								bankName:this.state.preReportName,
								isPreReportInputNameLoading:true
							});
							setTimeout(()=>{
								this.setState({
									preReportNameModalVisible: false,
								});
							},1000)
						}

					}else{
						//查询出错
						this.setState({
							preReportValidateStatus:'error',
							preReportNameHelpString:'数据库查询错误,请稍后重试!'
						});
					}
				})
				break;
			}
			default:break;
		}
	}

	componentDidMount(){
	}

	render(){
		const formItemLayout = {
			labelCol: {
				xs: { span: 24 },
				sm: { span: 9 },
			},
			wrapperCol: {
				xs: { span: 24 },
				sm: { span: 14,offset:5 },
			},
		};

		return (
			<div>
				{/*模态框输入预评估模板名字,该模态框进入页面时就显示*/}
				<Modal
					title="请输入预评估模板名字"
					okText="确定"
					closable={false}
					width={400}
					maskClosable={false}
					wrapClassName="vertical-center-modal input-margin-bottom"
					cancelText="取消"
					destroyOnClose={true}
					confirmLoading={this.state.isPreReportInputNameLoading}
					visible={this.state.preReportNameModalVisible}
					onOk={()=>this.handleOk('PRE_REPORT_NAME')}
					onCancel={()=>this.handleCancel('PRE_REPORT_NAME')}
				>
					<Form>
						<FormItem
							{...formItemLayout}
							hasFeedback
							help={this.state.preReportNameHelpString}
							validateStatus={this.state.preReportValidateStatus}
						>
							<Input placeholder="模板名称" id="pre-report-name-input" onChange={(e)=>this.preReportNameInputOnChange(e)}/>
						</FormItem>
					</Form>
				</Modal>
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
					onOk={()=>this.handleOk('PRE_REPORT_INPUT_ADD')}
					onCancel={()=>this.handleCancel('PRE_REPORT_INPUT_ADD')}
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
											<span className="template-input-add-button-font">{this.state.bankName}</span>
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

export default  withRouter(AddPreReportTemplate)