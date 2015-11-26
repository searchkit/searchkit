import * as React from "react";
import ESClient from "../../../../../domain/ESClient.ts";
import ElasticAccessors from "../../../../../domain/accessors/ElasticAccessors.ts"
import * as _ from "lodash";
import * as classNames from 'classnames';
import {StateAccessorRef} from "../../../../../domain/StateAccessors.ts"

require("./../styles/index.scss");

interface IResetFilters {
	searcher:ESClient;
}

export default class ResetFilters extends React.Component<IResetFilters, any> {
	accessor:StateAccessorRef

	constructor(props:IResetFilters) {
		super(props)
	}

  hasFilters():boolean {
    return !!this.props.searcher.accessors.getData()
  }

	resetFilters() {
		this.props.searcher.accessors.clearAll()
		this.props.searcher.search()
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
