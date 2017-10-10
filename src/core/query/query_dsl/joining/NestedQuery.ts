import assign = require("lodash/assign")
import pick = require("lodash/pick")
const allowedOptions = ["score_mode", "inner_hits"]

export function NestedQuery(path, query, options={}){
  return {
    nested:assign({
      path, query
    }, pick(options, allowedOptions))
  }
}
