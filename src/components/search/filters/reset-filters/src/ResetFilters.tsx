import * as React from "react";
import ESClient from "../../../../../domain/ESClient.ts";
import * as _ from "lodash";
import * as classNames from 'classnames';
import SearchkitComponent from "../../../../SearchkitComponent.ts";

require("./../styles/index.scss");


export default class ResetFilters extends SearchkitComponent<any, any> {

  hasFilters():boolean {
    return !!this.searcher.stateManager.getData()
  }

	resetFilters() {
		this.searcher.stateManager.state.clearAll()
		this.searcher.stateManager.updateHistory()
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
