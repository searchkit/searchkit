import * as _ from "lodash"


export function BoolMust(val:any=[]){
  return {bool:{must:val}, $array:val}
}

export function BoolMustNot(val:any=[]){
  return {bool:{must_not:val}, $array:val}
}

export function BoolShould(val:any=[]){
  return {bool:{should:val}, $array:val}
}

export function MatchPhrasePrefix(query, str){

  let tokens = str.split("^")
  let field = tokens[0]
  let boost = Number(tokens[1] || 1)
  return {
    "match_phrase_prefix":{
      [field]:{query, boost}
    }
  }
}

export function SimpleQueryString(query, options={}){
  if(!query){
    return undefined
  }
  return {
    "simple_query_string":_.extend({}, options,{
      query:query
    })
  }
}
export interface TermOptions {
  $name?:string,
  $value?:string|number,
  $remove?:Function,
  $disabled?:boolean,
  $id?:string,
  [prop:string]:any
}
export function Term(key, value, options:TermOptions={}){
  const defaultOptions = {
    $disabled:true
  }
  return _.extend({
    term:{
      [key]:value
    }
  }, defaultOptions, options)
}

export function Terms(key, options){
  return {
    terms:_.extend({
      field:key
    }, options)
  }
}

export function Range(key, from, to, options:TermOptions={}) {
  const defaultOptions = {
    $disabled:true
  }
  return _.extend({
    range: {
      [key]:{
        gte:from,
        lt:to
      }
    }
  }, defaultOptions, options)
}
