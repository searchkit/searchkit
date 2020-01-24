import { FilteredQuery } from '../../../../../'

it('FilteredQuery', () => {
  const filtered = {
    filter: {
      term: { color: 'red' }
    },
    query: {
      match: {
        keywords: 'sky'
      }
    }
  }
  expect(FilteredQuery(filtered)).toEqual({ filtered: filtered })
})
