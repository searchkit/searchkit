import * as React from "react";
import ESClient from "../../../../../domain/ESClient.ts";
import * as _ from "lodash";
import * as classNames from 'classnames';
import FacetAccessor from "../../../../../domain/accessors/FacetAccessor.ts";

require("./../styles/index.scss");

interface IRefinementListFilter {
	searcher:ESClient;
	field:string
	operator?:string
	size?:string
	title:string
}

export default class RefinementListFilter extends React.Component<IRefinementListFilter, any> {
	accessor:FacetAccessor

	constructor(props:IRefinementListFilter) {
		super(props)
		this.accessor = this.props.searcher.stateManager.registerAccessor(
			new FacetAccessor(this.props.field, {operator:props.operator, title:this.props.title})
		)
	}

	addFilter(option) {
		this.accessor.state.toggle(option.key)
		this.accessor.search()
	}

	renderOption(option) {
		let checkedClassName = classNames({
			"refinement-option__checkbox":true,
			"refinement-option__checkbox--checked":this.accessor.state.contains(option.key)
		})

		let optionClassName = classNames({
			"refinement-list-filter__item":true,
			"refinement-option":true,
			"refinement-option--checked":this.accessor.state.contains(option.key)
		})

		return (
			<div className={optionClassName} key={option.key} onClick={this.addFilter.bind(this, option)}>
				<div className={checkedClassName}></div>
				<div className="refinement-option__text">{option.key}</div>
				<div className="refinement-option__count">{option.doc_count}</div>
			</div>
		)
	}

	render() {
		return (
			<div className="refinement-list-filter">
				<div className="refinement-list-filter__header">{this.props.title}</div>
				<div className="refinement-list-filter__options">
				{_.map(this.accessor.getBuckets(), this.renderOption.bind(this))}
				</div>
      </div>
		);
	}
}
