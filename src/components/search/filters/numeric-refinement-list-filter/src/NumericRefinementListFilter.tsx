import * as React from "react";
import * as _ from "lodash";
import * as classNames from 'classnames';
import "../styles/index.scss";

import {
	Searcher,
	SearchkitManager,
	SearchkitComponent,
	NumericOptionsAccessor,
	FastClick
} from "../../../../../core"

export interface INumericRefinementListFilter {
	field:string
	title:string
  options:[{title:string, from?:number, to?:number}]
	id:string
}

export class NumericRefinementListFilter extends SearchkitComponent<INumericRefinementListFilter, any> {
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
		this.accessor.state = this.accessor.state.setValue(option);
		this.searchkit.performSearch()
	}

	isSelected(option) {
		let val:any = this.accessor.state.getValue()
		return val && val.key == option.key;
	}

	renderOption(option) {

		let optionClassName = classNames({
			"menu-list-options__item":true,
			"menu-list-option":true,
			"menu-list-option--checked":this.isSelected(option)
		})

		return (
			<FastClick handler={this.addFilter.bind(this, option)} key={option.key}>
				<div className={optionClassName}>
					<div className="menu-list-option__text">{this.translate(option.key)}</div>
					<div className="menu-list-option__count">{option.doc_count}</div>
				</div>
			</FastClick>
		)
	}

	render() {
		var className = classNames({
			"menu-list":true,
			[`filter--${this.props.id}`]:true
		})
		return (
			<div className={className}>
				<div className="menu-list__header">{this.props.title}</div>
				<div className="menu-list-options">
				{_.map(this.accessor.getBuckets(), this.renderOption.bind(this))}
				</div>
			</div>
		);
	}
}
