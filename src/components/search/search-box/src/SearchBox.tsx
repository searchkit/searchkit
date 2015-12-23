import * as React from "react";
import * as _ from "lodash"

var Autosuggest = require('react-autosuggest');

import "../styles/index.scss";

import {
	SearchAccessor,
	SearchkitComponent,
	ESTransport
} from "../../../../core"

export interface ISearchBox {
	searchOnChange?:boolean
	autocomplete?:boolean
	prefixQueryFields?:Array<string>
	queryFields?:Array<string>
	mod?:string
}



export class SearchBox extends SearchkitComponent<ISearchBox, any> {
	accessor:SearchAccessor
	suggestSearcher: ESTransport

	constructor (props:ISearchBox) {
		super(props);
	}

	defineBEMBlocks() {
		return {container:(this.props.mod || "search-box")};
	}

	componentWillMount() {
		super.componentWillMount()
		this.suggestSearcher = new ESTransport(this.searchkit.host)
	}

	defineAccessor(){
		return new SearchAccessor("q", {
			prefixQueryFields:this.props.prefixQueryFields,
			queryFields:this.props.queryFields
		})
	}

	onSubmit(event) {
		event.preventDefault()
		this.searchQuery(this.getValue())
	}

	searchQuery(query) {
		this.searchkit.resetState()
		this.accessor.state = this.accessor.state.setValue(query)
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
		if (query.length > 0 && this.props.autocomplete) {

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

	onChange(e){
		const value = e.target.value;
		this.accessor.state = this.accessor.state.setValue(value)
		if (this.props.searchOnChange) {
			_.debounce(()=> {
				this.searchQuery(this.accessor.state.getValue())
			}, 500)()
		}
	}

	suggestionValue(suggestion) {
		return suggestion.text;
	}

	onSuggestionSelected(value){

		this.accessor.state = this.accessor.state.setValue(value.text || value)
		this.searchkit.search()
	}

	render() {
		let block = this.bemBlocks.container
		var inputAttributes = {
			className:block("text"),
			placeholder:"search",
			type:"text",
			ref:"queryField",
			onInput: this.onChange.bind(this)
		}

		return (
			<div className={block()}>
        <form onSubmit={this.onSubmit.bind(this)}>
          <div className={block("icon")}></div>
          <Autosuggest
						suggestions={this.querySuggestions.bind(this)}
						suggestionRenderer={this.suggestionRenderer.bind(this)}
						onSuggestionSelected={this.onSuggestionSelected.bind(this)}
						suggestionValue={this.suggestionValue}
						value={this.getValue()}
						inputAttributes={inputAttributes}/>
          <input type="submit" value="search" className={block("action")}/>
					<div className={block("loader").mix("sk-spinning-loader").state({hidden:!this.isLoading()})}></div>
        </form>
      </div>
		);

	}
}
