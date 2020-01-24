import { createBrowserHistory, createMemoryHistory, History } from 'history'
const qs = require('qs')

export const encodeObjUrl = (obj) => qs.stringify(obj, { encode: true, encodeValuesOnly: true })

export const decodeObjString = (str) => qs.parse(str)

export const supportsHistory = () => typeof window !== 'undefined' && !!window.history

export const createHistoryInstance = function(): History {
  return supportsHistory() ? createBrowserHistory() : createMemoryHistory()
}
