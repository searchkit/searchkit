import {ValueState} from "../state"
import {StatefulAccessor} from "./StatefulAccessor"
import {
  MultiMatchQuery,
  BoolShould,
  SimpleQueryString
} from "../query";

export interface SearchOptions {
  queryFields?:Array<string>
  prefixQueryFields?:Array<string>
  queryOptions?:any
}
export class SearchAccessor extends StatefulAccessor<ValueState> {
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

}
