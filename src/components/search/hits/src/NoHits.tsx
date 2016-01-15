import * as _ from "lodash";
import * as React from "react";
import "../styles/no-hits.scss";

import {
	SearchkitComponent,
	SearchkitComponentProps,
	FastClick,
	NoFiltersHitCountAccessor
} from "../../../../core"

export interface NoHitsProps extends SearchkitComponentProps {
}

export class NoHits extends SearchkitComponent<NoHitsProps, any> {
	accessor:NoFiltersHitCountAccessor
	static translations = {
		"NoHits.NoResultsFound":"No results found.",
		"NoHits.DidYouMean":"Did you mean {suggestion}?",
		"NoHits.SearchWithoutFilters":"Search for {query} only."
	}
	translations = NoHits.translations

	static propTypes = _.defaults({
		translations:SearchkitComponent.translationsPropType(
			NoHits.translations
		)
	}, SearchkitComponent.propTypes)

	defineAccessor(){
		return new NoFiltersHitCountAccessor()
	}

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
				<i>
					{this.translate("NoHits.DidYouMean", {suggestion:firstSuggestion})}
				</i>
			</FastClick>
		)
	}

	resetFilters() {
		this.searchkit.getQueryAccessor().keepOnlyQueryState()
		this.searchkit.performSearch(true)
	}

	renderResetFilters() {
		let hasFilters = this.getQuery().getSelectedFilters().length > 0
		let query = this.searchkit.getQueryAccessor().getQueryString()
		if (!hasFilters || this.accessor.getCount() == 0) return null
		return (
			<FastClick handler={this.resetFilters.bind(this)}>
				<i>
					{this.translate("NoHits.SearchWithoutFilters",{query})}
				</i>
			</FastClick>
		)
	}

	setQueryString(query) {
		this.searchkit.getQueryAccessor().setQueryString(query)
		this.searchkit.performSearch(true)
	}

	render() {
    if (this.hasHits() || this.isInitialLoading()) return null

		let suggestions = _.compact([this.renderSuggestions(), this.renderResetFilters()])

		if (suggestions.length == 2) {
			suggestions.splice(1,0,<span key="or"> or </span>)
		}

		console.log(suggestions)

		return (
			<div data-qa="no-hits" className={this.bemBlocks.container()}>
				<div className={this.bemBlocks.container("info")}>
					{this.translate("NoHits.NoResultsFound")}
				</div>
				<div className={this.bemBlocks.container("steps")}>
					{suggestions}
				</div>
      </div>
		);
	}
}
