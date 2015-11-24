import * as React from "react";
import * as rx from "rx";
import ESClient from "../../../../domain/ESClient.ts";

require("./../styles/index.scss");

interface ISearchBox {
	search:ESClient
}

export default class SearchBox extends React.Component<ISearchBox, any> {

	constructor (props:ISearchBox) {
		super(props);
		this.state = {
			query:""
		}
		this.onSubmit = this.onSubmit.bind(this)
		this.onChange = this.onChange.bind(this)
	}

	onSubmit(event) {
		event.preventDefault()
		this.props.search.setQuery(this.state.query);
		this.props.search.search().then((results:any) => {
			console.log(results.data.hits);
		})
	}

	onChange(event) {
		this.setState({query: event.target.value});
	}

	render() {
		return (
			<div className="query-input">
        <form onSubmit={this.onSubmit}>
          <div className="query-input__icon"></div>
          <input
						ref="queryField"
						type="text"
						defaultValue={this.state.query}
						onChange={this.onChange}
						placeholder="search"
						className="query-input__text"/>
          <input type="submit" className="query-input__action"/>
        </form>
      </div>
		);
	}
}
