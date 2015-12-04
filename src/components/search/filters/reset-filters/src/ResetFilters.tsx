import * as React from "react";
import * as _ from "lodash";
import * as classNames from 'classnames';
require("./../styles/index.scss");

import {
	Searcher,
	SearchkitManager,
	SearchkitComponent,
	FacetAccessor
} from "../../../../../core"

export class ResetFilters extends SearchkitComponent<any, any> {

  hasFilters():boolean {
		console.log(this.searcher.hasFilters())
    return !!this.searcher.hasFilters()
  }

	resetFilters() {
		this.searchkit.resetState()
		this.searchkit.performSearch()
    //TODO
		// this.searcher.stateManager.state.clearAll()
		// this.searcher.stateManager.updateHistory()
	}

	renderResetButton() {
		return (
			<div className="reset-filters" onClick={this.resetFilters.bind(this)}>
				<div className="reset-filters__text">clear all filters</div>
			</div>
		)
	}

  render() {
    return (
      <div>
					{(() => {
						if (this.hasFilters()) {
							return this.renderResetButton()
						}
					})()}
      </div>
    )
  }
}
