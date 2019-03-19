/**
 * Created by Administrator on 2019/3/17 0017.
 */
/**
 * Created by Administrator on 2018/5/23.
 */
// 签到位置按钮
import React from 'react'
import axios from 'axios'
import {Tooltip,Icon,message} from 'antd'
import './index.scss'
class SignPositionBtn extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      long:'',
      lat:'',
      hasSigned:false,
    }
  }
  componentDidMount(){
    this.fetchSignPosition(this.props.index);
  }

  componentWillReceiveProps(nextProps){
    this.fetchSignPosition(nextProps.index);
  }

  // 查询签到位置信息
  fetchSignPosition(index){
    axios.post('/house_arrangement_today/fetchSignPosition',{index:index}).then((resp)=>{
      if(resp.data.status === -1){
        message.error('遇到未知错误!');
      }else{
        let pos = resp.data.pos;
        if(pos !== ','){
          let lat = pos.split(',')[0],
              long = pos.split(',')[1];
          this.setState({
            hasSigned:true,
            long:long,
            lat:lat,
          });
        }else{
          this.setState({
            hasSigned:false,
            long:'',
            lat:'',
          });
        }
      }
    })
  }

  // 弹出新窗口
  openNewWindow(){
    if(!this.state.hasSigned){
      message.error('外勤未签到!');
      return
    }

    let posStr = 'pointx='+this.state.long+'&pointy='+this.state.lat;
    let url = 'https://map.qq.com/?type=marker&isopeninfowin=1&markertype=1&'+posStr+'&name=估价对象&addr=估价对象&ref=pcmap';
    window.open(url)
  }

  render(){
    return (
      <div className="sign-position-btn">
        <Tooltip title="查看签到位置">
          <Icon
            type="environment"
            style={{cursor:'pointer',fontSize:'21px',color:'#a2a2a2'}}
            onClick={()=>{this.openNewWindow()}}
            >
          </Icon>
        </Tooltip>
      </div>
    )
  }
}
export default SignPositionBtn