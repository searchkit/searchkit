import * as React from "react";
import ESClient from "../../../../../domain/ESClient.ts";
import * as _ from "lodash";
import * as classNames from 'classnames';
import FacetAccessor from "../../../../../domain/accessors/FacetAccessor.ts";

require("./../styles/index.scss");

interface ISelectedFilters {
	searcher:ESClient;
}

export default class SelectedFilters extends React.Component<ISelectedFilters, any> {

	constructor(props:ISelectedFilters) {
		super(props)
	}

	getFilters():Array<any> {
		let filterAccessors = this.props.searcher.stateManager.findAccessorsByClass(FacetAccessor);

		let filters = _.flatten(_.map(filterAccessors, (facetAccessor:FacetAccessor) => {
			let filters = facetAccessor.state.get() || [];
			return _.map(filters, (filter) => {
				return {name:facetAccessor.options.title, value:filter, accessor:facetAccessor}
			})
		}))

		return filters || [];
	}

	hasFilters():boolean {
		return _.size(this.getFilters()) != 0;
	}

	renderFilter(filter) {
		return (
			<div className="selected-filters__item selected-filter">
				<div className="selected-filter__name">{filter.name}: {filter.value}</div>
				<div className="selected-filter__remove-action" onClick={this.removeFilter.bind(this, filter.value, filter.accessor)}>x</div>
			</div>
		)
	}

	removeFilter(value, facetAccessor:FacetAccessor) {
		facetAccessor.state.remove(value);
		facetAccessor.search()
	}

  render() {
		if (!this.hasFilters()) {
			return (<div></div>)
		}
    return (
      <div className="selected-filters">
				{_.map(this.getFilters(), this.renderFilter.bind(this))}
      </div>
    )
  }
}
