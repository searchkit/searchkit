const isArray = require("lodash/isArray")

function boolHelper(val, operator){
  const isArr = isArray(val)
  if(isArr && val.length === 1){
    return val[0]
  }
  else if(isArr && val.length === 0){
    return {}
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
