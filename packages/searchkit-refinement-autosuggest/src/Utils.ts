import map from 'lodash/map'

export const createRegexQuery = (queryString) => {
  let query = queryString.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&')
  query = map(query, (char) => {
    if (/[a-z]/.test(char)) {
      return `[${char}${char.toUpperCase()}]`
    }
    return char
  }).join('')
  query = `${query}.*`
  if (queryString.length > 2) {
    query = `([a-zA-Z]+ )+?${query}`
  }
  return query
}
