/**
 * Created by Administrator on 2018/5/5.
 */
const initialState = {
	estateList:[],
	map:null,
	markerList:[],
	estateSelectedIndex:-1,
	estateDataList:[],
	labelList:[],
	//2种类型，ESTATE_NAME, ESTATE_INDEX
	labelType:'ESTATE_NAME',
	allocationResultObj:{}
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
	//房屋当前选中项
	}else if(action.type === 'UPDATE_ESTATE_SELECTED_INDEX'){
		return Object.assign({},state,{
			estateSelectedIndex:action.selectedIndex
		})
	//房屋列表数据
	}else if(action.type === 'UPDATE_ESTATE_DATALIST'){
		return Object.assign({},state,{
			estateDataList:action.estateDataList
		})
	}
	//地图上marker的label列表
	else if(action.type === 'UPDATE_ESTATE_LABEL'){
		return Object.assign({},state,{
			labelList:action.labels
		})
	}
	//marker的label类型
	else if (action.type === 'UPDATE_LABEL_TYPE'){
		return Object.assign({},state,{
			labelType:action.labelType
		})
	}
	//分配结果
	else if (action.type === 'UPDATE_ALLOCATION_RESULT'){
		return Object.assign({},state,{
			allocationResultObj:action.result
		})
	}
	//默认返回值
	return state
};
