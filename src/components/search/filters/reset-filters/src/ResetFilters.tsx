import * as React from "react";
import ESClient from "../../../../../domain/ESClient.ts";
import * as _ from "lodash";
import * as classNames from 'classnames';

require("./../styles/index.scss");

interface IResetFilters {
	searcher:ESClient;
}

export default class ResetFilters extends React.Component<IResetFilters, any> {	

	constructor(props:IResetFilters) {
		super(props)
	}

  hasFilters():boolean {
    return !!this.props.searcher.stateManager.getData()
  }

	resetFilters() {
		this.props.searcher.stateManager.state.clearAll()
		this.props.searcher.stateManager.updateHistory()
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
