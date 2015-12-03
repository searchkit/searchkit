import * as _ from "lodash"


export function BoolMust(val:any=[]){
  return {bool:{must:val}}
}

export function BoolShould(val:any=[]){
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

export function Term(key, value){
  return {
    term:{
      [key]:value
    }
  }
}

export function Terms(key, options){
  return {
    terms:{
      [key]:_.extend({
        field:key
      }, options)
    }
  }
}
