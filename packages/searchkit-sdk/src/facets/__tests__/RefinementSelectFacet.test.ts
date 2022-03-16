import RefinementSelectFacet from '../RefinementSelectFacet'

describe('Multiple Select Facet', () => {
  const msf = new RefinementSelectFacet({ identifier: 'testId', label: 'Test', field: 'testField' })

  it('getFilter', () => {
    expect(
      msf.getFilters([
        { identifier: 'test', value: 'testValue' },
        { identifier: 'test', value: 'testValue2' }
      ])
    ).toMatchInlineSnapshot(`
      Object {
        "bool": Object {
          "must": Array [
            Object {
              "term": Object {
                "testField": "testValue",
              },
            },
            Object {
              "term": Object {
                "testField": "testValue2",
              },
            },
          ],
        },
      }
    `)
  })

  it('getAggregation', () => {
    expect(msf.getAggregation(null)).toMatchInlineSnapshot(`
      Object {
        "testId": Object {
          "terms": Object {
            "field": "testField",
            "size": 5,
          },
        },
      }
    `)
  })

  it('transformResponse', () => {
    expect(
      msf.transformResponse({
        buckets: [
          { key: 'bla', doc_count: 1 },
          { key: 'da', doc_count: 1 }
        ]
      })
    ).toMatchInlineSnapshot(`
      Object {
        "display": "ListFacet",
        "entries": Array [
          Object {
            "count": 1,
            "label": "bla",
          },
          Object {
            "count": 1,
            "label": "da",
          },
        ],
        "identifier": "testId",
        "label": "Test",
        "type": "RefinementSelectFacet",
      }
    `)
  })

  describe('sort order options', () => {
    it('getAggregation with count', () => {
      const msf = new RefinementSelectFacet({
        identifier: 'testId',
        label: 'Test',
        field: 'testField',
        order: 'count'
      })

      expect(msf.getAggregation(null)).toMatchInlineSnapshot(`
        Object {
          "testId": Object {
            "terms": Object {
              "field": "testField",
              "order": Object {
                "_count": "desc",
              },
              "size": 5,
            },
          },
        }
      `)
    })

    it('getAggregation with value', () => {
      const msf = new RefinementSelectFacet({
        identifier: 'testId',
        label: 'Test',
        field: 'testField',
        order: 'value'
      })

      expect(msf.getAggregation(null)).toMatchInlineSnapshot(`
        Object {
          "testId": Object {
            "terms": Object {
              "field": "testField",
              "order": Object {
                "_key": "asc",
              },
              "size": 5,
            },
          },
        }
      `)
    })
  })
})
