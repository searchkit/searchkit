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

export class ResetFilters extends SearchkitComponent<any, any> {

	defineBEMBlocks() {
		return {
			container: (this.props.mod || "reset-filters")
		}
	}

  hasFilters():boolean {
    return this.searcher.hasFiltersOrQuery()
  }

	resetFilters() {
		this.searchkit.resetState()
		this.searchkit.performSearch()
	}

	renderResetButton() {

		var block = this.bemBlocks.container

		return (
			<FastClick handler={this.resetFilters.bind(this)}>
				<div className={block().state({disabled:!this.hasFilters()})}>
					<div className={block("reset")}>clear all filters</div>
				</div>
			</FastClick>
		)
	}

  render() {
    return (
      <div>
				{this.renderResetButton()}
      </div>
    )
  }
}
