import * as React from "react";
import ESClient from "../domain/ESClient.ts"
import * as Rx from "rx"

export interface ISearcherProvider {
	searcher:ESClient
	children?:any
}

export default class SearchkitProvider extends React.Component<ISearcherProvider,any> {
	static childContextTypes = {
		searcher:React.PropTypes.instanceOf(ESClient)
	}

	private searcher: ESClient;
	results:any
	searcherUnsubscribe:Rx.IDisposable

	constructor(props:ISearcherProvider){
		super(props)
		this.searcher = props.searcher
	}

	componentWillMount(){
		this.searcherUnsubscribe = this.searcher.resultsListener.subscribe(
			()=> this.forceUpdate()
		)
	}
	componentDidMount(){
		this.searcher.completeRegistration()
	}

	componentWillUnmount(){
		this.searcherUnsubscribe.dispose()
	}

	getChildContext(){
		return {searcher:this.props.searcher}
	}

	render(){
		return this.props.children
	}
}
