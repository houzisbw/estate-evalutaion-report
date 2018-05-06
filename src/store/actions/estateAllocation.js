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