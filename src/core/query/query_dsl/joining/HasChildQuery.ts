const assign = require("lodash/assign")
const pick = require("lodash/pick")
const allowedOptions = ["score_mode", "inner_hits", "min_children", "max_children"]

export function HasChildQuery(type, query, options={}){
  return {
    has_child:assign({
      type, query
    }, pick(options, allowedOptions))
  }
}
