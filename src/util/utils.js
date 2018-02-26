/**
 * Created by Administrator on 2018/2/26.
 */
import axios from 'axios'
import store from './../store/store'
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