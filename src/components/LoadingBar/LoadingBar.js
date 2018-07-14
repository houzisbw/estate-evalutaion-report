/**
 * Created by Administrator on 2018/5/23.
 */
import React from 'react'
import './index.scss'
class LoadingBar extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			percentage:0,
			timerId:null
		}
	}
	componentDidMount(){
		this.addPercentage()
		document.onreadystatechange = ()=>{
			console.log(document.readyState)
			if (document.readyState === "complete") {

				this.setState({
					percentage:100
				})
				clearTimeout(this.state.timerId)
			}
		}
	}
	addPercentage(){
		var self = this;
		if(this.state.percentage>=100){
			clearTimeout(this.state.timerId)
			return
		}
		this.setState({
			percentage:this.state.percentage+1
		});

		var tid = setTimeout(()=>{
			self.addPercentage()
		},100);

		this.setState({
			timerId:tid
		})
	}
	render(){
		return (
			<div className="loading-bar" style={{width:this.state.percentage+'%'}}>
			</div>
		)
	}
}
export default LoadingBar