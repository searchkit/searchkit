import * as React from "react";

import {
	SearchkitComponent,
	SearchkitComponentProps,
	FastClick,
	NoFiltersHitCountAccessor,
	SuggestionsAccessor,
	ReactComponentType,
  renderComponent
} from "../../../../core"

import {NoHitsErrorDisplay, NoHitsErrorDisplayProps} from "./NoHitsErrorDisplay"
import {NoHitsDisplay, NoHitsDisplayProps} from "./NoHitsDisplay"

import {defaults} from "lodash"

export interface NoHitsProps extends SearchkitComponentProps {
	suggestionsField?:string
	errorComponent?: ReactComponentType<NoHitsErrorDisplayProps>
	component?: ReactComponentType<NoHitsDisplayProps>
}

export class NoHits extends SearchkitComponent<NoHitsProps, any> {
	noFiltersAccessor:NoFiltersHitCountAccessor
	suggestionsAccessor:SuggestionsAccessor
  bemBlocks: {
    container: Function
  }

	static translations = {
		"NoHits.NoResultsFound":"No results found for {query}.",
		"NoHits.NoResultsFoundDidYouMean":"No results found for {query}. Did you mean {suggestion}?",
		"NoHits.DidYouMean":"Search for {suggestion} instead",
		"NoHits.SearchWithoutFilters":"Search for {query} without filters",
		"NoHits.Error":"We're sorry, an issue occurred when fetching your results. Please try again.",
		"NoHits.ResetSearch":"Reset Search"
	}
	translations = NoHits.translations

	static propTypes = defaults({
		suggestionsField:React.PropTypes.string,
		translations:SearchkitComponent.translationsPropType(
			NoHits.translations
		)
	}, SearchkitComponent.propTypes)

	static defaultProps = {
		errorComponent: NoHitsErrorDisplay,
		component: NoHitsDisplay
	}

	componentWillMount(){
		super.componentWillMount()
		this.noFiltersAccessor = this.searchkit.addAccessor(
			new NoFiltersHitCountAccessor()
		)
		if(this.props.suggestionsField){
			this.suggestionsAccessor = this.searchkit.addAccessor(
				new SuggestionsAccessor(this.props.suggestionsField)
			)
		}
	}

	defineBEMBlocks() {
		let block = (this.props.mod || "sk-no-hits")
		return {
			container: block
		}
	}

	getSuggestion() {
		return this.suggestionsAccessor && this.suggestionsAccessor.getSuggestion()
	}

	setQueryString(query) {
		this.searchkit.getQueryAccessor().setQueryString(query, true)
		this.searchkit.performSearch(true)
	}

	resetFilters() {
		this.searchkit.getQueryAccessor().keepOnlyQueryState()
		this.searchkit.performSearch(true)
	}

	resetSearch() {
		this.searchkit.getQueryAccessor().resetState()
		this.searchkit.performSearch(true)
	}

	getFilterCount() {
		return this.noFiltersAccessor && this.noFiltersAccessor.getCount()
	}

	render() {
    if ((this.hasHits() || this.isInitialLoading() || this.isLoading()) && !this.getError()) return null

		if (this.getError()) {
			const props:NoHitsErrorDisplayProps = {
				errorLabel:this.translate("NoHits.Error"),
				resetSearchFn: this.resetSearch.bind(this),
				translate: this.translate,
				bemBlocks: this.bemBlocks,
				tryAgainLabel: this.translate("NoHits.ResetSearch"),
				error: this.getError()
			}
			return renderComponent(this.props.errorComponent, props)
		}

		const suggestion: any = this.getSuggestion()
		const query = this.getQuery().getQueryString()
		let infoKey = suggestion ? "NoHits.NoResultsFoundDidYouMean" : "NoHits.NoResultsFound"

		const props:NoHitsDisplayProps = {
			noResultsLabel:this.translate(infoKey, {query:query, suggestion:suggestion}),
		  translate: this.translate,
			bemBlocks: this.bemBlocks,
			suggestion: suggestion,
			query: query,
			filtersCount: this.getFilterCount(),
			resetFiltersFn: this.resetFilters.bind(this),
			setSuggestionFn: this.setQueryString.bind(this, suggestion)
		}

		return renderComponent(this.props.component, props)

	}
}
