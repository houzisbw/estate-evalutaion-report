/**
 * Created by Administrator on 2018/3/28.
 */
import React from 'react'
import {Modal,Tooltip,Table,Pagination,Popconfirm,Input } from 'antd'
import './index.scss'
import axios from 'axios'
//引入公有表单组件
import CommonForm from './../../components/_publicComponents/Form/CommonForm'
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
//业务登记页面
class BusinessRegistering extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			//现存的项目序号
			currentItemIndex:0,
			//表格是否在loading
			isTableDataLoading:false,
			//业务数据总数
			totalNum:10,
			//业务数据
			businessData:[],
			//每一页显示的业务登记表数量
			itemSizePerPage:10,
			//当前页数
			currentPageNum:1,
			//添加新业务登记框的提交按钮是否loading
			isSubmitButtonLoading:false,
			modalVisible:false,

			//表单各个项的数据,type[input,select,dragger],label(输入框说明文字)
			//initialValue输入框初始值,下拉框初始值也在此设定
			//selectionDat下拉框数据
			//FieldDecoratorName表示表单输入框的唯一标志符,不能重复
			//size表示大小,1最小，2最大
			//mode表示下拉框是否可编辑
			formInputData:[
				// {
				// 	FieldDecoratorName:'项目序号',
				// 	type:'input',
				// 	size:1,
				// 	label:'项目序号',
				// 	initialValue:'',
				// },
				{
					FieldDecoratorName:'项目类型',
					type:'select',
					size:1,
					label:'项目类型',
					initialValue:'二手房',
					selectionData:[
						{
							value:'二手房',
							text:'二手房'
						},
						{
							value:'抵押贷款',
							text:'抵押贷款'
						}
					]
				},{
					FieldDecoratorName:'担保公司',
					type:'input',
					size:1,
					label:'担保公司',
					initialValue:'',
				},{
					FieldDecoratorName:'部门',
					type:'input',
					size:1,
					label:'部门',
					initialValue:'',
				},{
					FieldDecoratorName:'业务员',
					type:'input',
					size:1,
					label:'业务员',
					initialValue:'',
				},{
					FieldDecoratorName:'银行',
					type:'select',
					size:1,
					label:'银行',
					mode:'combobox',
					selectionData:[
						{
							value:'农行',
							text:'农行'
						},
						{
							value:'工行',
							text:'工行'
						},
						{
							value:'邮政',
							text:'邮政'
						},
						{
							value:'中信',
							text:'中信'
						},
						{
							value:'包商',
							text:'包商'
						}
					]
				},{
					FieldDecoratorName:'支行',
					type:'input',
					size:1,
					label:'支行',
					initialValue:'',
				},
				{
					FieldDecoratorName:'委托人',
					type:'input',
					size:1,
					label:'委托人',
					initialValue:'',
				},{
					FieldDecoratorName:'电话',
					type:'input',
					size:2,
					label:'电话',
					initialValue:'',
				},{
					FieldDecoratorName:'项目所在区',
					type:'select',
					size:1,
					label:'项目所在区',
					mode:'combobox',
					selectionData:[
						{
							value:'青白江区',
							text:'青白江区'
						},
						{
							value:'青羊区',
							text:'青羊区'
						},
						{
							value:'龙泉驿区',
							text:'龙泉驿区'
						},
						{
							value:'金牛区',
							text:'金牛区'
						},
						{
							value:'锦江区',
							text:'锦江区'
						},
						{
							value:'高新区',
							text:'高新区'
						},
						{
							value:'武侯区',
							text:'武侯区'
						},
						{
							value:'温江区',
							text:'温江区'
						},
						{
							value:'双流区',
							text:'双流区'
						},
						{
							value:'成华区',
							text:'成华区'
						},
						{
							value:'郫都区',
							text:'郫都区'
						},
						{
							value:'天府新区',
							text:'天府新区'
						}
					]
				},{
					FieldDecoratorName:'项目街道号',
					type:'input',
					size:2,
					label:'项目街道号',
					initialValue:'',
				},{
					FieldDecoratorName:'项目具体位置',
					type:'input',
					size:2,
					label:'项目栋、单元、层、房号',
					initialValue:'',
				},{
					FieldDecoratorName:'面积',
					type:'input',
					size:1,
					label:'面积',
					initialValue:'',
				},{
					FieldDecoratorName:'贷款金额',
					type:'input',
					size:1,
					label:'贷款金额',
					initialValue:'',
				},{
					FieldDecoratorName:'成数',
					type:'input',
					size:1,
					label:'成数',
					initialValue:'',
				}

			]
		}
	}
	componentDidMount(){
		//非管理员,以后这里要修改
		if(this.props.userAuth === 1){
			let self = this;
			Modal.warning({
				title:'权限不足!',
				content:'非管理员没有权限访问该页面~',
				onOk(){
					self.props.history.push('/app/pre_assesment/report')
				}
			})
		}

		this.initBusinessRegisterData();
	}
	//初始化业务登记表数据
	initBusinessRegisterData(){
		//将表格改变为loading状态
		this.setState({
			isTableDataLoading:true
		})
		let param = {
			itemSizePerPage:this.state.itemSizePerPage,
			currentPageNum:this.state.currentPageNum
		};
		axios.post('/business_register/getBusinessRegisterData',param).then((resp)=>{
			if(resp.data.status === 1){
				this.setState({
					businessData:resp.data.data,
					totalNum:resp.data.cnt,
					isTableDataLoading:false
				})
			}else{
				Modal.warning({
					title:'抱歉!',
					content:'数据查询失败~'
				})
			}
		})
	}

	//处理新建业务登记项目
	handleAddNewEntry(){
		this.setState({
			modalVisible:true
		})
	}
	//表单确定
	handleOk(){
		this.setState({
			isSubmitButtonLoading:true
		})
		//触发子组件方法，提交表单,获取返回的表单数据
		let formValue = this['formData'].handleSubmit();
		//获取当前时间
		let d = new Date();
		let currentDate = d.getFullYear()+'/'+(d.getMonth()+1)+'/'+d.getDate();
		let dateObj = {
			'登记日期':currentDate,
			'是否收齐':0
		};
		//合并对象
		let dataObj = Object.assign(formValue,dateObj);
		//获取项目序号
		axios.get('/business_register/getItemIndex').then((resp)=>{
			if(resp.data.status===1){
				dataObj['项目序号'] = resp.data.currentItemIndex;
			}else{
				Modal.error({
					title:'Oops',
					content:'业务查询失败!'
				})
			}
			//返回一个promise从而链式调用
			return axios.post('/business_register/saveBusinessRegisterItem',{dataObj:dataObj})
		}).then((resp)=>{
			this.setState({
				isSubmitButtonLoading:false
			});
			let status = resp.data.status;
			let self = this;
			if(status === 1){
				Modal.success({
					title:'恭喜',
					content:'业务登记项保存成功!',
					onOk(){
						self.initBusinessRegisterData()
					}
				})
			}else{
				Modal.error({
					title:'Oops',
					content:'业务登记项保存失败!'
				})
			}
			this.setState({
				modalVisible:false
			})
		})

	}
	handleCancel(){
		this.setState({
			modalVisible:false
		})
	}
	//页码改变回调
	onPageIndexChange(page){
		this.setState({
			currentPageNum: page,
		},()=>{
			//重新查询数据库获取数据
			this.initBusinessRegisterData();
		});
	}
	//删除列表数据
	onTableDataDelete(itemIndex){
		//发送给后台删除，
		let self = this;
		axios.post('/business_register/deleteItemByIndex',{index:itemIndex}).then((resp)=>{
			if(resp.data.status === 1){
				Modal.success({
					title:'恭喜',
					content:'业务登记删除成功!',
					onOk(){
						//重置页码为1,这里有待优化
						self.setState({
							currentPageNum:1
						},()=>{
							self.initBusinessRegisterData()
						})

					}
				})
			}else{
				Modal.error({
					title:'糟糕',
					content:'业务登记删除失败!'
				})
			}
		})
	}
	//输入框编辑改变
	onEditInputChange(v){

	}
	renderColumns(text, record, column) {
		//可编辑输入框
		const EditableCell = ({ editable, value, onChange }) => (
			<div>
				{editable
					? <Input style={{ margin: '-5px 0' }} value={value} onChange={e => onChange(e.target.value)} />
					: value
				}
			</div>
		);
		return (
			<EditableCell
				editable={record.editable}
				value={text}
				onChange={value => this.handleChange(value, record.key, column)}
			/>
		);
	}
	//编辑
	edit(key){
		const newData = [...this.state.businessData];
		const target = newData.filter(item => key === item['项目序号'])[0];
		if (target) {
			target.editable = true;
			this.setState({ businessData: newData });
		}
	}
	render(){

		//表头数据,此处需要优化获取方式
		const columns = this.state.formInputData.map((value,index)=>{
			let obj = {
				title:value.FieldDecoratorName,
				dataIndex:value.FieldDecoratorName,
				render: (text, record) => this.renderColumns(text, record, value.FieldDecoratorName),
			}
			return obj;
		});
		//添加剩余：登记日期，是否收齐
		columns.unshift({
			title:'登记日期',
			dataIndex:'登记日期',
			render: (text, record) => this.renderColumns(text, record, '登记日期'),
		});
		columns.unshift({
			title:'项目序号',
			dataIndex:'项目序号',
			render: (text, record) => this.renderColumns(text, record, '项目序号'),
		});
		//图片特殊处理，需要弹出图片框
		columns.push({
			title:'图片',
			dataIndex:'图片',
		})
		//特殊处理
		columns.push({
			title:'是否收齐',
			dataIndex:'是否收齐'
		})
		//这个列的数据不存数据库，注意了,且固定在右侧
		columns.push({
			title:'操作',
			dataIndex:'操作',
			width: 100,
			fixed: 'right',
			render: (text, record) => {
				return (
					<span>
						<Tooltip title="删除该条数据">
							<Popconfirm title="确认删除该条数据?"
										okText="确定"
										cancelText="取消"
										onConfirm={() => this.onTableDataDelete(record['项目序号'])}>
								<i className="business-tabledata-operation-icon"></i>
							</Popconfirm>
						</Tooltip>
						<Tooltip title="修改该条数据">
							<i className="business-tabledata-modify-icon" onClick={()=>this.edit(record['项目序号'])}></i>
						</Tooltip>
					</span>
				);
			},
		})
		//列表内容数据,需要添加key防止报错
		let tableData = this.state.businessData.map((value,index)=>{
			return Object.assign(value,{key:index})
		})

		return (
			<div className="my-page-wrapper">
				{/*模态框,点击显示添加数据页面,设置最大高度400，溢出产生滚动条*/}
				<Modal
					title="业务登记表填写"
					okText="确定"
					width={600}
					bodyStyle={{overflow:'auto',height:'400px'}}
					maskClosable={false}
					wrapClassName="vertical-center-modal"
					cancelText="取消"
					destroyOnClose={true}
					visible={this.state.modalVisible}
					confirmLoading={this.state.isSubmitButtonLoading}
					onOk={()=>this.handleOk()}
					onCancel={()=>this.handleCancel()}
				>
					<CommonForm formData={this.state.formInputData}
								wrappedComponentRef={(inst) => this['formData'] = inst}
					/>

				</Modal>


				<div className="page-title">
					<i className="fa fa-pencil-square-o modify-icon-margin-right"></i><span>业务登记</span>
					{/*修改模板按钮区域，管理员可见*/}
					<div className="template-modify-wrapper">
						{
							//判断权限，管理员(0)才能修改,userAuth是redux中传来的state
							this.props.userAuth===0?(
								<Tooltip title="新增一条业务登记表">
									<button className="template-modify-button fa fa-plus fa-plus-padding bg-green" onClick={()=>{this.handleAddNewEntry()}}></button>
								</Tooltip>
							) :null
						}
					</div>
				</div>
				<div className="content">
					<div className="business-content-wrapper">
						{/*scroll确定了横轴可滚动区域大小*/}
						<Table columns={columns}
							   loading={this.state.isTableDataLoading}
							   bordered
							   pagination={false}
							   scroll={{ x: 2000}}
							   dataSource={this.state.businessData}  />
						<div className="business-pagination">
							{/*pageSize设置每页条数*/}
							<Pagination current={this.state.currentPageNum}
										showQuickJumper
										pageSize={this.state.itemSizePerPage}
										onChange={(page)=>this.onPageIndexChange(page)}
										total={this.state.totalNum}
							/>
						</div>
					</div>
				</div>
			</div>
		)
	}
}
//获取用户权限
const mapStateToProps = (state)=>{
	return {
		userAuth:state.updateUserAuthState.userAuth,
	}
}

export default  withRouter(connect(mapStateToProps)(BusinessRegistering))