import nock from 'nock'
import { SearchkitConfig } from '@searchkit/sdk'
import { MultiMatchQuery, HierarchicalMenuFacet } from '@searchkit/sdk'
import { setupTestServer, callQuery } from '../support/helper'
import lvl1Mock from '../__mock-data__/HierarchicalMenuFacet/lvl1.json'
import lvl2Mock from '../__mock-data__/HierarchicalMenuFacet/lvl2.json'
import lvl3Mock from '../__mock-data__/HierarchicalMenuFacet/lvl3.json'

describe('HierarchicalMenuFacet', () => {
  describe('should return as expected', () => {
    const runQuery = async (gql) => {
      const response = await callQuery({ gql })
      return response
    }

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

    it('No filters, bring back only level 1 facets', async () => {
      setupTestServer({
        config,
        addToQueryType: true,
        typeName: 'ResultSet',
        hitTypeName: 'ResultHit'
      })

      const gql = `
        {
          results(filters: []) {
            hits(page: {size: 10, from: 0 }) {
              items {
                id
              }
            }
            facets {
              identifier
              display
              label
              type
              display
              ... on HierarchicalMenuFacet {
                entries {
                  count
                  label
                  entries {
                    count
                    label
                    entries {
                      count
                      label
                    }
                  }
                }
              }
            }
          }
        }
      `

      const scope = nock('http://localhost:9200')
        .post('/movies/_search')
        .reply((uri, body) => {
          expect(body).toMatchInlineSnapshot(`
            Object {
              "_source": Object {
                "includes": Array [
                  "actors",
                  "writers",
                ],
              },
              "aggs": Object {
                "facet_bucket_all": Object {
                  "aggs": Object {
                    "categories": Object {
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
                    },
                  },
                  "filter": Object {
                    "bool": Object {
                      "must": Array [],
                    },
                  },
                },
              },
              "from": 0,
              "size": 10,
              "sort": Array [
                Object {
                  "_score": "desc",
                },
              ],
            }
          `)
          return [200, lvl1Mock]
        })

      const response = await runQuery(gql)
      expect(response.body.data).toMatchSnapshot()
      expect(response.status).toEqual(200)
    })

    it('1 lvl1 filter, bring back level 1 + lvl2 facets. Lvl2 facets have lvl1 filter applied', async () => {
      setupTestServer({
        config,
        addToQueryType: true,
        typeName: 'ResultSet',
        hitTypeName: 'ResultHit'
      })

      const gql = `
        {
          results(filters: [{identifier: "categories", value: "Coats and Jackets", level: 1 }]) {
            hits(page: {size: 10, from: 0 }) {
              items {
                id
              }
            }
            facets {
              identifier
              display
              label
              type
              display
              ... on HierarchicalMenuFacet {
                entries {
                  count
                  label
                  entries {
                    count
                    label
                    entries {
                      count
                      label
                    }
                  }
                }
              }
            }
          }
        }
      `

      const scope = nock('http://localhost:9200')
        .post('/movies/_search')
        .reply((uri, body) => {
          expect(body).toMatchInlineSnapshot(`
            Object {
              "_source": Object {
                "includes": Array [
                  "actors",
                  "writers",
                ],
              },
              "aggs": Object {
                "facet_bucket_all": Object {
                  "aggs": Object {},
                  "filter": Object {
                    "bool": Object {
                      "must": Array [
                        Object {
                          "bool": Object {
                            "must": Array [
                              Object {
                                "term": Object {
                                  "category_lvl1.keyword": "Coats and Jackets",
                                },
                              },
                            ],
                          },
                        },
                      ],
                    },
                  },
                },
                "facet_bucket_categories": Object {
                  "aggs": Object {
                    "categories": Object {
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
                    },
                  },
                  "filter": Object {
                    "bool": Object {
                      "must": Array [],
                    },
                  },
                },
              },
              "from": 0,
              "post_filter": Object {
                "bool": Object {
                  "must": Array [
                    Object {
                      "bool": Object {
                        "must": Array [
                          Object {
                            "term": Object {
                              "category_lvl1.keyword": "Coats and Jackets",
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
              "size": 10,
              "sort": Array [
                Object {
                  "_score": "desc",
                },
              ],
            }
          `)
          return [200, lvl2Mock]
        })

      const response = await runQuery(gql)
      expect(response.body.data).toMatchSnapshot()
      expect(response.status).toEqual(200)
    })

    it('1 lvl1 filter, bring back level 1..3 facets. Lvl2 facets have lvl1 filter applied, lvl3 will have lvl 1..2 filter applied', async () => {
      setupTestServer({
        config,
        addToQueryType: true,
        typeName: 'ResultSet',
        hitTypeName: 'ResultHit'
      })

      const gql = `
        {
          results(filters: [{identifier: "categories", value: "Coats and Jackets", level: 1 }, {identifier: "categories", value: "Leather jackets", level: 2 }]) {
            hits(page: {size: 10, from: 0 }) {
              items {
                id
              }
            }
            facets {
              identifier
              display
              label
              type
              display
              ... on HierarchicalMenuFacet {
                entries {
                  count
                  label
                  entries {
                    count
                    label
                    entries {
                      count
                      label
                    }
                  }
                }
              }
            }
          }
        }
      `

      const scope = nock('http://localhost:9200')
        .post('/movies/_search')
        .reply((uri, body) => {
          expect(body).toMatchInlineSnapshot(`
            Object {
              "_source": Object {
                "includes": Array [
                  "actors",
                  "writers",
                ],
              },
              "aggs": Object {
                "facet_bucket_all": Object {
                  "aggs": Object {},
                  "filter": Object {
                    "bool": Object {
                      "must": Array [
                        Object {
                          "bool": Object {
                            "must": Array [
                              Object {
                                "term": Object {
                                  "category_lvl1.keyword": "Coats and Jackets",
                                },
                              },
                              Object {
                                "term": Object {
                                  "category_lvl2.keyword": "Leather jackets",
                                },
                              },
                            ],
                          },
                        },
                      ],
                    },
                  },
                },
                "facet_bucket_categories": Object {
                  "aggs": Object {
                    "categories": Object {
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
                    },
                  },
                  "filter": Object {
                    "bool": Object {
                      "must": Array [],
                    },
                  },
                },
              },
              "from": 0,
              "post_filter": Object {
                "bool": Object {
                  "must": Array [
                    Object {
                      "bool": Object {
                        "must": Array [
                          Object {
                            "term": Object {
                              "category_lvl1.keyword": "Coats and Jackets",
                            },
                          },
                          Object {
                            "term": Object {
                              "category_lvl2.keyword": "Leather jackets",
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
              "size": 10,
              "sort": Array [
                Object {
                  "_score": "desc",
                },
              ],
            }
          `)
          return [200, lvl3Mock]
        })

      const response = await runQuery(gql)
      expect(response.body.data).toMatchSnapshot()
      expect(response.status).toEqual(200)
    })
  })
})
