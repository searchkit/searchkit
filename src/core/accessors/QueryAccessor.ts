import {BaseQueryAccessor} from "./BaseQueryAccessor";
import {
  MultiMatchQuery,
  BoolShould,
  SimpleQueryString
} from "../query";

const assign = require("lodash/assign")

export interface SearchOptions {
  queryFields?:Array<string>
  prefixQueryFields?:Array<string>
  queryOptions?:any
  title?: string
  addToFilters?:boolean
}
export class QueryAccessor extends BaseQueryAccessor {
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
        queryStr, assign(
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
      query = query.addQuery(BoolShould(queries))
        .setQueryString(queryStr)
      
      if (this.options.addToFilters){
        query = query.addSelectedFilter({
          name: this.options.title,
          value: queryStr,
          id: this.key,
          remove: () => this.state = this.state.clear()
        })
      }
        
      return query
    }
    return query

  }

}
