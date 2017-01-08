import {assign} from "lodash"

export interface MultiMatchOptions {
  fields:Array<string>,
  type?:string,
  tie_breaker?:number,
  operator?:string,
  minimum_should_match?:string,
  analyzer?:string
}

export function MultiMatchQuery(query, options:MultiMatchOptions){
  if(!query){
    return
  }

  return {
    multi_match:assign({query}, options)
  }
}
