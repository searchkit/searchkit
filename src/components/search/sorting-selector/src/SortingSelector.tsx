import * as React from "react";

import {
	SearchkitComponent,
	SortingAccessor,
	FastClick,
	SortingOptions,
	SearchkitComponentProps,
	SortingOption
} from "../../../../core"

const defaults = require("lodash/defaults")
const map = require("lodash/map")

export interface SortingProps extends SearchkitComponentProps {
	options:Array<SortingOption>
}


export class SortingSelector extends SearchkitComponent<SortingProps, any> {
	accessor:SortingAccessor

	static propTypes = defaults({
		options:React.PropTypes.arrayOf(
			React.PropTypes.shape({
				label:React.PropTypes.string.isRequired,
				field:React.PropTypes.string,
				order:React.PropTypes.string,
				defaultOption:React.PropTypes.bool
			})
		)
	}, SearchkitComponent.propTypes)


	defineAccessor() {
    return new SortingAccessor("sort", {options:this.props.options})
	}

	defineBEMBlocks() {
		return {
			container: (this.props.mod || "sk-sorting-selector")
		}
	}

	renderOption(option) {
		return (
			<option key={option.label} value={option.label}>{option.label}</option>
		)
	}

	updateSorting(e) {
		let val:string = e.target.value;
		this.accessor.state = this.accessor.state.setValue(val);
		this.searchkit.performSearch();
	}

	getSelectedValue():string {
		let option = this.accessor.getSelectedOption()
		return option && option.label
	}

  render() {
			return (
				<div className={this.bemBlocks.container().state({disabled: !this.hasHits()})}>
	      	<select onChange={this.updateSorting.bind(this)} value={this.getSelectedValue()}>
						{map(this.props.options, this.renderOption.bind(this))}
					</select>
	      </div>
			)
		}
}
