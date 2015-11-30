import * as React from "react";
import ESClient from "../domain/ESClient.ts"


interface ISearcherProvider {
	searcher:ESClient
	children?:any
}

export default class SearchkitProvider extends React.Component<ISearcherProvider,any> {
	static childContextTypes = {
		searcher:React.PropTypes.instanceOf(ESClient)
	}
	getChildContext(){
		return {searcher:this.props.searcher}
	}

	render(){
		return this.props.children
	}
}
