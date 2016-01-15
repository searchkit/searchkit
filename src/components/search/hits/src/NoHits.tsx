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
		"NoHits.DidYouMean":"Did you mean {suggestion}?"
	}
	translations = NoHits.translations

	static propTypes = _.defaults({
		translations:SearchkitComponent.translationsPropType(
			NoHits.translations
		)
	}, SearchkitComponent.propTypes)

	defineBEMBlocks() {
		let block = (this.props.mod || "no-hits")
		return {
			container: block
		}
	}

	renderSuggestions() {
		let firstSuggestion = _.get(this.searchkit.getSuggestions(), [0,"options", 0, "text"], false)
		if (!firstSuggestion) return null
		return (
			<FastClick handler={this.setQueryString.bind(this,firstSuggestion)}>
				<div className={this.bemBlocks.container("suggestion")}>
					{this.translate("NoHits.DidYouMean", {suggestion:firstSuggestion})}
				</div>
			</FastClick>
		)
	}

	setQueryString(query) {
		this.searchkit.setQueryString(query)
		this.searchkit.performSearch()
	}

	render() {
    if (this.hasHits() || this.isInitialLoading()) return null

		return (
			<div data-qa="no-hits" className={this.bemBlocks.container()}>
				<div className={this.bemBlocks.container("info")}>
					{this.translate("NoHits.NoResultsFound")}
					{this.renderSuggestions()}
				</div>
      </div>
		);
	}
}
