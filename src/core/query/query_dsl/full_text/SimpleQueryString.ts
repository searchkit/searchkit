import * as _ from "lodash"

export interface SimpleQueryStringOptions {
  analyzer?:string
  fields?:Array<string>
  default_operator?:string
  flags?:string
}

export function SimpleQueryString(query, options={}){
  if(!query){
    return
  }
  return {
    "simple_query_string":_.extend({query}, options)
  }
}
