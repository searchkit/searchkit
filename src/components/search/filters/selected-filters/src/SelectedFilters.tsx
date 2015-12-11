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


export class SelectedFilters extends SearchkitComponent<any, any> {

	getFilters():Array<any> {
		return this.searcher.query.getFiltersArray()
	}

	hasFilters():boolean {
		return _.size(this.getFilters()) > 0;
	}

	renderFilter(filter) {
		var className = classNames({
			"selected-filters__item":true,
			"selected-filter":true,
			[`selected-filter--${filter.$id}`]:true
		})
		return (
			<div className={className} key={filter.$name+":"+filter.$value}>
				<div className="selected-filter__name">{filter.$name}: {filter.$value}</div>
				<FastClick handler={this.removeFilter.bind(this, filter)}>
					<div className="selected-filter__remove-action">x</div>
				</FastClick>
			</div>
		)
	}

	removeFilter(filter) {
		filter.$remove()
		this.searchkit.performSearch()
	}

  render() {
		if (!this.hasFilters()) {
			return (<div></div>)
		}
    return (
      <div className="selected-filters">
				{_.map(_.filter(this.getFilters(),{$disabled:false}), this.renderFilter.bind(this))}
      </div>
    )
  }
}
