import * as React from "react";
import * as _ from "lodash";
import "../styles/index.scss";

import {
	SearchkitManager,
	SearchkitComponent,
	FacetAccessor,
	FastClick,
	SearchkitComponentProps
} from "../../../../../core"

export interface ResetFiltersProps extends SearchkitComponentProps {
}

export class ResetFilters extends SearchkitComponent<ResetFiltersProps, any> {

	static translations = {
		"ClearAllFilters":"Clear all filters"
	}
	translations = ResetFilters.translations

	static propTypes = _.defaults({
		translations:SearchkitComponent.translationsPropType(
			ResetFilters.translations
		)
	}, SearchkitComponent.propTypes)

	defineBEMBlocks() {
		return {
			container: (this.props.mod || "reset-filters")
		}
	}

  hasFilters():boolean {
    return this.getQuery().hasFiltersOrQuery()
  }

	resetFilters() {
		this.searchkit.resetState()
		this.searchkit.performSearch()
	}

	renderResetButton() {

		var block = this.bemBlocks.container

		return (
			<div className={block("reset")}>{this.translate("ClearAllFilters")}</div>
		)
	}

  render() {
		var block = this.bemBlocks.container

    return (
    <div>
			<FastClick handler={this.resetFilters.bind(this)}>
				<div className={block().state({disabled:!this.hasFilters()})}>
					{this.renderResetButton()}
				</div>
			</FastClick>
		</div>
    )
  }
}
