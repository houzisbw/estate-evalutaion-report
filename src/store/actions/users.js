/**
 * Created by Administrator on 2018/2/26.
 */
//用户action创建函数
//action:开始获取用户身份,进入加载状态
export const getLoggedUser = (logged)=>{
	return {
		type:'GET_LOGGED_USER',
		logged:logged
	}
}

//action:登出
export const userLogout = ()=>{
	return {
		type:'USER_LOGOUT'
	}
}

//更新用户权限
export const updateUserAuth = (auth)=>{
	return {
		type:'UPDATE_USER_AUTH',
		auth:auth
	}
}