import assign = require("lodash/assign")
import reduce = require("lodash/reduce")
import compact = require("lodash/compact")

export function AggsContainer(key:string, inner, aggsArray:Array<any>=[]){
  aggsArray = compact(aggsArray)
  if(aggsArray.length > 0){
    inner.aggs = reduce(aggsArray, assign, {})
  }
  return {
    [key]:inner
  }
}
