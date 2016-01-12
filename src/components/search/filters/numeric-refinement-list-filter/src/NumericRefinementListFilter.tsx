import * as React from "react";
import * as _ from "lodash";
import "../styles/index.scss";

import {
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

	defineBEMBlocks() {
		var blockName = this.props.mod || "numeric-refinement-list"
		return {
			container: blockName,
			option: `${blockName}-option`
		}
	}

	addFilter(option) {
		this.accessor.state = this.accessor.state.toggle(option.key)
		this.searchkit.performSearch()
	}

	isSelected(option) {
		return this.accessor.state.getValue() == option.key;
	}

	renderOption(option) {

		let block = this.bemBlocks.option
		let className = block()
			.mix(this.bemBlocks.container("item"))
			.state({
				selected:this.isSelected(option)
			})

		return (
			<FastClick handler={this.addFilter.bind(this, option)} key={option.key}>
				<div className={className}>
					<div className={block("text")}>{this.translate(option.key)}</div>
					<div className={block("count")}>{option.doc_count}</div>
				</div>
			</FastClick>
		)
	}

	render() {
		var block = this.bemBlocks.container
		var className = block().mix(`filter--${this.props.id}`)

		return (
			<div className={className}>
				<div className={block("header")}>{this.props.title}</div>
				<div className={block("options")}>
				{_.map(this.accessor.getBuckets(), this.renderOption.bind(this))}
				</div>
			</div>
		);
	}
}
