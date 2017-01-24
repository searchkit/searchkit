import { createHistory, useQueries, History, HistoryQueries } from 'history'
const qs = require("qs")

export const createHistoryInstance = function(){
  return useQueries(createHistory)({
    stringifyQuery(ob){
      return qs.stringify(ob, {encode:true})
    },
    parseQueryString(str){
      return qs.parse(str)
    }
  })
}
