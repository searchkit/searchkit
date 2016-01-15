import * as _ from "lodash";
import * as React from "react";
import "../styles/no-hits.scss";

import {
	SearchkitComponent,
	SearchkitComponentProps,
	FastClick
} from "../../../../core"

export interface NoHitsProps extends SearchkitComponentProps {
}

export class NoHits extends SearchkitComponent<NoHitsProps, any> {

	static translations = {
		"NoHits.NoResultsFound":"No results found",
		"NoHits.DidYouMean":"Did you mean {{suggestion}}?"
	}

	defineBEMBlocks() {
		let block = (this.props.mod || "no-hits")
		return {
			container: block
		}
	}

	renderSuggestions() {
		let firstSuggestion = _.get(this.searchkit.getSuggestions(), [0,"options", 0, "text"], false)
		return (
			<div className={this.bemBlocks.container("suggestion")}>
				<FastClick handler={this.updateQueryString(firstSuggestion)}>
					{this.translate("NoHits.DidYouMean", {suggestion:firstSuggestion})}
				</FastClick>
			</div>
		)
	}

	updateQueryString(queryString) {
		
	}

	render() {
    if (this.hasHits() || this.isInitialLoading()) return null

		return (
			<div data-qa="no-hits" className={this.bemBlocks.container()}>
				<div className={this.bemBlocks.container("info")}>{this.translate("NoHits.NoResultsFound")}</div>
				{this.renderSuggestions()}
      </div>
		);
	}
}
