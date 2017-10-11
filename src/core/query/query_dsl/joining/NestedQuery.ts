const assign = require("lodash/assign")
const pick = require("lodash/pick")
const allowedOptions = ["score_mode", "inner_hits"]

export function NestedQuery(path, query, options={}){
  return {
    nested:assign({
      path, query
    }, pick(options, allowedOptions))
  }
}
