import * as React from "react";
import * as _ from "lodash";
import * as classNames from 'classnames';
import "../styles/index.scss";

import {
	Searcher,
	SearchkitManager,
	SearchkitComponent,
	FacetAccessor,
	FastClick
} from "../../../../../core"

export class ResetFilters extends SearchkitComponent<any, any> {

  hasFilters():boolean {
    return this.searcher.hasFiltersOrQuery()
  }

	resetFilters() {
		this.searchkit.resetState()
		this.searchkit.performSearch()
	}

	renderResetButton() {
		let className = classNames({
			"reset-filters":true,
			"reset-filters--disabled":!this.hasFilters()
		})

		return (
			<FastClick handler={this.resetFilters.bind(this)}>
				<div className={className}>
					<div className="reset-filters__text">clear all filters</div>
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
