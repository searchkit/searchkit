import { QueryString } from '../../../../../'

describe('QueryString', () => {
  it('empty string', () => {
    expect(QueryString('')).toBe(undefined)
  })

  it('with string + options', () => {
    const qs = QueryString('foo', {
      analyzer: 'english',
      fields: ['title'],
      use_dis_max: true
    })
    expect(qs).toEqual({
      query_string: {
        query: 'foo',
        analyzer: 'english',
        fields: ['title'],
        use_dis_max: true
      }
    })
  })
})
