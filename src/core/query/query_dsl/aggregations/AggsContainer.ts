import {assign} from "lodash"
import {reduce} from "lodash"
import {compact} from "lodash"

export function AggsContainer(key, inner, aggsArray:Array<any>=[]){
  aggsArray = compact(aggsArray)
  if(aggsArray.length > 0){
    inner.aggs = reduce(aggsArray, assign, {})
  }
  return {
    [key]:inner
  }
}
