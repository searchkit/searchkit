import * as React from "react";
import {SearchkitManager} from "../SearchkitManager"

export interface SearchkitProps {
	searchkit:SearchkitManager
	children?:any
}

export class SearchkitProvider extends React.Component<SearchkitProps,any> {

	static childContextTypes = {
		searchkit:React.PropTypes.instanceOf(SearchkitManager)
	}

	static propTypes = {
		searchkit:React.PropTypes.instanceOf(SearchkitManager).isRequired,
		children:React.PropTypes.element.isRequired
	}

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
