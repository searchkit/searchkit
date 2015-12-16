import * as React from "react";
import * as _ from "lodash";
import * as classNames from 'classnames';
import "../styles/index.scss";

import {
	Searcher,
	SearchkitManager,
	SearchkitComponent,
	NumericOptionsAccessor,
	NumericOptions,
	FastClick
} from "../../../../../core"


export class NumericRefinementListFilter extends SearchkitComponent<NumericOptions, any> {
	accessor:NumericOptionsAccessor

	shouldCreateNewSearcher() {
		return true;
	}

	defineAccessor() {
		return new NumericOptionsAccessor(
			this.props.id,
			{id:this.props.id, field:this.props.field, options:this.props.options, title:this.props.title}
		)
	}

	addFilter(option) {
		this.accessor.state = this.accessor.state.toggle(option.key)
		this.searchkit.performSearch()
	}

	isSelected(option) {
		return this.accessor.state.getValue() == option.key;
	}

	renderOption(option) {

		let optionClassName = classNames({
			"numeric-refinement-list-options__item":true,
			"numeric-refinement-list-option":true,
			"numeric-refinement-list-option--checked":this.isSelected(option)
		})

		return (
			<FastClick handler={this.addFilter.bind(this, option)} key={option.key}>
				<div className={optionClassName}>
					<div className="numeric-refinement-list-option__text">{this.translate(option.key)}</div>
					<div className="numeric-refinement-list-option__count">{option.doc_count}</div>
				</div>
			</FastClick>
		)
	}

	render() {
		var className = classNames({
			"numeric-refinement-list":true,
			[`filter--${this.props.id}`]:true
		})
		return (
			<div className={className}>
				<div className="numeric-refinement-list__header">{this.props.title}</div>
				<div className="numeric-refinement-list-options">
				{_.map(this.accessor.getBuckets(), this.renderOption.bind(this))}
				</div>
			</div>
		);
	}
}
