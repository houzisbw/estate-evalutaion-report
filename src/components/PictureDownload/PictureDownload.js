/**
 * Created by Administrator on 2019/3/14 0014.
 */
import React from 'react';
import {Icon,Tooltip} from 'antd'
import './index.scss'
import COS from 'cos-js-sdk-v5'
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
    }
  }
  componentDidMount(){
    this._isMounted = true;
    // 发送请求获取图片数量
    let index = this.props.index;
    this.getPictureNumByIndex(index);
  }
  componentWillReceiveProps(nextProps){
    this.getPictureNumByIndex(nextProps.index);
  }

  componentWillUnmount() {
    //在组件被卸载时将_isMounted更新为false，表示组件已卸载
    this._isMounted = false;
  }

  //根据index获取图片数量
  getPictureNumByIndex(index){
    let self = this;
    cos.getBucket({
      Bucket: tencentyunOssBucketName,
      Region: tencentyunOssRegion,
      Prefix: index+'-',
    }, function(err, data) {
      let len = data.Contents.length;
      if(self._isMounted){
        self.setState({
          isGreen:len>0
        })
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
            style={{cursor:'pointer',fontSize:'21px',color:this.state.isGreen?'#40A25D':'#a2a2a2'}}/>
        </Tooltip>
      </div>
    )
  }
}
export default  PictureDownload