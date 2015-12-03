import * as React from "react";
import * as Rx from "rx"
import SearchkitManager from "./SearchkitManager.ts"

export interface ISearcherProvider {
	searchkit:SearchkitManager
	children?:any
}

export default class SearchkitProvider extends React.Component<ISearcherProvider,any> {
	static childContextTypes = {
		searchkit:React.PropTypes.instanceOf(SearchkitManager)
	}
	results:any
	searcherUnsubscribe:Rx.IDisposable

	componentWillMount(){
		this.searcherUnsubscribe = this.props.searchkit.resultsListener.subscribe(
			()=> this.forceUpdate()
		)
	}
	componentDidMount(){
		this.props.searchkit.completeRegistration()
	}

	componentWillUnmount(){
		this.searcherUnsubscribe.dispose()
	}

	getChildContext(){
		return {searchkit:this.props.searchkit}
	}

	render(){
		return this.props.children
	}
}
