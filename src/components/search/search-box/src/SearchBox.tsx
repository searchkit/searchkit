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
		this.onChange = this.onChange.bind(this)
		this.accessor = this.props.searcher.stateManager.registerAccessor(
			new SimpleQueryAccessor("q")
		)
	}

	onSubmit(event) {
		event.preventDefault()
		const val = this.getValue()
		this.accessor.triggerSearchReset()
		this.accessor.state.set(val)
		this.accessor.search()
	}

	getValue(){
		return this.accessor.state.get()
	}

	onChange(event){
		this.accessor.state.set(event.target.value)
		this.forceUpdate()
	}

	render() {
		return (
			<div className="search-box">
        <form onSubmit={this.onSubmit}>
          <div className="search-box__icon"></div>
          <input
						ref="queryField"
						type="text"
						value={this.getValue()}
						onChange={this.onChange}
						placeholder="search"
						className="search-box__text"/>
          <input type="submit" value="search" className="search-box__action"/>
        </form>
      </div>
		);
	}
}
