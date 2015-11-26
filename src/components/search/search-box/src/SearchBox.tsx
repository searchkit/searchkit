import * as React from "react";
import * as rx from "rx";
import ESClient from "../../../../domain/ESClient.ts";
import {StateAccessorRef} from "../../../../domain/StateAccessors.ts"
require("./../styles/index.scss");

interface ISearchBox {
	searcher:ESClient
}

export default class SearchBox extends React.Component<ISearchBox, any> {
	accessor:StateAccessorRef

	constructor (props:ISearchBox) {
		super(props);
		this.state = {
			query:""
		}
		this.onSubmit = this.onSubmit.bind(this)
		// this.onChange = this.onChange.bind(this)
		// this.accessor = this.props.searcher.accessors.registerAccessor("q", (key, data, queryStr)=>{
		// 	if(queryStr){
		// 		_.defaultsDeep(data, {
		// 			query:{
		// 				"simple_query_string": {
		// 					"query":queryStr,
		// 					"default_operator":"and"
		// 				}
		// 			}
		// 		})
		// 	}
		// })
	}

	getQueryObject():Object {
		if (this.state.query === "") {
			return null;
		} else {
			return {
				"simple_query_string": {
					"query":this.state.query,
					"default_operator":"and"
				}
			}
		}
	}

	onSubmit(event) {
		// event.preventDefault()
		// this.props.searcher.setQuery(this.getQueryObject());
		// this.props.searcher.search()
		event.preventDefault()
		this.accessor.clearAll()
		this.accessor.set(this.refs["queryField"]["value"])
	}

	// onChange(event) {
	// 	this.setState({query: event.target.value});
	// }

	getDefaultValue(){
		// console.log(this.accessor.get())
		// return (this.accessor.get() || [])[0]
		return ""
	}

	render() {
		return (
			<div className="query-input">
        <form onSubmit={this.onSubmit}>
          <div className="query-input__icon"></div>
          <input
						ref="queryField"
						type="text"
						defaultValue={this.getDefaultValue()}
						placeholder="search"
						className="query-input__text"/>
          <input type="submit" value="search" className="query-input__action"/>
        </form>
      </div>
		);
	}
}
