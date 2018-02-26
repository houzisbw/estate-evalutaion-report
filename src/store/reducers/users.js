/**
 * Created by Administrator on 2018/2/26.
 */
//user的身份初始状态
//userAuth:-1未登录,0超管,1普通用户
const initialState = {
	pending: true,
	logged: false
}
//响应user的身份action
export const loggedUserReducer = (state = initialState, action) => {
	if (action.type === 'GET_LOGGED_USER') {
		return Object.assign({}, state, {
			pending: false,
			logged: action.logged
		})
	}
	if (action.type === 'USER_LOGOUT') {
		//注意这里登出必须设置pending为true
		return Object.assign({}, state, {
			pending: true,
			logged: false
		})
	}
	//默认返回值
	return state
}


//更新用户权限,这里的state和上面分开，一个reducer一个单独的state
const userAuthInitialState = {
	userAuth:-1
};
export const updateUserAuthReducer = (state = userAuthInitialState, action) => {
	if (action.type === 'UPDATE_USER_AUTH') {
		return Object.assign({}, state, {
			userAuth:action.auth
		})
	}
	//默认返回值
	return state
}


