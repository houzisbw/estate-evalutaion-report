/**
 * 房屋excel内容列表组件，用于[当天看房情况]模块
 */
import React from 'react';
import {List,Card,Tag,Tooltip,Icon,Select,Modal,notification,Input} from 'antd';
import './index.scss'
import axios from 'axios'
import COS from 'cos-js-sdk-v5'
import PictureDownload from '../PictureDownload/PictureDownload'
import SignPositionBtn from '../SignPositionBtn/SignPositionBtn'

const tencentyunSecretId = 'AKID8AEFQ4Jzz8whgtj2fEbmlbGn8JHkNxZi';
const tencentyunSecretKey = '3sRviSR8hOB3jjejopwY2QkgR0PabO3V';
const tencentyunOssBucketName = 'estate-picture-1258800495';
const tencentyunOssRegion = 'ap-chengdu';
var getAuthorization = function(options, callback) {
  // 格式四、（不推荐，适用于前端调试，避免泄露密钥）前端使用固定密钥计算签名
  var authorization = COS.getAuthorization({
    SecretId: tencentyunSecretId,
    SecretKey: tencentyunSecretKey,
    Method: options.Method,
    Pathname: options.Pathname,
    Query: options.Query,
    Headers: options.Headers,
    Expires: 60,
  });
  callback({
    Authorization: authorization,
    // XCosSecurityToken: credentials.sessionToken, // 如果使用临时密钥，需要传 XCosSecurityToken
  });
};

var cos = new COS({
  // path style 指正式请求时，Bucket 是在 path 里，这样用途相同园区多个 bucket 只需要配置一个园区域名
  // ForcePathStyle: true,
  getAuthorization: getAuthorization,
});

const Option = Select.Option;
const confirm = Modal.confirm;
class HouseArrangeExcelContentList extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			//修改看房人员的modal
			modifyModalVisible:false,
			//加急的modal
			modifyUrgentModalVisible:false,
			//初始加急信息
			defaultUrgentInfo:"",
			//是否加急
			isUrgentLoading:false,
			modifiedIndex:0,
			currentStaff:'',
			totalStaffNameList:[],
			//确定修改的按钮的loading
			confirmLoading:false,
			okText:'确定修改',
			//删除数据的modal
			removeModalVisible:false,
			indexToRemove:'',
			staffNameToRemove:'',
			removeConfirmLoading:false,
			//报价相关的数据
			priceModalVisible:false,
			//当前页数
			currentPage:1,
			//每页条数
			pageSize:10,
			//报价的价格(数字,大于0，最多7位数)
			estatePrice:1,
			//报价那条数据的id
			estatePriceId:'',
			//是否在下载图片
			isDownloadingPicture:false,
			//图片数量对象，key为index，value为张数
			pictureNumObj:{}

		}
	}
	componentDidMount(){

	}
	//修改加急信息
	handleModifyUrgent(index,urgentInfo,staff){
		this.setState({
			modifyUrgentModalVisible:true,
			modifiedIndex:index,
			okText:'确定修改',
			currentStaff:staff,
			defaultUrgentInfo:urgentInfo
		})
	}
	//加急信息输入框内容变化
	handleUrgentInfoChange(e){
		if(e.target.value.length>5){
			return
		}
		this.setState({
			defaultUrgentInfo:e.target.value
		})

	}
	//加急信息点ok确定
	handleUrgentModalOK(){
		this.setState({
			confirmLoading:true,
			okText:'保存中...'
		});
		axios.post('/house_arrangement_today/modifyUrgent',{
			index:this.state.modifiedIndex,
			urgentInfo:this.state.defaultUrgentInfo,
			staff:this.state.currentStaff
		}).then((resp)=>{
			if(resp.data.status===-1){
				//数据保存失败
				Modal.error({
					title:'悲剧',
					content:'加急信息保存失败!请重试'
				})
			}else{
				notification['success']({
					message: '恭喜',
					description: '加急信息修改成功',
				});
			}
			this.setState({
				confirmLoading:false,
				okText:'确定修改',
				modifyUrgentModalVisible:false
			});
			//刷新数据
			this.props.refreshData();
		})
	}
	//修改看房人员
	handleModifyStaff(index,staff){
		this.setState({
			modifyModalVisible:true,
			modifiedIndex:index,
			currentStaff:staff,
			okText:'确定修改'
		})
		//获取看房人员名单
		axios.get('/staff_arrange/getStaff').then((resp)=>{
			if(resp.data.status===-1){
				Modal.error({
					title: '糟糕！',
					content: '数据读取出错，请重试~',
				});
			}else{
				var staffData = resp.data.staffList;
				this.setState({
					totalStaffNameList:staffData.map((item)=>item.name)
				})
			}
		})
	}
	//确定修改，保存到数据库,然后刷新数据
	handleModifyModalOK(){
		this.setState({
			confirmLoading:true,
			okText:'保存中...'
		});
		axios.post('/house_arrangement_today/modifyStaff',{
			index:this.state.modifiedIndex,
			staffName:this.state.currentStaff,
			latestDate:this.props.latestDate
		}).then((resp)=>{
			if(resp.data.status===-1){
				//数据保存失败
				Modal.error({
					title:'悲剧',
					content:'人员修改保存失败!请重试'
				})
			}else{
				notification['success']({
					message: '恭喜',
					description: '看房人员修改成功',
				});
			}
			this.setState({
				confirmLoading:false,
				okText:'确定修改',
				modifyModalVisible:false
			});
			//刷新数据
			this.props.refreshData();
		})
	}
	handleModifyModalCancel(){
		this.setState({
			modifyModalVisible:false,
			modifyUrgentModalVisible:false,
		})
	}
	handleStaffSelect(v){
		this.setState({
			currentStaff:v
		})
	}
	//删除数据
	removeData(itemIndex,itemStaffName){
		this.setState({
			removeModalVisible:true,
			indexToRemove:itemIndex,
			staffNameToRemove:itemStaffName
		})
	}
	//确认删除
	handleRemoveModalOK(){
		this.setState({
			removeModalVisible:false,
			removeConfirmLoading:true
		});
		axios.post('/house_arrangement_today/removeHouseData',{
			staff:this.state.staffNameToRemove,
			index:this.state.indexToRemove
		}).then((resp)=>{
			if(resp.data.status===-1){
				notification['error']({
					message: '注意',
					description: '删除信息失败!',
				});
			}else{
				notification['success']({
					message: '恭喜',
					description: '删除信息成功!',
				});
			}
			this.setState({
				removeConfirmLoading:false
			});
			this.props.refreshData();
		})
	}
	handleRemoveModalCancel(){
		this.setState({
			removeModalVisible:false
		})
	}
	//处理页数变化
	handlePageChange(page){
		this.setState({
			currentPage:page
		})
	}
	//下载表单数据
	downloadFormDataInExcel(index,date){
		axios.post('/house_arrangement_today/downloadFormDataInExcel',{
			date:date,
			index:index
		}).then((resp)=>{
				if(resp.data.status === 1){
					let formData = resp.data.formData;
					let staffName = resp.data.staffName,
							feedTime = resp.data.feedTime;
					this.downloadExcel(formData,index,staffName,feedTime)
				}else{
					notification['error']({
						message: '注意',
						description: '表单不存在,无法下载',
					});
				}
		})
	}
	//下载表单excel
	downloadExcel(formData,index,staffName,feedTime){
		let wb = window.XLSX.utils.book_new();
		let dataInExcel = [];
		formData.forEach((item)=>{
			let key = Object.keys(item)[0];
			let value = item[key];
			dataInExcel.push({
				A:key,
				B:value
			})
		})
		//加上看房人员和反馈时间
		let otherInfoList = [{A:'看房人员',B:staffName},{A:'看房时间',B:feedTime}]
		dataInExcel = dataInExcel.concat(otherInfoList);
		//生成sheet
		let ws = window.XLSX.utils.json_to_sheet(dataInExcel,{
			headers:['A','B'],skipHeader:true
		});

		//将worksheet添加到工作簿上
		window.XLSX.utils.book_append_sheet(wb, ws, '表单数据');
		//下载
		window.XLSX.writeFile(wb,'表单数据-'+index+'.xlsx');
		//提示下载成功
		notification['success']({
			message: '恭喜',
			description: 'Excel已下载!',
		});
	}

	//处理报价按钮点击
	handlePrice(index,price,id){
		//显示报价对话框
		this.setState({
			priceModalVisible:true,
			modifiedIndex:index,
			estatePrice:price===0?'':price,
			estatePriceId:id
		})
	}
	//报价对话框点击确定
	handlePriceModalOK(){
		if(this.state.estatePrice === ''){
			notification['error']({
				message: '注意',
				description: '价格不能为空!',
			});
			return
		}
		this.setState({
			confirmLoading:true,
			okText:'修改中...'
		});
		axios.post('/house_arrangement_today/modifyPrice',{
			index:this.state.modifiedIndex,
			date:this.props.latestDate,
			price:this.state.estatePrice,
			id:this.state.estatePriceId
		}).then((resp)=>{
			if(resp.data.status === -1){
				notification['error']({
					message: '注意',
					description: '价格修改失败!',
				});
			}
			this.setState({
				confirmLoading:false,
				okText:'确定',
				priceModalVisible:false,
			});
			this.props.refreshData();
		})
	}
	//报价对话框点击取消
	handlePriceModalCancel(){
		this.setState({
			priceModalVisible:false
		})
	}
	//报价对话框内容改变
	handlePriceChange(e){
		let formattedPrice = e.target.value.replace(/[^\d]/g,'');
		//输入必须合法
		if(formattedPrice.length>7 || formattedPrice==='0'){
			return
		}
		this.setState({
			estatePrice:formattedPrice
		})
	}
	//处理是否出预评估切换
	handlePreAssessment(has,index,_id){
		axios.post('/house_arrangement_today/modifyHasPreAssessment',{
			index:index,
			has:!has,
			latestDate:this.props.latestDate,
			_id
		}).then((resp)=>{
			if(resp.data.status === -1){
				notification['error']({
					message: '注意',
					description: '预评状态修改失败!',
				});
			}
			this.props.refreshData();
		})
	}

	// 下载照片
  downloadPictures(index,date){
		//如果处于下载过程中
		if(this.state.isDownloadingPicture){
			return
		}
		let self = this;
		this.setState({
      isDownloadingPicture:true
		});
		// 根据房屋index获取图片url
    cos.getBucket({
      Bucket: tencentyunOssBucketName,
      Region: tencentyunOssRegion,
      Prefix: index+'-',
    }, function(err, data) {
      let keyArray = [];
      data.Contents.forEach((item)=>{
        keyArray.push(item.Key)
      });
      if(keyArray.length === 0){
        notification['error']({
          message: '注意',
          description: '没有图片上传!',
        });
        self.setState({
          isDownloadingPicture:false
        });
      	return
			}
      //查询url
      // 根据图片的key通过接口获取图片的url
      var getUrlPromiseList = [];
      keyArray.forEach((item)=>{
        var p = new Promise((res1,rej1)=>{
          cos.getObjectUrl({
            Bucket: tencentyunOssBucketName,
            Region: tencentyunOssRegion,
            Key: item,
          }, function (err, data) {
            if(err){
              rej1()
            }else{
              //返回一个对象，指明图片名称和url的对应关系
							let url = data.Url;
              res1(url)
            }
          });
        });
        getUrlPromiseList.push(p)
      });
      Promise.all(getUrlPromiseList).then((result)=>{
       	result.forEach((item)=>{
          var downloadUrl = item + (item.indexOf('?') > -1 ? '&' : '?') + 'response-content-disposition=attachment'; // 补充强制下载的参数
          window.open(downloadUrl); // 这里是新窗口打开 url，如果需要在当前窗口打开，可以使用隐藏的 iframe 下载，或使用 a 标签 download
        });
        self.setState({
          isDownloadingPicture:false
        });
        //发送请求更新已下载
				axios.post('/house_arrangement_today/picturesDownloaded',{index:index,date:date}).then((resp)=>{
					//刷新数据
          self.props.refreshData();
				})
      })
    });
	}

	render(){
		//卡片标题ReactNode
		const TitleNode = (index,isVisit,hasPreAssessment,price,_id)=>{
			return (
					<div>
						<span>{'序号: '+index}</span>
						<span className={`isvisit-badge ${isVisit?'':'novisit'}`}>{isVisit?'已看':'未看'}</span>
						<span className={`clickable isvisit-badge ${price===0?'novisit':''}`} onClick={()=>this.handlePrice(index,price,_id)}>
							{price===0?'未报价':(price+'元/m')}
							{price!==0?<sup className="cash-unit">2</sup>:''}
						</span>
						<span className={`clickable isvisit-badge ${hasPreAssessment?'':'novisit'}`}
									onClick={()=>{this.handlePreAssessment(hasPreAssessment,index,_id)}}>
							{hasPreAssessment?'已出':'未出'}
						</span>
					</div>
			)
		};
		//格式化反馈情况
		const formatFeedbackContent = (item)=>{
			let result = '',
					isEmpty = item.feedback.split('*##*').join(';')===';';
			if(isEmpty){
				result = '空'
			}else{
				let list  = [];
				list.push(item.gurantor);
				list.push(item.company);
				list.push(item.bank);
				list.push(item.roadNumber+item.detailPosition);
				list.push(item.feedTime?item.feedTime.split(' ')[0]:'');
				list.push(item.feedback.split('*##*').join(';'));
				result = list.join(' ');
			}
			return result
		};

		//根据当前页数过滤出list中数据
		const getCurrentPageListData = ()=>{
			let startPos = this.state.pageSize * (this.state.currentPage-1)
			let endPos = startPos+this.state.pageSize;
			let listData = this.props.excelLatestData.slice(startPos,endPos);
			return listData
		};

		return (
				<div className="house-arrange-excel-wrapper">
					{/*删除数据的modal*/}
					<Modal title="删除数据"
								 visible={this.state.removeModalVisible}
								 onOk={()=>this.handleRemoveModalOK()}
								 wrapClassName="vertical-center-modal"
								 cancelText={'取消'}
								 okText={'确认'}
								 confirmLoading={this.state.removeConfirmLoading}
								 onCancel={()=>this.handleRemoveModalCancel()}
					>
						<p>确认删除序号{this.state.indexToRemove}的数据?</p>
					</Modal>
					{/*修改看房人员的modal*/}
					<Modal
							title={"序号"+this.state.modifiedIndex+": 修改看房人员"}
							wrapClassName="vertical-center-modal"
							visible={this.state.modifyModalVisible}
							onOk={() => this.handleModifyModalOK()}
							confirmLoading={this.state.confirmLoading}
							okText={this.state.okText}
							cancelText={'取消修改'}
							onCancel={() => this.handleModifyModalCancel()}
					>
						<p style={{textAlign:'center'}}>当前看房人员: <span style={{color:'#39ac6a'}}>{this.state.currentStaff}</span></p>
						<div className="house-arrange-radio-group-wrapper">
							<Select defaultValue={this.state.currentStaff} style={{ width: 200 }} onChange={(v)=>this.handleStaffSelect(v)}>
								{
									this.state.totalStaffNameList.map((item,index)=>{
										return (
												<Option value={item} key={index}>{item}</Option>
										)
									})
								}
							</Select>
						</div>
					</Modal>
					{/*修改加急信息的modal*/}
					<Modal
							title={"加急信息修改"}
							wrapClassName="vertical-center-modal"
							visible={this.state.modifyUrgentModalVisible}
							onOk={() => this.handleUrgentModalOK()}
							confirmLoading={this.state.confirmLoading}
							okText={this.state.okText}
							cancelText={'取消修改'}
							onCancel={() => this.handleModifyModalCancel()}
					>
						<Input addonBefore="加急详情"  value={this.state.defaultUrgentInfo} onChange={(e)=>this.handleUrgentInfoChange(e)}/>
					</Modal>
					{/*修改报价的对话框*/}
					<Modal title="修改报价(元/m2)"
								 visible={this.state.priceModalVisible}
								 onOk={()=>this.handlePriceModalOK()}
								 wrapClassName="vertical-center-modal"
								 cancelText={'取消'}
								 okText={'确认'}
								 confirmLoading={this.state.confirmLoading}
								 onCancel={()=>this.handlePriceModalCancel()}
					>
						<div className="price-input-wrapper">
							<Input
									placeholder="请输入报价"
									prefix={<Icon type="pay-circle" style={{ color: 'rgba(0,0,0,.25)' }} />}
									value={this.state.estatePrice}
									onChange={(e)=>this.handlePriceChange(e)}
							/>
						</div>
					</Modal>
					<List
							grid={{ gutter: 16, column: 2}}
							locale={{emptyText:'数据空空如也~'}}
							dataSource={getCurrentPageListData()}
							pagination={{
								onChange: (page) => {
									this.handlePageChange(page)
								},
								current: this.state.currentPage,
								pageSize: this.state.pageSize,
								total:this.props.excelLatestData.length
							}}
							renderItem={item => {
								return (
									<List.Item>
										<Card title={TitleNode(item.index,item.isVisit,item.hasPreAssessment,item.price,item._id)}
													hoverable={true}
										>
											<div className="house-arrange-excel-content">
                        {/*查看签到位置按钮*/}
												<SignPositionBtn index={item.index}/>

												{/*删除按钮*/}
												<div className="delete-house-data-btn">
													<Tooltip title="删除该数据">
														<Icon type="close" onClick={()=>{this.removeData(item.index,item.staffName)}} style={{cursor:'pointer',fontSize:'25px',color:'#a2a2a2'}}/>
													</Tooltip>
												</div>
												{/*下载该单表单的excel按钮*/}
												<div className="download-excel-data-btn">
													<Tooltip title="下载表单数据">
														<Icon type="download" onClick={()=>{this.downloadFormDataInExcel(item.index,item.date)}} style={{cursor:'pointer',fontSize:'21px',color:'#a2a2a2'}}/>
													</Tooltip>
												</div>
                        {/*下载该单照片的按钮*/}
                        <PictureDownload
													index={item.index}
													date={item.date}
													downloadPictures={()=>this.downloadPictures(item.index,item.date)}
												/>

												<div className="house-arrange-excel-content-line-wrapper">
													<Tag color={item.isVisit?'#39ac6a':'#ff9e1e'}>房屋地址</Tag>
													<Tooltip title={item.roadNumber+item.detailPosition}>
														<span className="house-arrange-excel-content-desc">{item.roadNumber+item.detailPosition}</span>
													</Tooltip>
												</div>

												<div className="house-arrange-excel-content-line-wrapper">
													<Tag color={item.isVisit?'#39ac6a':'#ff9e1e'}>其他信息</Tag>
													<span className="house-arrange-excel-content-desc">{(item.gurantor?item.gurantor:'')+' '+item.telephone+' '+item.company}</span>
												</div>

												<div className="house-arrange-excel-content-line-wrapper">
													<Tag color={item.isVisit?'#39ac6a':'#ff9e1e'}>看房人员</Tag>
													<span className="house-arrange-excel-content-desc short-desc">{item.staffName}</span>
													<Tooltip title="修改看房人员">
														<Icon type="edit"
																	onClick={()=>this.handleModifyStaff(item.index,item.staffName)}
																	style={{marginLeft:'10px',position:'relative',top:'1px',cursor:'pointer'}}>
														</Icon>
													</Tooltip>
												</div>
												<div className="house-arrange-excel-content-line-wrapper">
													<Tag color={item.isVisit?'#39ac6a':'#ff9e1e'}>反馈情况</Tag>
													{
														item.feedback?(
																<Tooltip title={formatFeedbackContent(item)}>
																	<span className="house-arrange-excel-content-desc">{formatFeedbackContent(item)}</span>
																</Tooltip>
														):(
																<span className="house-arrange-excel-content-desc">
																	<span className="ready-to-feed" style={{color:item.isVisit?'#39ac6a':'#ff9e1e'}}>待反馈</span>
																</span>
														)
													}
												</div>
												<div className="house-arrange-excel-content-line-wrapper ">
													<Tag color={item.isVisit?'#39ac6a':'#ff9e1e'}>反馈时间</Tag>
													<span className="house-arrange-excel-content-desc">{item.feedTime?item.feedTime:<span className="ready-to-feed" style={{color:item.isVisit?'#39ac6a':'#ff9e1e'}}>待反馈</span>}</span>
												</div>
												<div className="house-arrange-excel-content-line-wrapper no-margin-bottom">
													<Tag color={item.isVisit?'#39ac6a':'#ff9e1e'} >加急情况</Tag>
													<span className="house-arrange-excel-content-desc short-desc">{item.isUrgent?item.urgentInfo:<span className="not-urgent">不加急</span>}</span>
													<Tooltip title="修改加急信息">
														<Icon type="edit"
																	onClick={()=>this.handleModifyUrgent(item.index,item.urgentInfo,item.staffName)}
																	style={{marginLeft:'10px',position:'relative',top:'1px',cursor:'pointer'}}>
														</Icon>
													</Tooltip>
												</div>
											</div>
										</Card>
									</List.Item>
							)}}
					/>
				</div>
		)
	}
}
export default HouseArrangeExcelContentList