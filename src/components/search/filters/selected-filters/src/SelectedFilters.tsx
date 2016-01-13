import * as React from "react";
import * as _ from "lodash";
import "../styles/index.scss";

import {
	SearchkitManager,
	SearchkitComponent,
	FacetAccessor,
	FastClick,
	SearchkitComponentProps
} from "../../../../../core"

export interface SelectedFiltersProps extends SearchkitComponentProps {
}

export class SelectedFilters extends SearchkitComponent<SelectedFiltersProps, any> {

	defineBEMBlocks() {
		var blockName = (this.props.mod || "selected-filters")
		return {
			container: blockName,
			option:`${blockName}-option`
		}
	}

	getFilters():Array<any> {
		return this.getQuery().getSelectedFilters()
	}

	hasFilters():boolean {
		return _.size(this.getFilters()) > 0;
	}

	renderFilter(filter) {

		let block = this.bemBlocks.option
		let className = block()
			.mix(this.bemBlocks.container("item"))
			.mix(`selected-filter--${filter.$id}`)

		return (
			<div className={className} key={filter.name+":"+filter.value}>
				<div className={block("name")}>{this.translate(filter.name)}: {this.translate(filter.value)}</div>
				<FastClick handler={this.removeFilter.bind(this, filter)}>
					<div className={block("remove-action")}>x</div>
				</FastClick>
			</div>
		)
	}

	removeFilter(filter) {
		filter.remove()
		this.searchkit.performSearch()
	}

  render() {
		if (!this.hasFilters()) {
			return (<div></div>)
		}
    return (
      <div className={this.bemBlocks.container()}>
				{_.map(this.getFilters(), this.renderFilter.bind(this))}
      </div>
    )
  }
}
