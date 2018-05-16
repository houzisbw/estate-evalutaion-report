/**
 * Created by Administrator on 2018/5/5.
 */
//房屋派单的actions

//获取房屋列表信息
export const GetEstateAllocationList = ()=>{
	return {
		type:'GET_ESTATE_ALLOCATION_LIST'
	}
};

//更新房屋列表信息
export const UpdateEstateAllocationList = (estateList)=>{
	return {
		type:'UPDATE_ESTATE_ALLOCATION_LIST',
		list:estateList
	}
};

//百度地图实例
export const SaveBaiduMapInstance = (mapInstance)=>{
	return {
		type:'SAVE_BAIDUMAP_INSTANCE',
		map:mapInstance
	}
}

//地图上所有房屋marker的实例,markers是数组
export const SaveMapEstateMarker = (markers)=>{
	return {
		type:'SAVE_ESTATE_MARKER',
		markers:markers
	}
}

//右侧房屋列表当前选中项的index
export const UpdateEstateListSelectedIndex = (currentIndex)=>{
	return {
		type:'UPDATE_ESTATE_SELECTED_INDEX',
		selectedIndex:currentIndex
	}
}

//右侧房屋列表数据
export const UpdateEstateDataList = (list)=>{
	return {
		type:'UPDATE_ESTATE_DATALIST',
		estateDataList:list
	}
}

//地图上所有label实例的列表
export const UpdateMapEstateLabel = (labels)=>{
	return {
		type:'UPDATE_ESTATE_LABEL',
		labels:labels
	}
}

//地图marker的label类别
export const UpdateMarkerLabelType = (type) =>{
	return {
		type:'UPDATE_LABEL_TYPE',
		labelType:type
	}
}

//房屋分配结果的对象{人员：房屋名}
export const UpdateAllocationResultObj = (resultObj)=>{
	return {
		type:'UPDATE_ALLOCATION_RESULT',
		result:resultObj
	}
}

//存储{序号:房屋名}的对应关系
export const UpdateIndexToEstateNameObj = (obj)=>{
	return {
		type:'UPDATE_INDEX_TO_ESTATE_NAME',
		obj:obj
	}
}

//存储是否进行了派单操作
export const UpdateArrangeAction = (isArrange)=>{
	return {
		type:'UPDATE_ARRANGE_ACTION',
		isArrange:isArrange
	}
}