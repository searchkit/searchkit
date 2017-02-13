import {assign} from "lodash"
import {pick} from "lodash"
const allowedOptions = ["score_mode", "inner_hits"]

export function HasParentQuery(parent_type, query, options={}){
  return {
    has_parent:assign({
      parent_type, query
    }, pick(options, allowedOptions))
  }
}
