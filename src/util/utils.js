/**
 * Created by Administrator on 2018/2/26.
 */
import axios from 'axios'
import store from './../store/store'
import {notification} from 'antd'
//action
import {getLoggedUser,updateUserAuth} from './../store/actions/users'
//身份验证,1代表成功，-1代表失败
export const checkAuthentication = ()=>{
	axios.get('/users/checkAuth').then((resp)=>{
		let status = resp.data.status;
		let auth = resp.data.auth;
		if(status === 1){
			//身份认证成功,发送action
			store.dispatch(getLoggedUser(true))
			//更新用户权限信息
			store.dispatch(updateUserAuth(auth))
		}else{
			//身份认证失败,发送action
			store.dispatch(getLoggedUser(false))
			store.dispatch(updateUserAuth(-1))
		}
	})
}

//全局消息提示框
export const notificationPopup = (title,content,timeToClose,type)=>{
	//错误处理机制
	let typeArray = ['success','info','warning','error'];
	let tempType = typeArray.indexOf(type) !== -1 ?type:'success';
	notification[tempType]({
		message:title,
		description:content,
		duration:timeToClose?timeToClose:3
	})
}

//金额转换为大写中文
export const moneyToChinese = (n)=>{
	if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(n))
		return "数据非法";
	var unit = "千百拾亿千百拾万千百拾元角分", str = "";
	n += "00";
	var p = n.indexOf('.');
	if (p >= 0)
		n = n.substring(0, p) + n.substr(p+1, 2);
	unit = unit.substr(unit.length - n.length);
	for (var i=0; i < n.length; i++)
		str += '零壹贰叁肆伍陆柒捌玖'.charAt(n.charAt(i)) + unit.charAt(i);
	return str.replace(/零(千|百|拾|角)/g, "零").replace(/(零)+/g, "零").replace(/零(万|亿|元)/g, "$1").replace(/(亿)万|壹(拾)/g, "$1$2").replace(/^元零?|零分/g, "").replace(/元$/g, "元整");

}

//yyyy-m-d转化为中文时间
export const dateToChinese =(date)=>{
	let d = new Date();
	let year = d.getFullYear().toString(),
		month = (d.getMonth()+1).toString(),
		day = d.getDate().toString();
	let convert = ['〇','一','二','三','四','五','六','七','八','九','十'];
	let yearStr = '',monthStr='',dayStr='';
	for(var i=0;i<year.length;i++){
		yearStr+=convert[parseInt(year[i],10)];
	}
	//月
	if(month.length>1){
		if(month[0] === '1'){
			monthStr = '十'+convert[parseInt(month[1],10)];
		}else{
			monthStr = convert[parseInt(month[0],10)]+'十'+convert[parseInt(month[1],10)];
		}
	}else{
		monthStr = convert[parseInt(month,10)]
	}
	//日
	if(day.length>1){
		if(day[0] === '1'){
			dayStr = '十'+convert[parseInt(day[1],10)];
		}else{
			dayStr = convert[parseInt(day[0],10)]+'十'+convert[parseInt(day[1],10)];
		}
	}else{
		dayStr = convert[parseInt(day,10)]
	}
	return yearStr+'年'+monthStr+'月'+dayStr+'日';


};

//函数防抖,duration为最小触发间隔
export const throttle = (fn,duration)=>{
	let timerId = null;
	return function(){
		clearTimeout(timerId);
		timerId = setTimeout(fn,duration)
	}
};

