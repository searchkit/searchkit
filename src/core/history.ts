import { createHistory, useQueries } from 'history'
const qs = require("qs")
export const history = useQueries(createHistory)({
  stringifyQuery(ob){
    return qs.stringify(ob, {encode:false})
  },
  parseQueryString(str){
    return qs.parse(str)
  }
})
