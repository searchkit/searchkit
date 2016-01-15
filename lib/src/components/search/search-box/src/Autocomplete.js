// import * as React from "react";
// import * as _ from "lodash"
//
// var Autosuggest = require('react-autosuggest');
//
// import "../styles/index.scss";
//
// import {
// 	SearchAccessor,
// 	SearchkitComponent,
// 	ESTransport, AxiosESTransport
// } from "../../../../core"
//
//
//
// export class Autocomplete extends SearchkitComponent<any, any> {
// 	accessor:SearchAccessor
// 	suggestSearcher: ESTransport
//
// 	defineBEMBlocks() {
// 		return {container:(this.props.mod || "autocomplete")};
// 	}
//
// 	componentWillMount() {
// 		super.componentWillMount()
// 		this.suggestSearcher = new AxiosESTransport(this.searchkit.host)
// 	}
//
// 	processSuggestions(results) {
// 		let suggestOptions = _.map(_.get(results.suggest, "suggestions[0].options",[]),option => option)
// 		let quickJumpOptions = _.map(_.get(results.suggest, "completion[0].options",[]),option => option)
//
// 		return [
// 			{
// 				sectionName:"Search for",
// 				suggestions: suggestOptions
// 			},
// 			{
// 				sectionName:"Images",
// 				suggestions:quickJumpOptions
// 			}
// 		]
//
// 	}
//
// 	getSuggestionQueryObject(query) {
// 		return {
// 			size:0,
// 			suggest: {
// 				text:query,
// 				"suggestions":{
// 					"phrase": {
// 						field:"_all",
// 						"real_word_error_likelihood" : 0.95,
// 						"max_errors" : 1,
// 						"gram_size" : 4,
// 						"direct_generator" : [ {
// 							"field" : "_all",
// 							"suggest_mode" : "always",
// 							"min_word_length" : 1
// 						} ],
// 						"highlight": {
// 							"pre_tag": "<em>",
// 							"post_tag": "</em>"
// 						}
// 					}
// 				},
// 				"completion": {
// 					completion: {
// 						field:"suggest"
// 					}
// 				}
// 			}
// 		}
// 	}
//
// 	querySuggestions(query, callback) {
// 		if (query.length > 0 && this.props.autocomplete) {
//
// 			this.suggestSearcher
// 				.search(this.getSuggestionQueryObject(query))
// 				.then((results:any) => {
// 					callback(null, this.processSuggestions(results));
// 				})
// 		} else {
// 			callback(null, [])
// 		}
//
// 	}
//
// 	suggestionRenderer(suggestion, input) {
// 		return (<div ref={suggestion.text} dangerouslySetInnerHTML={{__html: suggestion.highlighted || suggestion.text}}></div>)
// 	}
//
// 	render() {
// 		let block = this.bemBlocks.container
//
// 		return (
// 			<div className={block()}>
//       </div>
// 		);
//
// 	}
// }
//# sourceMappingURL=Autocomplete.js.map