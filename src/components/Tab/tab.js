/**
 * Created by Administrator on 2018/2/27.
 */
//选项卡组件
import React from 'react'
import PropTypes from 'prop-types'
class TabComponent extends React.Component{
	constructor(props){
		super(props);
	}
	render(){
		//如果index不是选中的index，则返回null不渲染组件,这样实现切换模板
		//index就是组件中内容排列顺序的数值,第一个是0
		return (
			<div>
				{
					React.Children.map(this.props.children,(element,index)=>{
						return (
							<div>
								{index === this.props.currentIndex ? element : null}
							</div>
						)
					})
				}
			</div>
		)
	}
}
//检查类型，只在开发环境下有效果
TabComponent.propTypes = {
	// 你可以将属性声明为JS原生类型
	currentIndex:PropTypes.number
};
export default TabComponent