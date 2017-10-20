const isArray = require("lodash/isArray")
const findIndex = require("lodash/findIndex")
const forEach = require("lodash/forEach")
const isEmpty = require("lodash/isEmpty")
const filter = require("lodash/filter")
const keys = require("lodash/keys")

function isBoolOp(operator, val) {
  // Has {bool: must: []} ?
  if (!val.bool || !val.bool[operator]) return false

  // Doesn't have other stuff ?
  return (keys(val).length == 1) && (keys(val.bool).length == 1)
}

function flattenBool(operator, arr:Array<any>) {
  // Flatten bool.must
  var newArr = []
  forEach(arr, node => {
    if (isBoolOp(operator, node)) {
      newArr = newArr.concat(node.bool[operator])
    } else {
      newArr.push(node)
    }
  })
  return newArr
}

function boolHelper(val, operator){
  const isArr = isArray(val)
  if (isArr) {
    // Remove empty filters
    val = filter(val, f => !isEmpty(f))
    if (val.length === 1) {
      if (operator != "must_not") return val[0]
      else val = val[0] // Unbox array
    } else if (val.length === 0) {
      return {}
    } else if ((operator == "must" || operator == "should")
      && (findIndex(val, isBoolOp.bind(null, operator)) != -1)) {
      val = flattenBool(operator, val)
    }
  }
  return {
    bool:{
      [operator]:val
    }
  }
}

export function BoolMust(val:any){
  return boolHelper(val, "must")
}

export function BoolMustNot(val:any){
  return boolHelper(val, "must_not")
}

export function BoolShould(val:any){
  return boolHelper(val, "should")
}
