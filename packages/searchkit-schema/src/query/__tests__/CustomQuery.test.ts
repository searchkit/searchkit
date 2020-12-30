import CustomQuery from '../CustomQuery'
import QueryManager from '../../core/QueryManager'

describe('Custom Query', () => {
  it('should allow custom ES query to be used to build query', () => {
    const qm = new QueryManager([], 'test')
    const cq = new CustomQuery({
      queryFn: (query, qm) => ({
        wildcard: {
          field: {
            value: query + '*',
            boost: 1.0,
            rewrite: 'constant_score'
          }
        }
      })
    })

    expect(cq.getFilter(qm)).toMatchInlineSnapshot(
      {},
      `
      Object {
        "wildcard": Object {
          "field": Object {
            "boost": 1,
            "rewrite": "constant_score",
            "value": "test*",
          },
        },
      }
    `
    )
  })
})
