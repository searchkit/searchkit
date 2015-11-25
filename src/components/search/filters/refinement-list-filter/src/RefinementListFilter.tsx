import * as React from "react";
import ESClient from "../../../../../domain/ESClient.ts";
import * as _ from "lodash";

require("./../styles/index.scss");

interface IRefinementListFilter {
	searcher:ESClient;
	field:string
}

export default class RefinementListFilter extends React.Component<IRefinementListFilter, any> {

	constructor(props:IRefinementListFilter) {
		super(props)
		this.setAggs();
	}

	setAggs() {
		this.props.searcher.setAggs(this.props.field, {
			"terms":{"field":this.props.field}
		})
	}

	addFilter(option) {
		this.props.searcher.toggleFilter(this.props.field, option.key);
		this.props.searcher.search();
	}

	renderOption(option) {

		let isChecked:boolean = this.props.searcher.hasFilter(this.props.field, option.key)

		return (
			<div className="option" key={option.key} ref={option.key} onClick={this.addFilter.bind(this, option)}>
				<input type="checkbox" checked={isChecked}></input>
				<div className="option__text">{option.key}</div>
			</div>
		)
	}

	render() {
		return (
			<div className="refinement-list-filter">
				<div className="refinement-list-filter__header">{this.props.field}</div>
				<div className="refinement-list-filter__options">
			{(() => {
				if (_.has(this.props.searcher.results, `aggregations.${this.props.field}.buckets`)) {
	        return _.map(this.props.searcher.results.aggregations[this.props.field].buckets, this.renderOption.bind(this))
				}
			})()}
				</div>
      </div>
		);
	}
}
