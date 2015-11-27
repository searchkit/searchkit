import * as React from "react";
import ESClient from "../../../../../domain/ESClient.ts";
import * as _ from "lodash";
import * as classNames from 'classnames';

require("./../styles/index.scss");

interface ISelectedFilters {
	searcher:ESClient;
}

export default class SelectedFilters extends React.Component<ISelectedFilters, any> {

	constructor(props:ISelectedFilters) {
		super(props)
	}

	getFilters() {
		return [
			{name:"Genres",
			value:"Drama"},
			{name:"Actors", value:"News"}
		]
	}

	renderFilter(filter) {
		return (
			<div className="selected-filters__item selected-filter">
				<div className="selected-filter__name">{filter.name}: {filter.value}</div>
				<div className="selected-filter__remove-action">x</div>
			</div>
		)
	}

  render() {
    return (
      <div className="selected-filters">
				{_.map(this.getFilters(), this.renderFilter.bind(this))}
      </div>
    )
  }
}
