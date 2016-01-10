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
  queryOptions?:any
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

      let simpleQuery = QueryString(queryStr, _.extend({}, this.options.queryOptions, {
        "query":                queryStr,
        "fields":               this.options.queryFields
      }))

      let prefixQueries = this.options.prefixSearch ? BoolShould(_.map(this.options.queryFields,
        MatchPhrasePrefix.bind(null, queryStr))) : []

      let queries = [].concat(prefixQueries).concat(simpleQuery)
      return query.addQuery(BoolShould(queries))
    }
    return query

  }

}
