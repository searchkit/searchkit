const assign = require("lodash/assign")
const pick = require("lodash/pick")
const allowedOptions = ["score_mode", "inner_hits"]

export function HasParentQuery(parent_type, query, options={}){
  return {
    has_parent:assign({
      parent_type, query
    }, pick(options, allowedOptions))
  }
}
