/**
 * Created by Administrator on 2019/3/14 0014.
 */
import React from 'react';
import {Icon,Tooltip,message} from 'antd'
import './index.scss'
import COS from 'cos-js-sdk-v5'
import axios from 'axios'
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


//下载图片按钮组件
class PictureDownload extends React.Component{
  _isMounted = false;
  constructor(props){
    super(props);
    this.state = {
      isGreen:false,
      hasDownload:false
    }
  }
  componentDidMount(){
    this._isMounted = true;
    // 发送请求获取图片数量
    let index = this.props.index;
    let date = this.props.date;
    this.fetchCanDownload(index);
    this.fetchHasDownloadPictures(index,date);
  }
  componentWillReceiveProps(nextProps){
    this.fetchCanDownload(nextProps.index);
    this.fetchHasDownloadPictures(nextProps.index,nextProps.date);
  }

  componentWillUnmount() {
    //在组件被卸载时将_isMounted更新为false，表示组件已卸载
    this._isMounted = false;
  }

  //获取是否可以下载图片
  fetchCanDownload(index){
    axios.post('/house_arrangement_today/fetchCanDownload',{index:index}).then((resp)=>{
      if(resp.data.status === -1){
        message.error('遇到未知错误!');
      }else{
        let can = resp.data.can;
        if(this._isMounted) {
          this.setState({
            isGreen: can
          })
        }
      }
    })
  }

  //是否已经下载了照片
  fetchHasDownloadPictures(index,date){
    axios.post('/house_arrangement_today/fetchHasDownloadPictures',{index:index,date:date}).then((resp)=>{
      if(resp.data.status === -1){
        message.error('遇到未知错误!');
      }else{
        let has = resp.data.hasDownload;
        if(this._isMounted) {
          this.setState({
            hasDownload: has
          })
        }
      }
    })
  }

  render(){
    return (
      <div className="download-picture-btn">
        <Tooltip title="下载表单照片">
          <Icon
            type="folder"
            onClick={this.props.downloadPictures}
            style={{cursor:'pointer',fontSize:'21px',color:this.state.isGreen?'#40A25D':'#a2a2a2'}}>
            {
              this.state.hasDownload?(<span className="has-download">已下载</span>):null
            }
          </Icon>
        </Tooltip>
      </div>
    )
  }
}
export default  PictureDownload