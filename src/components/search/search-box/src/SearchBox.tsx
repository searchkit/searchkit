import * as React from "react";
import * as rx from "rx";
var Autosuggest = require('react-autosuggest');

import {
	Searcher,
	SearchkitManager,
	SearchAccessor,
	SearchkitComponent,
	ESRequest
} from "../../../../core"

require("./../styles/index.scss");

export interface ISearchBox {
}

export class SearchBox extends SearchkitComponent<ISearchBox, any> {
	accessor:SearchAccessor
	suggestSearcher: ESRequest
	value:string

	constructor (props:ISearchBox) {
		super(props);
		this.createSuggestSearcher();
	}

	createSuggestSearcher() {
		this.suggestSearcher = new ESRequest("aetna");
	}

	defineAccessor(){
		return new SearchAccessor("q")
	}

	onSubmit(event) {
		event.preventDefault()
		const val = this.getValue()
		this.searchkit.resetState()
		this.accessor.state.setValue(val)
		this.searchkit.performSearch()
	}

	processSuggestions(results) {
		return _.pluck(results.suggest.suggestions[0].options, "text")
	}

	querySuggestions(query, callback) {
		if (query.length > 0) {
			let queryObject = {
				size:0,
				suggest: {
					text:query,
					"suggestions":{
						term: {
							field:"_all"
						}
					},
					"completion": {
						completion: {
							field:"suggest"
						}
					}
				}
			}
			this.suggestSearcher
				.search(queryObject)
				.then((results:any) => {
					console.log(results);
					let suggestions = this.processSuggestions(results);
					callback(null, suggestions);
				})
		} else {
			callback(null, [])
		}
	}

	suggestionRenderer(suggestion, input) {
		return (<div>{suggestion}</div>)
	}

	getValue(){
		return (this.accessor.state.getValue() || "") + ""
	}

	onChange(value){
		this.accessor.state.setValue(value)
	}

	getSuggestionValue(suggestion) {
		return suggestion.text;
	}

	render() {
		var inputAttributes = {
			className:"search-box__text",
			placeholder:"search",
			type:"text",
			ref:"queryField",
			onChange: this.onChange.bind(this)
		}

		return (
			<div className="search-box">
        <form onSubmit={this.onSubmit.bind(this)}>
          <div className="search-box__icon"></div>
          <Autosuggest
						suggestions={this.querySuggestions.bind(this)}
						suggestionRenderer={this.suggestionRenderer.bind(this)}
						suggestionValue={this.getSuggestionValue.bind(this)}
						defaultValue={this.getValue()}
						inputAttributes={inputAttributes}/>
          <input type="submit" value="search" className="search-box__action"/>
        </form>
      </div>
		);
	}
}
