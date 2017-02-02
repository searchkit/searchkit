import {BaseQueryAccessor} from "./BaseQueryAccessor";
import {
  MultiMatchQuery,
  BoolShould,
  BoolMust,
  SimpleQueryString
} from "../query";

const assign = require("lodash/assign")
const map = require("lodash/map")
const forEach = require("lodash/forEach")

export interface SearchOptions {
  queryFields?:Array<string>
  prefixQueryFields?:Array<string>
  queryOptions?:any
  prefixQueryOptions?:any
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
        let terms = String(queryStr).match(/\S+/g)
        let prefixQueries:Array<any> = [MultiMatchQuery(terms.pop(), assign(
          this.options.prefixQueryOptions, {
            type:"phrase_prefix",
            fields:this.options.prefixQueryFields,
          })
        )]
        forEach(terms, function(q) {
          prefixQueries.push(MultiMatchQuery(q, assign(
            this.options.prefixQueryOptions, {
              type:"phrase",
              fields:this.options.prefixQueryFields,
            })
          )) 
        }.bind(this))
        queries.push(BoolMust(prefixQueries))
      }
      query = query.addQuery(BoolShould(queries))

      if (this.options.addToFilters){
        query = query.addSelectedFilter({
          name: this.options.title,
          value: queryStr,
          id: this.key,
          remove: () => this.state = this.state.clear()
        })
      } else {
        query = query.setQueryString(queryStr)
      }

      return query
    }
    return query

  }

}
