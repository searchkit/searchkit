import type { SearchRequest } from '@searchkit/core'

// The terms aggregation `include` uses Lucene regex syntax, where & # @ ~ < > and " are
// operators too. Lucene reads a backslash before any character as that literal character.
export const createRegexQuery = (queryString: string) => {
  let query = queryString.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|&#@~<>"]/g, '\\$&')
  query = query
    .split('')
    .map((char) => {
      if (/[a-z]/i.test(char)) {
        return `[${char.toLowerCase()}${char.toUpperCase()}]`
      }
      return char
    })
    .join('')
  query = `${query}.*`
  if (queryString.length > 2) {
    query = `([a-zA-Z]+ )+?${query}`
  }
  return query
}

export const createElasticsearchQueryFromRequest = (requests: SearchRequest[]) => {
  return requests
    .reduce<string[]>(
      (sum, request) => [
        ...sum,
        JSON.stringify({ index: request.indexName }),
        '\n',
        JSON.stringify(request.body),
        '\n'
      ],
      []
    )
    .join('')
}
