import * as React from "react";
import "../styles/index.scss";
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
				field:React.PropTypes.string.isRequired,
				order:React.PropTypes.string.isRequired
			})
		)
	}, SearchkitComponent.propTypes)


	defineAccessor() {
    return new SortingAccessor("sort", {options:this.props.options})
	}

	defineBEMBlocks() {
		return {
			container: (this.props.mod || "sorting-selector")
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
		return `${this.accessor.state.getValue()}`
	}

  render() {
    if(this.hasHits()){
			return (
				<div className={this.bemBlocks.container()}>
	      	<select onChange={this.updateSorting.bind(this)} value={this.getSelectedValue()}>
						{map(this.props.options, this.renderOption.bind(this))}
					</select>
	      </div>
			)
		}
		return null
  }
}
