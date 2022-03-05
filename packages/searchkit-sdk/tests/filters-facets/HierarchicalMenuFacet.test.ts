import nock from 'nock'
import SearchkitRequest, {
  MultiMatchQuery,
  HierarchicalMenuFacet,
  SearchkitConfig
} from '../../src'
import lvl1Mock from '../__mock-data__/HierarchicalMenuFacet/lvl1.json'
import lvl2Mock from '../__mock-data__/HierarchicalMenuFacet/lvl2.json'
import lvl3Mock from '../__mock-data__/HierarchicalMenuFacet/lvl3.json'

describe('NumericRangeFilter', () => {
  let request
  let lastESRequest

  beforeEach(() => {
    request = null
    lastESRequest = null

    const config: SearchkitConfig = {
      host: 'http://localhost:9200',
      index: 'movies',
      hits: {
        fields: ['actors', 'writers']
      },
      query: new MultiMatchQuery({ fields: ['actors', 'writers', 'title^4', 'plot'] }),
      facets: [
        new HierarchicalMenuFacet({
          fields: ['category_lvl1.keyword', 'category_lvl2.keyword', 'category_lvl3.keyword'],
          identifier: 'categories',
          label: 'Categories'
        })
      ]
    }

    request = SearchkitRequest(config)
  })

  it('No filters, bring back only level 1 facets', async () => {
    nock('http://localhost:9200')
      .post('/movies/_search')
      .reply(200, (uri, body) => {
        expect(body).toMatchSnapshot()
        lastESRequest = body
        return lvl1Mock
      })

    const response = await request.execute({
      facets: true
    })
    expect(response.facets).toMatchSnapshot()
    expect(lastESRequest.aggs.facet_bucket_all.aggs.categories).toMatchInlineSnapshot(`
      Object {
        "aggs": Object {
          "lvl_1": Object {
            "aggs": Object {
              "aggs": Object {
                "terms": Object {
                  "field": "category_lvl1.keyword",
                },
              },
            },
            "filter": Object {
              "match_all": Object {},
            },
          },
        },
        "filter": Object {
          "match_all": Object {},
        },
      }
    `)
    expect(response.summary.appliedFilters).toEqual([])
  })

  it('Filter on level 1 facet', async () => {
    request.setFilters([{ identifier: 'categories', value: 'Coats and Jackets', level: 1 }])

    nock('http://localhost:9200')
      .post('/movies/_search')
      .reply(200, (uri, body) => {
        expect(body).toMatchSnapshot()
        lastESRequest = body
        return lvl2Mock
      })

    const response = await request.execute({
      facets: true
    })
    expect(lastESRequest.aggs.facet_bucket_categories.aggs.categories).toMatchInlineSnapshot(`
      Object {
        "aggs": Object {
          "lvl_1": Object {
            "aggs": Object {
              "aggs": Object {
                "terms": Object {
                  "field": "category_lvl1.keyword",
                },
              },
            },
            "filter": Object {
              "match_all": Object {},
            },
          },
          "lvl_2": Object {
            "aggs": Object {
              "aggs": Object {
                "terms": Object {
                  "field": "category_lvl2.keyword",
                },
              },
            },
            "filter": Object {
              "bool": Object {
                "must": Array [
                  Object {
                    "term": Object {
                      "category_lvl1.keyword": Object {
                        "value": "Coats and Jackets",
                      },
                    },
                  },
                ],
              },
            },
          },
        },
        "filter": Object {
          "match_all": Object {},
        },
      }
    `)
    expect(response.summary.appliedFilters).toEqual([
      {
        display: 'HierarchicalMenuFacet',
        id: 'categories_Coats and Jackets',
        identifier: 'categories',
        label: 'Categories',
        level: 1,
        type: 'HierarchicalValueSelectedFilter',
        value: 'Coats and Jackets'
      }
    ])
    expect(response.facets[0].entries).toHaveLength(10)
    expect(
      response.facets[0].entries.find(({ label }) => label === 'Coats and Jackets').entries
    ).toHaveLength(9)
    expect(response.facets[0].entries.filter(({ entries }) => entries !== null)).toHaveLength(1)
  })

  it('1 lvl1 filter, bring back level 1..3 facets. Lvl2 facets have lvl1 filter applied, lvl3 will have lvl 1..2 filter applied', async () => {
    request.setFilters([
      { identifier: 'categories', value: 'Coats and Jackets', level: 1 },
      { identifier: 'categories', value: 'Leather jackets', level: 2 }
    ])

    nock('http://localhost:9200')
      .post('/movies/_search')
      .reply(200, (uri, body) => {
        expect(body).toMatchSnapshot()
        lastESRequest = body
        return lvl3Mock
      })

    const response = await request.execute({
      facets: true
    })

    expect(lastESRequest.aggs.facet_bucket_categories.aggs.categories).toMatchInlineSnapshot(`
      Object {
        "aggs": Object {
          "lvl_1": Object {
            "aggs": Object {
              "aggs": Object {
                "terms": Object {
                  "field": "category_lvl1.keyword",
                },
              },
            },
            "filter": Object {
              "match_all": Object {},
            },
          },
          "lvl_2": Object {
            "aggs": Object {
              "aggs": Object {
                "terms": Object {
                  "field": "category_lvl2.keyword",
                },
              },
            },
            "filter": Object {
              "bool": Object {
                "must": Array [
                  Object {
                    "term": Object {
                      "category_lvl1.keyword": Object {
                        "value": "Coats and Jackets",
                      },
                    },
                  },
                ],
              },
            },
          },
          "lvl_3": Object {
            "aggs": Object {
              "aggs": Object {
                "terms": Object {
                  "field": "category_lvl3.keyword",
                },
              },
            },
            "filter": Object {
              "bool": Object {
                "must": Array [
                  Object {
                    "term": Object {
                      "category_lvl1.keyword": Object {
                        "value": "Coats and Jackets",
                      },
                    },
                  },
                  Object {
                    "term": Object {
                      "category_lvl2.keyword": Object {
                        "value": "Leather jackets",
                      },
                    },
                  },
                ],
              },
            },
          },
        },
        "filter": Object {
          "match_all": Object {},
        },
      }
    `)
    expect(response.summary.appliedFilters).toMatchInlineSnapshot(`
      Array [
        Object {
          "display": "HierarchicalMenuFacet",
          "id": "categories_Coats and Jackets",
          "identifier": "categories",
          "label": "Categories",
          "level": 1,
          "type": "HierarchicalValueSelectedFilter",
          "value": "Coats and Jackets",
        },
        Object {
          "display": "HierarchicalMenuFacet",
          "id": "categories_Leather jackets",
          "identifier": "categories",
          "label": "Categories",
          "level": 2,
          "type": "HierarchicalValueSelectedFilter",
          "value": "Leather jackets",
        },
      ]
    `)

    const lvl1Facet = response.facets[0].entries.find(({ label }) => label === 'Coats and Jackets')

    expect(lvl1Facet.entries).toHaveLength(9)
    expect(lvl1Facet.entries.find(({ label }) => label === 'Leather jackets').entries).toHaveLength(
      2
    )
    expect(response.facets[0].entries.filter(({ entries }) => entries !== null)).toHaveLength(1)
  })

  it('Ignore level 3 filter because only lvl1 filter has been applied', async () => {
    request.setFilters([
      { identifier: 'categories', value: 'Coats and Jackets', level: 1 },
      { identifier: 'categories', value: 'Leather jackets', level: 3 }
    ])

    nock('http://localhost:9200')
      .post('/movies/_search')
      .reply(200, (uri, body) => {
        expect(body).toMatchSnapshot()
        lastESRequest = body
        return lvl3Mock
      })

    const response = await request.execute({
      facets: true
    })

    expect(lastESRequest.aggs.facet_bucket_categories.aggs.categories).toMatchInlineSnapshot(`
      Object {
        "aggs": Object {
          "lvl_1": Object {
            "aggs": Object {
              "aggs": Object {
                "terms": Object {
                  "field": "category_lvl1.keyword",
                },
              },
            },
            "filter": Object {
              "match_all": Object {},
            },
          },
          "lvl_2": Object {
            "aggs": Object {
              "aggs": Object {
                "terms": Object {
                  "field": "category_lvl2.keyword",
                },
              },
            },
            "filter": Object {
              "bool": Object {
                "must": Array [
                  Object {
                    "term": Object {
                      "category_lvl1.keyword": Object {
                        "value": "Coats and Jackets",
                      },
                    },
                  },
                ],
              },
            },
          },
        },
        "filter": Object {
          "match_all": Object {},
        },
      }
    `)
    expect(response.summary.appliedFilters).toMatchInlineSnapshot(`
      Array [
        Object {
          "display": "HierarchicalMenuFacet",
          "id": "categories_Coats and Jackets",
          "identifier": "categories",
          "label": "Categories",
          "level": 1,
          "type": "HierarchicalValueSelectedFilter",
          "value": "Coats and Jackets",
        },
        Object {
          "display": "HierarchicalMenuFacet",
          "id": "categories_Leather jackets",
          "identifier": "categories",
          "label": "Categories",
          "level": 3,
          "type": "HierarchicalValueSelectedFilter",
          "value": "Leather jackets",
        },
      ]
    `)
  })
})
