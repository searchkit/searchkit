import * as React from "react";
import * as rx from "rx";
import ESClient from "../../../../domain/ESClient.ts";
import SimpleQueryAccessor from "../../../../domain/accessors/SimpleQueryAccessor.ts";
require("./../styles/index.scss");

interface ISearchBox {
	searcher:ESClient
}

export default class SearchBox extends React.Component<ISearchBox, any> {
	accessor:SimpleQueryAccessor

	constructor (props:ISearchBox) {
		super(props);
		this.onSubmit = this.onSubmit.bind(this)
		this.accessor = this.props.searcher.stateManager.registerAccessor(
			new SimpleQueryAccessor("q")
		)
	}

	onSubmit(event) {
		// event.preventDefault()
		// this.props.searcher.setQuery(this.getQueryObject());
		// this.props.searcher.search()
		event.preventDefault()
		this.accessor.state.clearAll()
		this.accessor.state.set(this.refs["queryField"]["value"])
		this.accessor.search()
	}

	getDefaultValue(){
		const state = this.accessor.state.get()
		return (state && state[0]) || ""
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
