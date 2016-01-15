import {BaseQueryAccessor} from "./BaseQueryAccessor";
import {
  MultiMatchQuery,
  BoolShould,
  SimpleQueryString
} from "../query";

export interface SearchOptions {
  queryFields?:Array<string>
  prefixQueryFields?:Array<string>
  queryOptions?:any
  disableSuggestions?:boolean
}
export class QueryAccessor extends BaseQueryAccessor {
  options:SearchOptions
  
  constructor(key, options={}){
    super(key)
    this.options = options
    this.options.queryFields = this.options.queryFields || ["_all"]
  }

  onQueryStringChange(queryString){
    this.state = this.state.setValue(queryString)
  }

  buildSharedQuery(query){
    let queryStr = this.state.getValue()
    if(queryStr){

      let simpleQuery = SimpleQueryString(
        queryStr, _.extend(
          {fields:this.options.queryFields},
          this.options.queryOptions
        )
      )

      let queries:Array<any> = [simpleQuery]

      if (this.options.prefixQueryFields) {
        queries.push(MultiMatchQuery(queryStr, {
          type:"phrase_prefix",
          fields:this.options.prefixQueryFields
        }))
      }
      return query.addQuery(BoolShould(queries))
    }
    return query

  }

  buildOwnQuery(query) {
    let queryText = this.state.getValue()
    if (!queryText || this.options.disableSuggestions) return query;

    return query.setSuggestions({
      text:queryText,
			suggestions:{
				phrase: {
					field:"title",
					real_word_error_likelihood : 0.95,
					max_errors : 1,
					gram_size : 4,
					direct_generator : [{
						field : "_all",
						suggest_mode : "always",
						min_word_length : 1
					}]
				}
			}
    })
  }

}
