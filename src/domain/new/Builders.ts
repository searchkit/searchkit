import * as _ from "lodash"


export function BoolMust(val:any=[]){
  return {bool:{must:val}}
}

export function SimpleQueryString(query, options={}){
  if(!query){
    return undefined
  }
  return {
    "simple_query_string": _.extend(options,{
      "query":query,
    })
  }
}
