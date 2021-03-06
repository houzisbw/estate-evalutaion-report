/**
 * 今日看房情况页面
 */
import React from 'react'
import './index.scss'
import {Icon,Tabs,Modal,Tooltip,notification,Input,Checkbox} from 'antd'
import axios from 'axios'
import Loading from './../../components/Loading/Loading'
import COS from 'cos-js-sdk-v5'
import HouseArrangeExcelContentList from './../../components/HouseArrangeExcelContentList/HouseArrangeExcelContentList'
import HouseExcelDataAddModal from './../../components/HouseExcelDataAddModal/HouseExcelDataAddModal'
const {TabPane} = Tabs;
const Search = Input.Search;

//腾讯云相关
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

class HouseArrangementToday extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			excelLatestData:[],
			excelLatestVisitedData:[],
			excelLatestUnvisitedData:[],
			totalNum:0,
			isLoading:false,
			latestDate:'',
			activeTabKey:'1',
			addDataModalVisible:false,
			addModalConfirmLoading:false,
			isHistoryCheckboxShow:false,
			//默认搜索历史
			isSearchHistory:true,
			//下载excel的timerId
			downloadExcelTimerId:null,
			//搜索的关键词
			searchKeywords:'',
			//是否正在下载所有图片
			isDownloadAllPictures:false,
		};
	}
	componentDidMount(){
		//向后端请求excel数据：最近一天的所有的数据
		this.fetchData();
	}
	fetchData(){
		//防止多次点击
		if(this.state.isLoading){
			return;
		}
		this.setState({isLoading:true});
		axios.post('/house_arrangement_today/getLatestExcelData').then((resp)=>{
			this.setState({isLoading:false});
			if(resp.data.status===-1){
				Modal.error({
					title:'悲剧',
					content:'数据读取失败，请重试'
				})
			}else if(resp.data.status===0){
				//数据为空
			}else{
				this.setState({
					excelLatestData:resp.data.excelData,
					excelLatestVisitedData:resp.data.visit,
					excelLatestUnvisitedData:resp.data.unvisit,
					totalNum:resp.data.total,
					latestDate:resp.data.latestDate
				})
			}
		})
	}
	tabOnChange(key){
		this.setState({
			activeTabKey:key
		})
	}
	//刷新数据
	refresh(){
		if(this.state.searchKeywords){
			this.searchHouseData(this.state.searchKeywords);
		}else{
			this.fetchData();
		}
	}

	//添加数据
	addData(){
		this.setState({
			addDataModalVisible:true
		})
	}
	//提交表单，调用子组件的方法
	onAddDataModalOK(){
		//调用<HouseExcelDataAddModal>组件的submit方法
		let formValues = this['HouseExcelDataAddModal'].validateInputsAndSendToParent();
		//如果校验通过
		if(formValues.status === 1){
			let values = formValues.values;
			this.setState({
				addModalConfirmLoading:true
			});
			//传递给后台
			axios.post('/house_arrangement_today/saveAddedHouseData',{
				values:values
			}).then((resp)=>{
				if(resp.data.status===1){
					//保存成功
					notification['success']({
						message: '恭喜',
						description: '数据添加成功!',
					});
				}else{
					//保存失败
					notification['error']({
						message: 'Oops',
						description: '数据添加失败!请重试',
					});
				}
				//关闭对话框
				this.setState({
					addDataModalVisible:false,
					addModalConfirmLoading:false
				});
				this.refresh();
			})
		}else{
			//校验不通过
		}
	}
	onAddDataModalCancel(){
		this.setState({
			addDataModalVisible:false
		})
	}
	//处理是否搜索历史项
	handleHistorySearchChange(e){
		this.setState({
			isSearchHistory:e.target.checked
		})
	}
	//处理输入框鼠标移入移出
	handleSearchEnterAndLeave(isEnter){
		if(isEnter){
			this.setState({
				isHistoryCheckboxShow:true
			})
		}else{
			this.setState({
				isHistoryCheckboxShow:false
			})
		}
	}
	//搜索派单
	searchHouseData(v){
		if(!v){
			notification['error']({
				message: '注意',
				description: '关键词不能为空!',
			});
			return
		}
		//进入loading状态
		this.setState({
			isLoading:true,
			searchKeywords:v
		});
		axios.post('/house_arrangement_today/searchHouseData',{
			keyword:v,
			isHistory:this.state.isSearchHistory?'1':'0',
			latestDate:this.state.latestDate
		}).then((resp)=>{
			this.setState({
				isLoading:false
			});
			if(resp.data.status === -1){
				notification['error']({
					message: '注意',
					description: '搜索出错请稍后重试!',
				});
			}else{
				this.setState({
					excelLatestData:resp.data.excelData,
					excelLatestVisitedData:resp.data.visit,
					excelLatestUnvisitedData:resp.data.unvisit,
					totalNum:resp.data.total
				})
			}
		})
	}
	//下载当天派单excel
	downloadExcel(){
		if(this.state.downloadExcelTimerId){
			clearTimeout(this.state.downloadExcelTimerId);
			this.setState({
				downloadExcelTimerId:null
			});
		}
		notification['warning']({
			message: '注意',
			description: '1秒后开始下载!',
		});
		//延迟1秒下载
		let timerId = setTimeout(()=>{
			//生成一张空白的excel工作簿
			let wb = window.XLSX.utils.book_new();
			let dataInExcel = [];
			this.state.excelLatestData.forEach((item)=>{
				dataInExcel.push({
					A:item.index,
					B:item.isVisit?'已看':'未看',
					C:item.feedback.replace(/\*##\*/g,'')
				})
			});
			let ws = window.XLSX.utils.json_to_sheet(dataInExcel,{
				headers:['A','B','C'],skipHeader:true
			});
			//将worksheet添加到工作簿上
			window.XLSX.utils.book_append_sheet(wb, ws, '派单情况');
			//获取当日日期
			let date = new Date();
			let dateStr = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
			//下载
			window.XLSX.writeFile(wb,'派单情况'+dateStr+'.xlsx');
		},1000);
		this.setState({
			downloadExcelTimerId:timerId
		})
	}

	// 下载最近一次已看但未下载的照片
  handleDownloadPictures(){
		if(this.state.isDownloadAllPictures)return
		let self = this;
		this.setState({
      isDownloadAllPictures:true
		});
		//传递参数，最近一次的日期
		let latestDate = this.state.latestDate;
		axios.post('/house_arrangement_today/downloadCanDownloadButHasNotDownloadedPictures',{
			date:latestDate
		}).then((resp)=>{
			if(resp.data.status === -1){
        notification['error']({
          message: '注意',
          description: '下载出错请重试!',
        });
			}else{
				// 待下载的照片单号index
				let indexArray = resp.data.indexArray;
				let allPicturesUrlArray = [];
				// 多个promise，每个通过index来获取到其所有的图片的key(名称)
				let indexPromiseList = [];
				indexArray.forEach((item)=>{
					let promise = new Promise((res,rej)=>{
            cos.getBucket({
              Bucket: tencentyunOssBucketName,
              Region: tencentyunOssRegion,
              Prefix: item+'-',
            }, function(err, data) {
             	if(err){
             		res([])
							}else{
                let keyArray = [];
                data.Contents.forEach((item)=>{
                  keyArray.push(item.Key)
                });
             		res(keyArray)
							}
            })
					});
          indexPromiseList.push(promise)
				});
       	Promise.all(indexPromiseList).then((result)=>{

					result.forEach((item)=>{
						item.forEach((subItem)=>{
              allPicturesUrlArray.push(subItem)
						})
					});

					// 进行下载操作
					let downloadPicturesPromiseList = [];
          allPicturesUrlArray.forEach((item)=>{
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
            downloadPicturesPromiseList.push(p)
					});
          Promise.all(downloadPicturesPromiseList).then((result)=>{
            result.forEach((item)=>{
              let downloadUrl = item + (item.indexOf('?') > -1 ? '&' : '?') + 'response-content-disposition=attachment'; // 补充强制下载的参数
              window.open(downloadUrl); // 这里是新窗口打开 url，如果需要在当前窗口打开，可以使用隐藏的 iframe 下载，或使用 a 标签 download
            });
					});
          self.setState({
            isDownloadAllPictures:false
          });
          //更新页面
					self.refresh();
				})
				// 下载完成后更新所有单的照片为已下载
			}
		},()=>{
      self.setState({
        isDownloadAllPictures:false
      });
		})
	}

	render(){
		return (
				<div>
					<div className="my-page-wrapper">
						{/*添加数据的对话框*/}
						<Modal
								title="添加看房数据"
								centered={true}
								wrapClassName="vertical-center-modal"
								maskClosable={false}
								destroyOnClose={true}
								confirmLoading={this.state.addModalConfirmLoading}
								visible={this.state.addDataModalVisible}
								onOk={() => this.onAddDataModalOK()}
								onCancel={() => this.onAddDataModalCancel()}
								okText="添加"
								cancelText="取消"
						>
								<HouseExcelDataAddModal wrappedComponentRef={(inst) => this['HouseExcelDataAddModal'] = inst}/>
						</Modal>
						{/*页面title*/}
						<div className="page-title">
							<div className="template-desc">
								<i className="fa fa-briefcase padding-right"></i>
								<span>最近一次看房情况</span>
							</div>
						</div>
						<div className="template-content">
							{
								this.state.isLoading?(<Loading />):(
										<div>
											{/*看房时间*/}
											<div className="latest-visit-wrapper">
												<Icon type="clock-circle-o" style={{fontSize:'25px',color:'#39ac6a'}}/>
												<span className="latest-visit-time">{this.state.latestDate}</span>
												<Tooltip title="点此刷新数据">
													<Icon type="sync" onClick={()=>{this.fetchData()}} style={{cursor:'pointer',fontSize:'25px',color:'#39ac6a',float:'right',marginRight:'20px'}}/>
												</Tooltip>
												<Tooltip title="点此添加数据">
													<Icon type="plus-square-o" onClick={()=>{this.addData()}} style={{cursor:'pointer',fontSize:'25px',color:'#39ac6a',float:'right',marginRight:'20px'}}/>
												</Tooltip>
												<Tooltip title="点此下载Excel">
													<Icon type="download" onClick={()=>{this.downloadExcel()}} style={{cursor:'pointer',fontSize:'25px',color:'#39ac6a',float:'right',marginRight:'20px'}}/>
												</Tooltip>
												<Tooltip title="点此下载最近一天所有已看但未下载的照片">
													<Icon type="folder" onClick={()=>{this.handleDownloadPictures()}} style={{cursor:'pointer',fontSize:'25px',color:'#39ac6a',float:'right',marginRight:'20px'}}/>
												</Tooltip>
												<div className="house-data-search-wrapper"
														 onMouseLeave={()=>{this.handleSearchEnterAndLeave(false)}}
														 onMouseEnter={()=>{this.handleSearchEnterAndLeave(true)}}>
													<Search
															placeholder="派单关键字"
															onSearch={(v)=>{this.searchHouseData(v)}}
															enterButton
													/>
													<div className={`house-data-history-wrapper ${this.state.isHistoryCheckboxShow?'':'history-hide'}`}>
														<Checkbox onChange={(e)=>{this.handleHistorySearchChange(e)}}
																			defaultChecked={this.state.isSearchHistory}
														>
															查询历史
														</Checkbox>
													</div>
												</div>
											</div>
											{/*tab区域*/}
											<div className="latest-visit-tab">
												<Tabs defaultActiveKey={this.state.activeTabKey} size={'large'} onChange={(activeKey)=>this.tabOnChange(activeKey)}>
													<TabPane tab={"全部房屋("+this.state.totalNum+')'} key="1">
														<HouseArrangeExcelContentList
																refreshData={()=>this.refresh()}
																latestDate={this.state.latestDate}
																excelLatestData={this.state.excelLatestData}
														/>
													</TabPane>
													<TabPane tab={"已看房屋("+this.state.excelLatestVisitedData.length+')'} key="2">
														<HouseArrangeExcelContentList
																refreshData={()=>this.refresh()}
																latestDate={this.state.latestDate}
																excelLatestData={this.state.excelLatestVisitedData}
														/>
													</TabPane>
													<TabPane tab={"未看房屋("+this.state.excelLatestUnvisitedData.length+')'} key="3">
														<HouseArrangeExcelContentList
																refreshData={()=>this.refresh()}
																latestDate={this.state.latestDate}
																excelLatestData={this.state.excelLatestUnvisitedData}
														/>
													</TabPane>
												</Tabs>
											</div>
										</div>
								)
							}
						</div>
					</div>
					{/*补丁区域*/}
					<div className="bottom-padding">
					</div>
				</div>
		)
	}
}
export default  HouseArrangementToday
