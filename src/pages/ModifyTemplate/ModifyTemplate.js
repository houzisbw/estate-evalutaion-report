//模板修改页面
import React from 'react'
import './index.scss'
import axios from 'axios'
import {withRouter} from 'react-router-dom'
import {Select,Modal,Tooltip,Affix,Form,Input,notification} from 'antd'
import Loading from './../../components/Loading/Loading'
import ReportTemplateInputArea from './../../components/ReportTemplateInputArea/reportTemplateInputArea'
import PreReportInputAddModal from './../../components/PreReportInputAddModal/PreReportInputAddModal'
const Option = Select.Option;
const FormItem = Form.Item;
class ModifyTemplate extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			bankInputData:[],
			bankName:'',
			//modal对话框是否可见
			modalVisible:false,
			//所有数据项index的列表
			totalIndexList:[],
			//是否显示数据项index
			showIndex:false,
			//保存输入框label的数组，目的是为了验证label不重复
			totalLabelList:[]

		}
	}

	componentDidMount(){
		//获取路由传递来的参数,如果直接访问页面则返回,相当于权限设置
		if(!this.props.location.state){
			this.props.history.push('/app/pre_assesment_report');
			return;
		}
		let routerParams = this.props.location.state;
		//取得预评估报告模板名字
		let templateName = routerParams.templateName;
		this.setState({
			bankName:templateName
		})
		//从数据库获取对应报告的数据显示在页面上
		this.fetchPreReportTemplateData(templateName);
	}
	//获取预评估模板数据
	fetchPreReportTemplateData(templateName){
		axios.post('/estate/getBankInputsData',{bank:templateName}).then((resp)=>{
			if(resp.data.status === 1){
				let inputData = resp.data.inputData;
				//初始化index数组
				let inputDataIndexList = [];
				let inputNameIndexList = [];
				inputData.forEach((item)=>{
					let data = item.data;
					data.forEach((subItem)=>{
						if(subItem.itemName){
							inputNameIndexList.push(subItem.itemName)
						}
						if(subItem.index){
							inputDataIndexList.push(subItem.index)
						}
						if(subItem.dropdownLabelIndex){
							inputDataIndexList.push(subItem.dropdownLabelIndex)
						}
					})
				});
				inputDataIndexList.sort(function(a,b){return a-b});
				this.setState({
					bankName:templateName,
					bankInputData:inputData,
					totalLabelList:inputNameIndexList,
					totalIndexList:inputDataIndexList
				})
			}else{
				Modal.warning({
					title:'Oops!',
					content:'数据库查询错误,请稍后重试!'
				})
			}

		})
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
						inputData:self.state.bankInputData
					}
				};
				axios.post('/estate/saveModifiedPreReportTemplate',param).then((resp)=>{
					if(resp.data.status === 1){
						Modal.success({
							title:'恭喜',
							content:'预评估报告修改成功',
							onOk(){
								self.props.history.push('/app/pre_assesment/report')
							}
						})

					}else{
						Modal.success({
							title:'Oops~',
							content:'预评估报告修改失败，请重试'
						})
					}
				})
			}
		})
	}
	//处理添加模板数据
	//处理modal框确定按钮
	handleOk(){
		//数据校验,调用子组件的方法
		let formValues = this['PreReportInputAddModal'].validateInputsAndSendToParent();
		//验证输入框label是否重复
		let labelToAdd = formValues.itemName;
		if(labelToAdd){
			if(this.state.totalLabelList.indexOf(labelToAdd)!==-1){
				Modal.error({
					title: '请注意',
					content: '输入框左侧文字填写重复，请重新填写~',
				});
				return
			}
		}

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
		for(let i=0;i<this.state.bankInputData.length;i++){
			if(this.state.bankInputData[i].partName === partName){
				//排序,按index升序排列
				let tempArr = this.state.bankInputData;
				tempArr[i].data.push(formValues);
				tempArr[i].data.sort(function(a,b){
					if(a.size === b.size){
						return a.index - b.index
					}
					return a.size - b.size
				})
				this.setState({
					bankInputData:tempArr,
					totalIndexList:tempTotalIndexList
				})
			}
		}
		//提示添加数据成功
		notification['success']({
			message: '恭喜~',
			description: '添加数据项成功!',
		});
		//更新输入label数组
		if(labelToAdd){
			let t = this.state.totalLabelList;
			t.push(labelToAdd);
			this.setState({
				totalLabelList:t
			})
		}
		this.setState({
			modalVisible: false,
		});
	}
	//处理modal框取消
	handleCancel(){
		this.setState({
			modalVisible: false,
		});
	}
	//显示modal框
	showModalAdd(){
		this.setState({
			modalVisible: true,
		});
	}
	//删除已有的数据项
	onRemoveInput(indexToRemove,itemNameToRemove){
		let t = this.state.bankInputData;
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
				bankInputData:t
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

		//删除label数组中对应的
		let itemNameToRemoveIndex = this.state.totalLabelList.indexOf(itemNameToRemove);
		console.log(itemNameToRemove,itemNameToRemoveIndex)
		if(itemNameToRemoveIndex!==-1){
			this.state.totalLabelList.splice(itemNameToRemoveIndex,1)
		}
		//更新
		this.setState({
			totalLabelList:this.state.totalLabelList,
			totalIndexList:tempTotalIndexList
		})

	}
	//显示数据index
	showIndex(){
		this.setState({
			showIndex:!this.state.showIndex
		})
	}
	//重置数据
	resetAllData(){
		//重置state
		this.setState({
			bankInputData:[],
			bankName:'',
			//modal对话框是否可见
			modalVisible:false,
			//所有数据项index的列表
			totalIndexList:[],
			//是否显示数据项index
			showIndex:false,
			//保存输入框label的数组，目的是为了验证label不重复
			totalLabelList:[]
		},()=>{
			let routerParams = this.props.location.state;
			//取得预评估报告模板名字
			let templateName = routerParams.templateName;
			this.fetchPreReportTemplateData(templateName);
		})
	}

	render(){
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
					<PreReportInputAddModal wrappedComponentRef={(inst) => this['PreReportInputAddModal'] = inst}/>
				</Modal>
				{/*这里复用的其他文件的css*/}
				<div className="my-page-wrapper">
					<div className="page-title">
						<div className="template-desc">
							<i className="fa fa-pencil modify-icon modify-icon-margin-right"></i><span>预评估模板修改</span>
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
									this.state.bankInputData.length>0?
										this.state.bankInputData.map((item,index)=>{
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
														onRemoveInput={(index,itemName)=>this.onRemoveInput(index,itemName)}
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

export default  ModifyTemplate