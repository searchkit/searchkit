import {ValueState} from "../state"
import {Accessor} from "./Accessor"
import {
  SimpleQueryString,
  MatchPhrasePrefix,
  BoolShould
} from "../query/QueryBuilders";

export interface SearchOptions {
  prefixQueryFields?:Array<string>
}
export class SearchAccessor extends Accessor<ValueState> {
  state = new ValueState()
  options:SearchOptions

  constructor(key, options={}){
    super(key)
    this.options = options
    this.options.prefixQueryFields = this.options.prefixQueryFields || []
  }

  buildSharedQuery(query){
    let queryStr = this.state.getValue()
    if(queryStr){
      let simpleQuery = SimpleQueryString(queryStr)
      let prefixQueries = _.map(this.options.prefixQueryFields,
        MatchPhrasePrefix.bind(null, queryStr))
      let queries = [].concat(prefixQueries).concat(simpleQuery)
      return query.addQuery(BoolShould(queries))
    }
    return query

  }

}
