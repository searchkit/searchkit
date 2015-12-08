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
	showAutoSuggest:boolean

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
		this.showAutoSuggest = false;
		this.searchkit.performSearch()
	}

	processSuggestions(results) {
		let suggestOptions = _.map(_.get(results.suggest, "suggestions[0].options",[]),option => option.text)
		let quickJumpOptions = _.map(_.get(results.suggest, "completion[0].options",[]),option => option.text)

		return [
			{
				suggestions: suggestOptions
			},
			{
				sectionName:"Images",
				suggestions:quickJumpOptions
			}
		]

	}

	querySuggestions(query, callback) {
		if (query.length > 0) {
			this.showAutoSuggest = true;

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
					callback(null, this.processSuggestions(results));
				})
		} else {
			callback(null, [])
			this.showAutoSuggest = false;
		}
	}

	suggestionRenderer(suggestion, input) {
		return (<div ref={suggestion}>{suggestion}</div>)
	}

	getValue(){
		return (this.accessor.state.getValue() || "") + ""
	}

	onChange(value){
		this.accessor.state.setValue(value)
	}

	onSuggestionSelected(value){
		this.accessor.state.setValue(value)
		this.searchkit.search()
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
						id="autosuggest"
						suggestions={this.querySuggestions.bind(this)}
						suggestionRenderer={this.suggestionRenderer.bind(this)}
						showWhen={this.showAutoSuggest}
						onSuggestionSelected={this.onSuggestionSelected.bind(this)}
						value={this.getValue()}
						inputAttributes={inputAttributes}/>
          <input type="submit" value="search" className="search-box__action"/>
        </form>
      </div>
		);
	}
}
