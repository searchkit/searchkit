import {
  FacetAccessor, ImmutableQuery, Searcher,SearchkitManager,
  BoolMust, BoolShould, ArrayState, NestedFacetAccessor
} from "../../../"
import * as _ from "lodash"

describe("NestedFacetAccessor", ()=> {

  beforeEach(()=> {
    this.searcher = new Searcher(new SearchkitManager('/'))
    this.accessor = new NestedFacetAccessor("categories", {
      field:"taxonomy",
      id:"categories",
      title:"Categories"
    })
    this.accessor.setSearcher(this.searcher)
    this.query = new ImmutableQuery()
    this.toPlainObject = (ob)=> {
      return JSON.parse(JSON.stringify(ob))
    }
  })


  it("getBuckets()", ()=> {
    this.searcher.results = {
      aggregations:{
        "categories": {
          "parents": {
            "lvl1":{
              parents:{
                buckets: [1,2,3]
              }
            },
            "lvl2":{
              parents: {
                buckets: [4,5,6]
              }
            }
          }
        }
      }
    }
    expect(this.accessor.getBuckets(1))
      .toEqual([1,2,3])
    expect(this.accessor.getBuckets(2))
      .toEqual([4,5,6])
    expect(this.accessor.getBuckets(4))
      .toEqual([])
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
    let filters = _.chain(query.query.filter.$array)
      .pluck("$array")
      .flatten().value()
    expect(this.toPlainObject(filters)).toEqual([
      {
        "term": {
          "taxonomy.ancestors": "lvl1val"
        },
        "$disabled": true,
        "$name": "Categories",
        "$value": "lvl1val",
        "$id": "categories"
      },
      {
        "term": {
          "taxonomy.ancestors": "lvl2val"
        },
        "$disabled": true,
        "$name": "Categories",
        "$value": "lvl2val",
        "$id": "categories"
      },
      {
        "term": {
          "taxonomy.value": "lvl3val"
        },
        "$disabled": false,
        "$name": "Categories",
        "$value": "lvl3val",
        "$id": "categories"
      }
    ])
    filters[2].$remove()

    query = this.accessor.buildSharedQuery(this.query)
    filters = _.chain(query.query.filter.$array)
      .pluck("$array")
      .flatten().value()

    expect(this.toPlainObject(filters)).toEqual([
      {
        "term": {
          "taxonomy.ancestors": "lvl1val"
        },
        "$disabled": true,
        "$name": "Categories",
        "$value": "lvl1val",
        "$id": "categories"
      },
      {
        "term": {
          "taxonomy.value": "lvl2val"
        },
        "$disabled": false,
        "$name": "Categories",
        "$value": "lvl2val",
        "$id": "categories"
      }
    ])
  })

  it("buildOwnQuery()", ()=> {
    const getFilters = (aggs)=> {
      let filters = _.map(aggs.filter.$array, (f:any) => { return {term:f.term} })
      return filters
    }

    this.accessor.state = this.accessor.state
      .add(0, "lvl1val")
      .add(1, "lvl2val")
      .add(2, "lvl3val")
    let query = this.accessor.buildSharedQuery(this.query)
    query = this.accessor.buildOwnQuery(query)

    //lvl1
    let lvl1Aggs = query.query.aggs.categories.aggs.parents.aggs.lvl1;
    expect(getFilters(lvl1Aggs)).toEqual([
      {
        term: {
          "taxonomy.level":2
        }
      },
      {
        term: {
          "taxonomy.ancestors":"lvl1val"
        }
      },
    ])

    let lvl2Aggs = query.query.aggs.categories.aggs.parents.aggs.lvl2;
    expect(getFilters(lvl2Aggs)).toEqual([
      {
        term: {
          "taxonomy.level":3
        }
      },
      {
        term: {
          "taxonomy.ancestors":"lvl1val"
        }
      },
      {
        term: {
          "taxonomy.ancestors":"lvl2val"
        }
      },
    ])

  })

})
