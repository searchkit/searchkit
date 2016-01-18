import * as _ from "lodash"

export function AggsContainer(key, inner, aggsArray:Array<any>=[]){
  aggsArray = _.compact(aggsArray)
  if(aggsArray.length > 0){
    inner.aggs = _.reduce(aggsArray, _.extend, {})
  }
  return {
    [key]:inner
  }
}
