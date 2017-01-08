import {assign} from "lodash"

export interface QueryStringOptions {
  analyzer?:string
  fields?:Array<string>
  default_operator?:string
  flags?:string
  [str:string]:any
}

export function QueryString(query, options:QueryStringOptions={}){
  if(!query){
    return
  }
  return {
    "query_string":assign({query}, options)
  }
}
