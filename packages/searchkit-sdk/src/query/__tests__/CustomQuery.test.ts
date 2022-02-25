import CustomQuery from '../CustomQuery'
import QueryManager from '../../core/QueryManager'

describe('Custom Query', () => {
  it('should allow custom ES query to be used to build query', () => {
    const qm = new QueryManager()
    qm.setQuery('test')
    const cq = new CustomQuery({
      queryFn: (query, qm) => ({
        bool: {
          must: [
            {
              wildcard: {
                field: {
                  value: query + '*',
                  boost: 1.0,
                  rewrite: 'constant_score'
                }
              }
            }
          ]
        }
      })
    })

    expect(cq.getFilter(qm)).toMatchInlineSnapshot(`
      Object {
        "bool": Object {
          "must": Array [
            Object {
              "wildcard": Object {
                "field": Object {
                  "boost": 1,
                  "rewrite": "constant_score",
                  "value": "test*",
                },
              },
            },
          ],
        },
      }
    `)
  })
})
