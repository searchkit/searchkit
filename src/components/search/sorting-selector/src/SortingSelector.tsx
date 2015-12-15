import * as React from "react";
import * as _ from "lodash";
import * as classNames from 'classnames';
import "../styles/index.scss";

import {
	SearchkitComponent,
	SortingAccessor,
	FastClick
} from "../../../../core"

export interface ISortingSelector {
  options:[{label:string, field:string, order:string}]
}

export class SortingSelector extends SearchkitComponent<ISortingSelector, any> {
	accessor:SortingAccessor

	defineAccessor(){
    return new SortingAccessor("sort", this.props)
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
    return (
      <div className="sorting-selector">
      	<select onChange={this.updateSorting.bind(this)} value={this.getSelectedValue()}>
					{_.map(this.props.options, this.renderOption.bind(this))}
				</select>
      </div>
    )
  }
}
