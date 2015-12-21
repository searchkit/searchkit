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

export interface ISelectedFilters {
	mod?:string
}

export class SelectedFilters extends SearchkitComponent<ISelectedFilters, any> {

	defineBEMBlocks() {
		var blockName = (this.props.mod || "selected-filters")
		return {
			container: blockName,
			option:`${blockName}-option`
		}
	}

	getFilters():Array<any> {
		return this.searcher.query.getFiltersArray()
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
			<div className={className} key={filter.$name+":"+filter.$value}>
				<div className={block("name")}>{filter.$name}: {filter.$value}</div>
				<FastClick handler={this.removeFilter.bind(this, filter)}>
					<div className={block("remove-action")}>x</div>
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
      <div className={this.bemBlocks.container()}>
				{_.map(_.filter(this.getFilters(),{$disabled:false}), this.renderFilter.bind(this))}
      </div>
    )
  }
}
