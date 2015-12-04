import * as React from "react";
import * as Rx from "rx"
import {Searcher} from "../Searcher"

export interface ISearcherProvider {
	searcher:Searcher
	children?:any
}

export class SearcherProvider extends React.Component<ISearcherProvider,any> {
	static childContextTypes = {
		searcher:React.PropTypes.instanceOf(Searcher)
	}

	getChildContext(){
		return {searcher:this.props.searcher}
	}

	render(){
		return this.props.children
	}
}
