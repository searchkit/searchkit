import * as React from "react";

import {
	SearchkitManager,
	SearchkitComponent,
	NumericOptionsAccessor,
	SearchkitComponentProps,
	RangeOption,
	FastClick
} from "../../../../../core"

const defaults = require("lodash/defaults")
const map = require("lodash/map")

export interface NumericRefinementListFilterProps extends SearchkitComponentProps {
	field:string
  title:string
  options:Array<RangeOption>
  id:string
}

export class NumericRefinementListFilter extends SearchkitComponent<NumericRefinementListFilterProps, any> {
	accessor:NumericOptionsAccessor

	static propTypes = defaults({
		field:React.PropTypes.string.isRequired,
		title:React.PropTypes.string.isRequired,
		id:React.PropTypes.string.isRequired,
		options:React.PropTypes.arrayOf(
			React.PropTypes.shape({
				title:React.PropTypes.string.isRequired,
				from:React.PropTypes.number,
				to:React.PropTypes.number
			})
		)
	}, SearchkitComponent.propTypes)

	defineAccessor() {
		return new NumericOptionsAccessor(
			this.props.id,
			{id:this.props.id, field:this.props.field, options:this.props.options, title:this.props.title}
		)
	}

	defineBEMBlocks() {
		var blockName = this.props.mod || "sk-numeric-refinement-list"
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

  hasOptions(): boolean {
      return this.accessor.getBuckets().length != 0
  }

	renderOption(option) {

		let block = this.bemBlocks.option
		let className = block()
			.mix(this.bemBlocks.container("item"))
			.state({
				selected:this.isSelected(option),
				disabled:this.accessor.getBuckets().length == 0
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
		var className = block()
      .mix(`filter--${this.props.id}`)
      .state({
          disabled: !this.hasOptions()
      })

		return (
			<div className={className}>
				<div className={block("header")}>{this.props.title}</div>
				<div className={block("options")}>
				{map(this.accessor.getBuckets(), this.renderOption.bind(this))}
				</div>
			</div>
		);
	}
}
