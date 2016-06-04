const assign = require("lodash/assign")
const pick = require("lodash/pick")
const allowedOptions = ["score_mode", "inner_hits"]

export function NestedQuery(path, filter, options={}){
  return {
    nested:assign({
      path, filter
    }, pick(options, allowedOptions))
  }
}
