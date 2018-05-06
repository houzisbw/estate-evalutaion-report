/**
 * Created by Administrator on 2018/5/5.
 */
const initialState = {
	estateList:[],
	map:null,
	markerList:[]
};
//处理房屋派单的reducer
export const UpdateEstateAllocationReducer = (state = initialState, action)=>{
	//更新房屋列表
	if (action.type === 'UPDATE_ESTATE_ALLOCATION_LIST') {
		return Object.assign({}, state,{
			estateList:action.list
		})
	//保存百度地图实例
	}else if(action.type === 'SAVE_BAIDUMAP_INSTANCE'){
		return Object.assign({},state,{
			map:action.map
		})
	//保存房屋marker实例
	}else if(action.type === 'SAVE_ESTATE_MARKER'){
		return Object.assign({},state,{
			markerList:action.markers
		})
	}
	//默认返回值
	return state
};
