import {assign} from "lodash"
import {pick} from "lodash"
const allowedOptions = ["score_mode", "inner_hits"]

export function NestedQuery(path, filter, options={}){
  return {
    nested:assign({
      path, filter
    }, pick(options, allowedOptions))
  }
}
