import * as React from "react";
import * as _ from "lodash";
import "../styles/index.scss";

import {
	Searcher,
	SearchkitManager,
	SearchkitComponent,
	FacetAccessor,
	FastClick
} from "../../../../../core"

export interface IMenuFilter {
	field:string
	title:string
	id:string
	mod?:string
	size?:number
}

export class MenuFilter extends SearchkitComponent<IMenuFilter, any> {
	accessor:FacetAccessor

	shouldCreateNewSearcher() {
		return true;
	}

	defineBEMBlocks() {
		var blockName = this.props.mod || "menu-list"
		return {
			container: blockName,
			option: `${blockName}-option`
		}
	}

	defineAccessor() {
		return new FacetAccessor(
			this.props.field,
			{id:this.props.id, operator:"OR", title:this.props.title, size:this.props.size || 20}
		)
	}

	addFilter(option) {
		if (option === "All" || this.accessor.state.contains(option)) {
			this.accessor.state = this.accessor.state.clear();
		} else {
			this.accessor.state = this.accessor.state.setValue([option]);
		}
		this.searchkit.performSearch()
	}

	renderOption(label, count, isChecked) {

		var className = this.bemBlocks.option()
											.state({selected: isChecked})
											.mix(this.bemBlocks.container("item"))

		return (
			<FastClick handler={this.addFilter.bind(this, label)} key={label}>
				<div className={className}>
					<div className={this.bemBlocks.option("text")}>{label}</div>
					<div className={this.bemBlocks.option("count")}>{count}</div>
				</div>
			</FastClick>
		)
	}

	createOption(option) {
		var isChecked = this.accessor.state.contains(option.key)
		var count = option.doc_count
		var label = this.translate(option.key)
		return this.renderOption(label, count, isChecked);
	}

	render() {
		var block = this.bemBlocks.container
		var className = block().mix(`filter--${this.props.id}`)
		let isAllChecked = () => {
			return !this.accessor.state.getValue() || this.accessor.state.getValue().length == 0
		}

		return (
			<div className={className}>
				<div className={block("header")}>{this.props.title}</div>
				<div className={block("options")}>
				{this.renderOption("All", null, isAllChecked())}
				{_.map(this.accessor.getBuckets(), this.createOption.bind(this))}
				</div>
			</div>
		);
	}
}
