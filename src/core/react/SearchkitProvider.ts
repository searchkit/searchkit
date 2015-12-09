import * as React from "react";
import {SearchkitManager} from "../SearchkitManager"

export interface ISearcherProvider {
	searchkit:SearchkitManager
	children?:any
}

export class SearchkitProvider extends React.Component<ISearcherProvider,any> {
	static childContextTypes = {
		searchkit:React.PropTypes.instanceOf(SearchkitManager)
	}
	results:any

	componentDidMount(){
		this.props.searchkit.completeRegistration()
	}

	getChildContext(){
		return {searchkit:this.props.searchkit}
	}

	render(){
		return this.props.children
	}
}
