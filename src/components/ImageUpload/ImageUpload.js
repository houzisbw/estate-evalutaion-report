/**
 * Created by Administrator on 2018/4/11.
 */
import React from 'react'
import './index.scss'
import axios from 'axios'
import { Upload, Icon,message} from 'antd';
const Dragger = Upload.Dragger;
class ImageUpload extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			fileList:[],
			uploadPercent:0,
			showUploadProgress:false,
			imageUrlsList:[],
			showOverlay:false,
			imageZoomUrl:''
		}
	}
	componentDidMount(){
		this.getImageUrls();
	}
	//获取图片信息
	getImageUrls(){
		//获取对应该业务对应的图片
		axios.post('/business_register/getImages',{itemIndex:this.props.itemIndex}).then((resp)=>{
			let status = resp.data.status;
			if(status === 1){
				this.setState({
					imageUrlsList:resp.data.imageUrls
				});
				//调用父组件方法改变数字
				this.props.handleBusinessImageNumChange(this.state.imageUrlsList.length);
			}else{
				message.warning('图片读取错误!');
			}
		})
	}
	//实时改变上传进度
	changeUploadProgress(percent){
		this.setState({
			uploadPercent:percent
		});
		document.querySelector('#image-upload-progress-bar').style.width = percent+'%'
	}
	//点击查看大图
	handleZoomImage(url){
		console.log(url)
		//显示大图的遮罩
		this.setState({
			showOverlay:true,
			imageZoomUrl:url
		})
	}
	closeMask(){
		this.setState({
			showOverlay:false
		})
	}
	//删除图片
	deleteImage(){
		axios.post('/business_register/deleteImage',{
			itemIndex:this.props.itemIndex,
			imageUrl:this.state.imageZoomUrl
		}).then((resp)=>{
			if(resp.data.status === 1){
				message.success('图片删除成功');
				this.getImageUrls();
				this.setState({
					showUploadProgress:false,
					uploadPercent:0
				})
			}else{
				message.error('图片删除失败');
			}
		})
	}
	render(){
		let self = this;
		const props = {
			name: 'file',
			accept:'image/*',
			showUploadList:false,
			fileList:this.state.fileList,
			data:{
				itemIndex:this.props.itemIndex
			},
			action: '/business_register/imageUpload',
			beforeUpload:()=>{
				this.setState({
					showUploadProgress:true,
					uploadPercent:0
				})
			},
			onChange(info) {
				let fileList = info.fileList;
				self.setState({ fileList })
				//获取上传中的服务端响应内容，包含了上传进度等信息，高级浏览器支持
				const status = info.file.status;
				if (status === 'uploading') {
					let eventPercent = info.event?info.event.percent:0;
					self.changeUploadProgress(Math.floor(eventPercent))
				}
				if (status === 'done') {
					message.success('图片上传成功');
					self.getImageUrls();
				} else if (status === 'error') {
					message.error('图片上传失败');
				}
			},
		};
		return (
			<div>
				{/*大图详情*/}
				{
					this.state.showOverlay?(
						<div className="image-zoom-overlay" onClick={()=>{this.closeMask()}}>
							<div className="image-zoom-overlay-image">
								<img src={this.state.imageZoomUrl}/>
							</div>
							<div className="image-zoom-operation-area">
								<div title="删除该图" className="image-zoom-delete" onClick={()=>{this.deleteImage()}}>
								</div>
							</div>
						</div>
					):null
				}
				{/*图片预览区域,模板字符串拼接className*/}
				<div className={`image-preview-area ${this.state.imageUrlsList.length===0?'image-area-empty':''}`}>
					{
						this.state.imageUrlsList.map((value,index)=>{
							return (
								<div className="image-preview-wrapper"
									 onClick={()=>{this.handleZoomImage(value)}}
									 key={index}
								>
									<img src={value}/>
								</div>
							)
						})
					}
					{/*补丁区域，防止space-between出现均分现象*/}
					{
						this.state.imageUrlsList.length%3!==0?(
							<div className="image-preview-wrapper" style={{cursor:'auto'}}>
							</div>
						):null
					}
				</div>
				<div className="image-upload-dragger-wrapper">
					<Dragger {...props}>
						<p className="ant-upload-drag-icon">
							<Icon type="inbox" />
						</p>
						<p className="ant-upload-text">点击或拖入图片进行上传</p>
					</Dragger>
				</div>
				{/*进度条*/}
				{
					this.state.showUploadProgress?(
						<div>
							<div className="progress-precent">
								<span>图片上传进度: {this.state.uploadPercent}%</span>
							</div>
							<div className="image-upload-progress-bar" id="image-upload-progress-bar">
							</div>
						</div>
					):null
				}

			</div>
		)
	}
}
export default ImageUpload