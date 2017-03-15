import { createHistory, useQueries, History, HistoryQueries } from 'history'
const qs = require("qs")
const qsUtils = require("qs/lib/utils")

export const encodeObjUrl = (obj) => {
  return qs.stringify(obj, { encode: true, encodeValuesOnly: true })
}

export const decodeObjString = (str) => {
  return qs.parse(str)
}

export const createHistoryInstance = function(){
  return useQueries(createHistory)({
    stringifyQuery(ob){
      return encodeObjUrl(ob)
    },
    parseQueryString(str){
      return decodeObjString(str)
    }
  })
}
