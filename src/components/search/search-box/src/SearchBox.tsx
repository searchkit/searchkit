import * as React from "react";
import * as rx from "rx";
import ESClient from "../../../../domain/ESClient.ts";

require("./../styles/index.scss");

interface ISearchBox {
	searcher:ESClient
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

	getQueryObject():Object {
		if (this.state.query === "") {
			return {};
		} else {
			return {
				"query": {
					"simple_query_string": {
						"query":this.state.query,
						// "analyzer":"snowball",
						"default_operator":"and"
					}
				}
			}
		}
	}

	onSubmit(event) {
		event.preventDefault()
		this.props.searcher.setQuery(this.getQueryObject());
		this.props.searcher.search()
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
