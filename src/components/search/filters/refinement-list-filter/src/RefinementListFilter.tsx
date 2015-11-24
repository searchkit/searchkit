import * as React from "react";
import ESClient from "../../../../../domain/ESClient.ts";
import * as _ from "lodash";

require("./../styles/index.scss");

interface IRefinementListFilter {
	searcher:ESClient;
}

export default class RefinementListFilter extends React.Component<IRefinementListFilter, any> {

	constructor(props:IRefinementListFilter) {
		super(props)
		this.setAggs();
	}

	setAggs() {
		this.props.searcher.setAggs("genres", {
			"terms":{"field":"genres"}
		})
	}

	addFilter(option, event) {
		this.props.searcher.addFilter("genres", option.key);
		this.props.searcher.search();
	}

	renderOption(option) {
		return (
			<div className="option" key={option.key} ref={option.key} onClick={this.addFilter.bind(this, option)}>
				{option.key}
			</div>
		)
	}

	render() {
		return (
			<div className="refinement-list-filter">
			{(() => {
				// if (_.has(this.props.searcher.results, "aggregations.genres.buckets")) {
        return _.map(this.props.searcher.results.aggregations.genres.buckets, this.renderOption.bind(this))
			})()}
      </div>
		);
	}
}
