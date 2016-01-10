import {ValueState} from "../state"
import {Accessor} from "./Accessor"
import {
  MatchPhrasePrefix,
  BoolShould,
  QueryString
} from "../query/QueryBuilders";

export interface SearchOptions {
  queryFields?:Array<string>
  prefixSearch?:boolean
}
export class SearchAccessor extends Accessor<ValueState> {
  state = new ValueState()
  options:SearchOptions

  constructor(key, options={}){
    super(key)
    this.options = options
    this.options.queryFields = this.options.queryFields || ["_all"]
  }

  buildSharedQuery(query){
    let queryStr = this.state.getValue()
    if(queryStr){

      let simpleQuery = QueryString(queryStr, {
        "query":                queryStr,
        "type":                 "best_fields",
        "fields":               this.options.queryFields,
        "tie_breaker":          0.3,
        "minimum_should_match": "70%"
      })

      let prefixQueries = this.options.prefixSearch ? _.map(this.options.queryFields,
        MatchPhrasePrefix.bind(null, queryStr)) : []

      let queries = [].concat(BoolShould(prefixQueries)).concat(simpleQuery)
      return query.addQuery(BoolShould(queries))
    }
    return query

  }

}
