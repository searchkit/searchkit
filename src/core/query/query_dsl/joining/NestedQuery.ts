import {assign} from "lodash"
import {pick} from "lodash"
const allowedOptions = ["score_mode", "inner_hits"]

export function NestedQuery(path, query, options={}){
  return {
    nested:assign({
      path, query
    }, pick(options, allowedOptions))
  }
}
