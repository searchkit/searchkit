import * as React from "react";
import ESClient from "../../../../../domain/ESClient.ts";
import ElasticAccessors from "../../../../../domain/accessors/ElasticAccessors.ts"
import * as _ from "lodash";
import * as classNames from 'classnames';
import {StateAccessorRef} from "../../../../../domain/StateAccessors.ts"

require("./../styles/index.scss");

interface IMultiSelectFilter {
	searcher:ESClient;
	field:string
	operator?:string
}

export default class MultiSelectFilter extends React.Component<IMultiSelectFilter, any> {
	accessor:StateAccessorRef

	constructor(props:IMultiSelectFilter) {
		super(props)
		this.setAggs();
		this.accessor = this.props.searcher.accessors.registerAccessor(
			this.props.field,
			ElasticAccessors.facetFilter
		)
	}

	setAggs() {
		// this.props.searcher.setAggs(this.props.field, {
    //   "filter":{
    //     "match_all": {}
    //   },
		// 	"aggs": {
    //     [this.props.field]:{
    //       "terms":{"field":this.props.field}
    //     }
    //   }
		// })
	}

	addFilter(option) {
		this.accessor.toggle(option.key)
	}

	renderOption(option) {
		let className = classNames({
			"option__checkbox":true,
			"option__checkbox--checked":this.accessor.contains(option.key)
		})

		return (
			<div className="option" key={option.key} ref={option.key} onClick={this.addFilter.bind(this, option)}>
				<div className={className}></div>
				<div className="option__text">{option.key}</div>
				<div className="option__count">{option.doc_count}</div>
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
