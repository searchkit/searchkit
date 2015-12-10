import * as React from "react";
import * as _ from "lodash";
import * as classNames from 'classnames';
import {
	Searcher,
	SearchkitManager,
	SearchkitComponent,
	FacetAccessor,
	FastClick
} from "../../../../../core"

require("./../styles/index.scss");

export interface IMenuFilter {
	field:string
	title:string
	id:string
}

export class MenuFilter extends SearchkitComponent<IMenuFilter, any> {
	accessor:FacetAccessor

	shouldCreateNewSearcher() {
		return true;
	}

	defineAccessor() {
		return new FacetAccessor(
			this.props.field,
			{id:this.props.id, operator:"OR", title:this.props.title}
		)
	}

	addFilter(option) {
		this.accessor.state = this.accessor.state.clear();
		if (option != "all") {
			this.accessor.state = this.accessor.state.add(option.key);
		}
		this.searchkit.performSearch()
	}

	renderOption(option) {

		let optionClassName = classNames({
			"menu-list-options__item":true,
			"menu-list-option":true,
			"menu-list-option--checked":this.accessor.state.contains(option.key)
		})

		return (
			<FastClick handler={this.addFilter.bind(this, option)}>
				<div className={optionClassName} key={option.key}>
					<div className="menu-list-option__text">{option.key}</div>
				</div>
			</FastClick>
		)
	}

	renderAllOption() {
		let optionClassName = classNames({
			"menu-list-options__item":true,
			"menu-list-option":true,
			"menu-list-option--checked":!this.accessor.state.getValue()
		})

		return (
			<FastClick handler={this.addFilter.bind(this, "all")}>
				<div className={optionClassName} key="all">
					<div className="menu-list-option__text">All</div>
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
				<div className="menu-list-options">
				{this.renderAllOption()}
				{_.map(this.accessor.getBuckets(), this.renderOption.bind(this))}
				</div>
			</div>
		);
	}
}
