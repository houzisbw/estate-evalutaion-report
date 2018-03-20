/**
 * Created by Administrator on 2018/3/12.
 */
//模板修改页面
import React from 'react'
import './index.scss'
import axios from 'axios'
import {withRouter} from 'react-router-dom'
import {Select,Modal,Tooltip,Affix,Form,Input,notification} from 'antd'
import Loading from './../../components/Loading/Loading'
import ReportTemplateInputArea from './../../components/ReportTemplateInputArea/reportTemplateInputArea'
import PreReportInputAddModal from './../../components/PreReportInputAddModal/PreReportInputAddModal'
//import {connect} from 'react-redux'
const Option = Select.Option;
const FormItem = Form.Item;
class AddPreReportTemplate extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			//是否显示输入框序号
			showIndex:false,
			//所有输入框index的数组
			totalIndexList:[],
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
			//输入input的数据,初始化为各个不同模板提取的共同数据
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
				//数据校验,调用子组件的方法
				let formValues = this['PreReportInputAddModal'].validateInputsAndSendToParent();
				//检验2个index是否填写合理,首先获取所有输入框index
				let leftIndex = formValues.dropdownLabelIndex,
					rightIndex = formValues.index;
				//先判断右侧index是否合法
				if(!rightIndex || this.state.totalIndexList.indexOf(rightIndex) !== -1){
					Modal.error({
						title: '请注意',
						content: '输入框序号填写非法(已经存在该序号或者序号为空),请重新填写',
					});
					return;
				}
				//再判断左侧index是否合法，注意必须是在isDropdown为true的情况下判断
				if(formValues.isDropdown && (!leftIndex || this.state.totalIndexList.indexOf(leftIndex) !== -1)){
					Modal.error({
						title: '请注意',
						content: '输入框左侧序号填写非法(已经存在该序号或者序号为空),请重新填写',
					});
					return;
				}
				//如果左右2个index一样也不行
				if(leftIndex === rightIndex){
					Modal.error({
						title: '请注意',
						content: '输入框左侧序号和输入框序号不能相同,请重新填写',
					});
					return;
				}

				//更新index数组
				let tempTotalIndexList = this.state.totalIndexList;
				tempTotalIndexList.push(rightIndex);
				if(formValues.isDropdown){
					tempTotalIndexList.push(leftIndex);
				}

				//校验通过，存入缓存,删除partName属性
				let partName = formValues.partName;
				delete formValues.partName;
				for(let i=0;i<this.state.inputTypeDataList.length;i++){
					if(this.state.inputTypeDataList[i].partName === partName){
						//排序,按index升序排列
						let tempArr = this.state.inputTypeDataList;
						tempArr[i].data.push(formValues);
						tempArr[i].data.sort(function(a,b){
							if(a.size === b.size){
								return a.index - b.index
							}
							return a.size - b.size
						})
						this.setState({
							inputTypeDataList:tempArr,
							totalIndexList:tempTotalIndexList
						})
					}
				}

				//提示添加数据成功
				notification['success']({
					message: '恭喜~',
					description: '添加数据项成功!',
				});




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
	//重置所有数据
	resetAllData(){
		//重置state
		this.setState({
			showIndex:false,
			//所有输入框index的数组
			totalIndexList:[],
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
			//输入input的数据,初始化为各个不同模板提取的共同数据
			inputTypeDataList:[]
		},()=>{
			this.initInputTypeDataList();
		})

	}
	//初始化inputTypeDataList
	initInputTypeDataList(){
		axios.get('/estate/getPreReportTemplate').then((resp)=>{
			if(resp.data.status === 1){
				let template = resp.data.template;
				//初始化index数组
				let tempIndexList = [];
				template.forEach((item)=>{
					let data = item.data;
					data.forEach((subItem)=>{
						if(subItem.index){
							tempIndexList.push(subItem.index)
						}
						if(subItem.dropdownLabelIndex){
							tempIndexList.push(subItem.dropdownLabelIndex)
						}
					})
				});
				tempIndexList.sort(function(a,b){return a-b});
				this.setState({
					inputTypeDataList:template,
					totalIndexList:tempIndexList
				})
			}else{
				Modal.warning({
					title:'Oops!',
					content:'数据库查询错误,请稍后重试!'
				})
			}
		})
	}
	//显示/隐藏输入框的序号
	showIndex(){
		this.setState({
			showIndex:!this.state.showIndex
		})
	}

	componentDidMount(){
		//初始化
		this.initInputTypeDataList();

	}
	//保存预评估报告
	savePreReport(){
		let self = this;
		Modal.confirm({
			title: '保存报告',
			content: '确认保存该报告?',
			okText: '确认',
			cancelText: '取消',
			onOk(){
				//保存报告
				let param = {
					reportData:{
						bankName:self.state.bankName,
						inputData:self.state.inputTypeDataList
					}
				};
				axios.post('/estate/savePreReportTemplate',param).then((resp)=>{
					if(resp.data.status === 1){
						Modal.success({
							title:'恭喜',
							content:'预评估报告保存成功',
							onOk(){
								self.props.history.push('/app/pre_assesment/report')
							}
						})

					}else{
						Modal.success({
							title:'Oops~',
							content:'预评估报告保存失败，请重试'
						})
					}
				})
			}
		})
	}
	//处理子组件删除input的操作
	onRemoveInput(indexToRemove){
		let t = this.state.inputTypeDataList;
		let dropdownLabelIndex = null;
		t.forEach((item)=>{
			let data = item.data;
			let index=-1;
			for(var i=0;i<data.length;i++){
				if(data[i].index === indexToRemove){
					index = i;
					//如果左侧是下拉，则保存该下拉的index
					if(data[i].dropdownLabelIndex){
						dropdownLabelIndex = data[i].dropdownLabelIndex;
					}
				}
			}
			if(index !== -1){
				data.splice(index,1)
			}
			this.setState({
				inputTypeDataList:t
			})
		});
		//同时更新state中index数组,这里要注意：如果左侧是下拉的话，记得删除下拉的index
		let tempTotalIndexList = this.state.totalIndexList;
		let totalIndexListIndex = tempTotalIndexList.indexOf(indexToRemove);
		if(totalIndexListIndex!==-1){
			tempTotalIndexList.splice(totalIndexListIndex,1)
		}
		//删除左侧下拉的index，如果存在的话
		if(dropdownLabelIndex){
			totalIndexListIndex = tempTotalIndexList.indexOf(dropdownLabelIndex);
			if(totalIndexListIndex!==-1){
				tempTotalIndexList.splice(totalIndexListIndex,1)
			}
		}
		//更新
		this.setState({
			totalIndexList:tempTotalIndexList
		})
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
					title="添加模板数据(页面已有默认模板)"
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
					<PreReportInputAddModal wrappedComponentRef={(inst) => this['PreReportInputAddModal'] = inst}/>
				</Modal>
				{/*这里复用的其他文件的css*/}
				<div className="my-page-wrapper">
					<div className="page-title">
						<div className="template-desc">
							<i className="fa fa-plus-square-o modify-icon-add"></i><span>添加预评估模板</span>
						</div>
						<div className="add-pre-report-top-function-button">
							<Tooltip title="显示输入框的序号,同word模板对应(绿色为不可删除数据)">
								<button className="template-modify-button fa fa-tags" onClick={()=>this.showIndex()}></button>
							</Tooltip>
							<Tooltip title="重置所有数据">
								<button className="template-modify-button fa fa-repeat" onClick={()=>this.resetAllData()}></button>
							</Tooltip>
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
							{/*表单输入框区域,数据未返回时显示加载中画面*/}
							<div className="template-input-area">
								{
									this.state.inputTypeDataList.length>0?
										this.state.inputTypeDataList.map((item,index)=>{
											return (
												<div key={index}>
													{/*标题*/}
													<div className="template-input-type-title-wrapper">
														<div className="template-input-type-title">
															{item.partName}
														</div>
													</div>
													{/*输入框展示组件,传递的方法onInputSearch是搜索小区周边设施的方法*/}
													<ReportTemplateInputArea
														onRemoveInput={(index)=>this.onRemoveInput(index)}
														isInModifyMode={true}
														showIndex={this.state.showIndex}
														templateBankName={this.state.bankName}
														dataList={item.data}
														onSubmit={(v)=>{}}
														onInputSearch={(v)=>{}}
													/>
												</div>
											)
										}):(<Loading />)
								}
							</div>
						</div>
						{/*点击生成预评估报告按钮*/}
						<div className="template-content-wrapper">
							<div className="generate-prereport-button" onClick={()=>this.savePreReport()}>
								保存预评估报告
							</div>
						</div>
					</div>
				</div>

				{/*补丁区域*/}
				<div className="bottom-padding">
				</div>
			</div>
		)
	}
}

export default  withRouter(AddPreReportTemplate)