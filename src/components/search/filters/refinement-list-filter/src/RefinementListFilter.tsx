import * as React from "react";
import * as _ from "lodash";
import * as classNames from 'classnames';
import "../styles/index.scss";

import {
	Searcher,
	SearchkitManager,
	SearchkitComponent,
	FacetAccessor,
	FastClick
} from "../../../../../core"



export interface IRefinementListFilter {
	field:string
	operator?:string
	size?:string
	title:string
	id:string
}

export class RefinementListFilter extends SearchkitComponent<IRefinementListFilter, any> {
	accessor:FacetAccessor

	shouldCreateNewSearcher() {
		return true;
	}

	defineAccessor() {
		return new FacetAccessor(
			this.props.field,
			{id:this.props.id, operator:this.props.operator, title:this.props.title}
		)
	}

	addFilter(option) {
		this.accessor.state = this.accessor.state.toggle(option.key)
		this.searchkit.performSearch()
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
			<FastClick handler={this.addFilter.bind(this, option)}>
				<div className={optionClassName} key={option.key}>
					<div className={checkedClassName}></div>
					<div className="refinement-option__text">{option.key}</div>
					<div className="refinement-option__count">{option.doc_count}</div>
				</div>
			</FastClick>
		)
	}

	hasOptions():boolean {
		return this.accessor.getBuckets().length != 0
	}

	render() {

		let className = classNames({
			"refinement-list-filter":true,
			"refinement-list-filter--disabled":!this.hasOptions(),
			[`filter--${this.props.id}`]:true
		})
		return (
			<div className={className}>
				<div className="refinement-list-filter__header">{this.props.title}</div>
				<div className="refinement-list-filter__options">
				{_.map(this.accessor.getBuckets(), this.renderOption.bind(this))}
				</div>
      </div>
		);
	}
}
