import { createBrowserHistory, createMemoryHistory,  History } from 'history'
const qs = require("qs")

export const encodeObjUrl = (obj) => {
  return encodeURI(qs.stringify(obj, { encode: true, encodeValuesOnly: false }))
}

export const decodeObjString = (str) => {
  return qs.parse(decodeURI(str))
}

export const supportsHistory = ()=> {
  return typeof window !== 'undefined' && !!window.history
}

export const createHistoryInstance = function():History{
  return supportsHistory() ? createBrowserHistory() : createMemoryHistory()
}
