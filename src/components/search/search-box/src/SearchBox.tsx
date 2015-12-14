import * as React from "react";
var Autosuggest = require('react-autosuggest');
import "../styles/index.scss";

import {
	Searcher,
	SearchkitManager,
	SearchAccessor,
	SearchkitComponent,
	ESRequest
} from "../../../../core"

export interface ISearchBox {
}

export class SearchBox extends SearchkitComponent<ISearchBox, any> {
	accessor:SearchAccessor
	suggestSearcher: ESRequest

	constructor (props:ISearchBox) {
		super(props);		
	}

	componentWillMount() {
		super.componentWillMount()
		this.suggestSearcher = new ESRequest(this.searchkit.index);
	}

	defineAccessor(){
		return new SearchAccessor("q")
	}

	onSubmit(event) {
		event.preventDefault()
		const val = this.getValue()
		this.searchkit.resetState()
		this.accessor.state = this.accessor.state.setValue(val)
		this.searchkit.performSearch()
	}

	processSuggestions(results) {
		let suggestOptions = _.map(_.get(results.suggest, "suggestions[0].options",[]),option => option)
		let quickJumpOptions = _.map(_.get(results.suggest, "completion[0].options",[]),option => option)

		return [
			{
				sectionName:"Search for",
				suggestions: suggestOptions
			},
			{
				sectionName:"Images",
				suggestions:quickJumpOptions
			}
		]

	}

	getSuggestionQueryObject(query) {
		return {
			size:0,
			suggest: {
				text:query,
				"suggestions":{
					"phrase": {
						field:"_all",
						"real_word_error_likelihood" : 0.95,
						"max_errors" : 1,
						"gram_size" : 4,
						"direct_generator" : [ {
							"field" : "_all",
							"suggest_mode" : "always",
							"min_word_length" : 1
						} ],
						"highlight": {
							"pre_tag": "<em>",
							"post_tag": "</em>"
						}
					}
				},
				"completion": {
					completion: {
						field:"suggest"
					}
				}
			}
		}
	}

	querySuggestions(query, callback) {
		if (query.length > 0) {

			this.suggestSearcher
				.search(this.getSuggestionQueryObject(query))
				.then((results:any) => {
					callback(null, this.processSuggestions(results));
				})
		} else {
			callback(null, [])
		}
	}

	suggestionRenderer(suggestion, input) {
		return (<div ref={suggestion.text} dangerouslySetInnerHTML={{__html: suggestion.highlighted || suggestion.text}}></div>)
	}

	getValue(){
		return (this.accessor.state.getValue() || "") + ""
	}

	onChange(value){
		this.accessor.state = this.accessor.state.setValue(value)
	}

	suggestionValue(suggestion) {
		return suggestion.text;
	}

	onSuggestionSelected(value){

		this.accessor.state = this.accessor.state.setValue(value.text || value)
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
						onSuggestionSelected={this.onSuggestionSelected.bind(this)}
						suggestionValue={this.suggestionValue}
						value={this.getValue()}
						inputAttributes={inputAttributes}/>
          <input type="submit" value="search" className="search-box__action"/>
        </form>
      </div>
		);
	}
}
