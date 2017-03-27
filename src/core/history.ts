import { createBrowserHistory, History } from 'history'
const qs = require("qs")

export const encodeObjUrl = (obj) => {
  return qs.stringify(obj, { encode: true, encodeValuesOnly: true })
}

export const decodeObjString = (str) => {
  return qs.parse(str)
}

export const createHistoryInstance = function(){
  return createBrowserHistory()
}
