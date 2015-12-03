import { createHistory, useQueries } from 'history'
const qs = require('qs')
// export default useQueries(createHistory)({
//   parseQueryString: function (queryString) {
//     return qs.parse(queryString, {allowDots:false})
//   },
//   stringifyQuery: function (query) {
//     return qs.stringify(query)
//   }
// })

export default useQueries(createHistory)({})
