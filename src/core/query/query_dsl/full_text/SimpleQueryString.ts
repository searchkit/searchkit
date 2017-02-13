import {assign} from "lodash"

export interface SimpleQueryStringOptions {
  analyzer?:string
  fields?:Array<string>
  default_operator?:string
  flags?:string
  [str:string]:any
}

export function SimpleQueryString(query, options:SimpleQueryStringOptions={}){
  if(!query){
    return
  }
  return {
    "simple_query_string":assign({query}, options)
  }
}
