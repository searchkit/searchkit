import {
  ImmutableQuery,SearchkitManager,
  BoolMust, BoolShould, NestedFacetAccessor,
  NestedQuery, TermQuery, FilterBucket, NestedBucket, MinMetric,
  TermsBucket, DefaultNumberBuckets
} from "../../../"

import * as _ from "lodash"

describe("NestedFacetAccessor", ()=> {

  beforeEach(()=> {
    this.options = {
      field:"taxonomy",
      id:"categories",
      title:"Categories",
      orderKey:"taxonomy.order",
      orderDirection:"desc"
    }
    this.accessor = new NestedFacetAccessor("categories", this.options)
    this.accessor.setSearchkitManager(SearchkitManager.mock())
    this.query = new ImmutableQuery()
    this.toPlainObject = (ob)=> {
      return JSON.parse(JSON.stringify(ob))
    }
  })


  it("getBuckets()", ()=> {
    this.accessor.results = {
      aggregations:{
        "categories": {
          "children": {
            "lvl1":{
              children:{
                buckets: [
                  { key: 1 }, { key: 2, }, { key: 3 }
                ]
              }
            },
            "lvl2":{
              children: {
                buckets: [
                  { key: 4 }, { key: 5, }, { key: 6 }
                ]                
              }
            }
          }
        }
      }
    }
    expect(this.accessor.getBuckets(1)).toEqual([
      { key: "1" }, { key: "2" }, { key: "3" }
    ])
    expect(this.accessor.getBuckets(2)).toEqual([
      { key: "4" }, { key: "5" }, { key: "6" }
    ])
    expect(this.accessor.getBuckets(4))
      .toEqual([])
  })

  it("getTermAggs()", ()=> {

    expect(this.accessor.getTermAggs()).toEqual(
      TermsBucket(
        "children",
        "taxonomy.value",
        {size:DefaultNumberBuckets, order:{taxonomy_order:"desc"}},
        MinMetric("taxonomy_order", "taxonomy.order")
      )
    )

    this.options.orderKey = "_count"
    this.options.orderDirection = "asc"
    expect(this.accessor.getTermAggs()).toEqual(
      TermsBucket(
        "children", "taxonomy.value",
        {size:DefaultNumberBuckets, order:{"_count":"asc"}}
      )
    )

    delete this.options.orderKey
    delete this.options.orderDirection

    expect(this.accessor.getTermAggs()).toEqual(
      TermsBucket(
        "children", "taxonomy.value",
        {size:DefaultNumberBuckets, order:undefined}
      )
    )

  })


  it("buildSharedQuery", ()=> {
    this.accessor.state = this.accessor.state
      .add(0, "lvl1val")
      .add(1, "lvl2val")
      .add(2, "lvl3val")
    expect(this.toPlainObject(this.accessor.state.getValue()))
      .toEqual([["lvl1val"], ['lvl2val'], ["lvl3val"]])
    //
    let query = this.accessor.buildSharedQuery(this.query)
    let expected = BoolMust([
      NestedQuery("taxonomy",
        BoolMust([
          TermQuery("taxonomy.ancestors", "lvl1val"),
          TermQuery("taxonomy.ancestors", "lvl2val"),
          TermQuery("taxonomy.value", "lvl3val")
        ])
      )
    ])
    expect(query.query.post_filter).toEqual(expected)
    let selectedFilters = query.getSelectedFilters()
    expect(this.toPlainObject(selectedFilters[0])).toEqual({
      id: 'categories',
      name: 'lvl2val',
      value: 'lvl3val'
    })
    selectedFilters[0].remove()
    expect(this.toPlainObject(this.accessor.state.getValue()))
      .toEqual([["lvl1val"], ['lvl2val']])
  })

  it("buildOwnQuery()", ()=> {
    this.accessor.state = this.accessor.state
      .add(0, "lvl1val")
      .add(1, "lvl2val")
      .add(2, "lvl3val")
    this.query = this.query.addFilter("other", BoolShould(["foo"]))
    let query = this.accessor.buildSharedQuery(this.query)
    query = this.accessor.buildOwnQuery(query)
    expect(_.keys(query.index.filtersMap).sort()).toEqual(['categories1', 'other'])
    let termsBucket = TermsBucket(
      "children",
      "taxonomy.value",
      {size:DefaultNumberBuckets, order:{taxonomy_order:"desc"}},
      MinMetric("taxonomy_order", "taxonomy.order")
    )
    let expected = FilterBucket(
      "categories",
      BoolMust([ BoolShould(["foo"]) ]),
      NestedBucket(
        "children","taxonomy",
        FilterBucket(
          "lvl0",
          BoolMust([
            TermQuery("taxonomy.level", 1)
          ]),
          termsBucket
        ),
        FilterBucket(
          "lvl1",
          BoolMust([
            TermQuery("taxonomy.level", 2),
            TermQuery("taxonomy.ancestors", "lvl1val")
          ]),
          termsBucket
        ),
        FilterBucket(
          "lvl2",
          BoolMust([
            TermQuery("taxonomy.level", 3),
            TermQuery("taxonomy.ancestors", "lvl1val"),
            TermQuery("taxonomy.ancestors", "lvl2val")
          ]),
          termsBucket
        ),
        FilterBucket(
          "lvl3",
          BoolMust([
            TermQuery("taxonomy.level", 4),
            TermQuery("taxonomy.ancestors", "lvl1val"),
            TermQuery("taxonomy.ancestors", "lvl2val"),
            TermQuery("taxonomy.ancestors", "lvl3val")
          ]),
          termsBucket
        )

      )

    )
    expect(query.query.aggs).toEqual(expected)

  })

})
