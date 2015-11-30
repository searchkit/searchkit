import * as React from "react";
import ESClient from "../../../../../domain/ESClient.ts";
import FacetAccessor from "../../../../../domain/accessors/FacetAccessor.ts";
import * as _ from "lodash";
import * as classNames from 'classnames';

require("./../styles/index.scss");

interface IMenuFilter {
	field:string
	searcher:ESClient
	title:string
}

export default class MenuFilter extends React.Component<IMenuFilter, any> {
	accessor:FacetAccessor

	constructor(props:IMenuFilter) {
		super(props)
		this.accessor = this.props.searcher.stateManager.registerAccessor(
			new FacetAccessor(this.props.field, {operator:"OR", title:this.props.title})
		)
	}

	addFilter(option) {
		this.accessor.state.clear();
		if (option != "all") {
			this.accessor.state.add(option.key);
		}
		this.accessor.search()
	}

	renderOption(option) {

		let optionClassName = classNames({
			"menu-list-options__item":true,
			"menu-list-option":true,
			"menu-list-option--checked":this.accessor.state.contains(option.key)
		})

		return (
			<div className={optionClassName} key={option.key} onClick={this.addFilter.bind(this, option)}>
				<div className="menu-list-option__text">{option.key}</div>
			</div>
		)
	}

	renderAllOption() {
		let optionClassName = classNames({
			"menu-list-options__item":true,
			"menu-list-option":true,
			"menu-list-option--checked":!this.accessor.state.get()
		})

		return (
			<div className={optionClassName} key="all" onClick={this.addFilter.bind(this, "all")}>
				<div className="menu-list-option__text">All</div>
			</div>
		)
	}

	render() {
		return (
			<div className="menu-list">
				<div className="menu-list-options">
				{this.renderAllOption()}
				{_.map(this.accessor.getBuckets(), this.renderOption.bind(this))}
				</div>
			</div>
		);
	}
}
