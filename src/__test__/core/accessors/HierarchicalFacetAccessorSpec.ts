import {
  FacetAccessor, ImmutableQuery, Searcher,SearchkitManager,
  BoolMust, BoolShould, ArrayState, HierarchicalFacetAccessor
} from "../../../"
import * as _ from "lodash"

describe("HierarchicalFacetAccessor", ()=> {

  beforeEach(()=> {
    this.searcher = new Searcher(new SearchkitManager('/'))
    this.accessor = new HierarchicalFacetAccessor("categories", {
      fields:["lvl1", "lvl2", "lvl3"],
      id:"categories_id",
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
        lvl2:{
          lvl2:{
            buckets:[1,2,3]
          }
        },
        lvl3:{
          lvl3:{
            buckets:[4,5,6]
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

    let query = this.accessor.buildSharedQuery(this.query)
    let filters = _.chain(query.query.filter.$array)
      .pluck("$array")
      .flatten().value()
    expect(this.toPlainObject(filters)).toEqual([
      {
        "term": {
          "lvl1": "lvl1val"
        },
        "$disabled": true,
        "$name": "Categories",
        "$value": "lvl1val",
        "$id": "categories_id"
      },
      {
        "term": {
          "lvl2": "lvl2val"
        },
        "$disabled": true,
        "$name": "lvl1val",
        "$value": "lvl2val",
        "$id": "categories_id"
      },
      {
        "term": {
          "lvl3": "lvl3val"
        },
        "$disabled": false,
        "$name": "lvl2val",
        "$value": "lvl3val",
        "$id": "categories_id"
      }
    ])
    filters[1].$remove()
    expect(this.toPlainObject(this.accessor.state.getValue()))
      .toEqual([['lvl1val'], [], ['lvl3val']])
    filters[0].$remove()
    expect(this.toPlainObject(this.accessor.state.getValue()))
      .toEqual([[], [], ['lvl3val']])
    filters[2].$remove()
    expect(this.toPlainObject(this.accessor.state.getValue()))
      .toEqual([[], [], []])

    //check same query is returned when no filters exist
    let newQuery = this.accessor.buildSharedQuery(query)
    expect(newQuery).toBe(query)
  })

  it("buildOwnQuery()", ()=> {
    const getFilters = (aggs)=> {
      let filters = _.flatten(_.pluck(aggs.filter.$array, "$array"))
      return _.map(filters, f=> _.pick(f,"term"))
    }
    this.accessor.state = this.accessor.state
      .add(0, "lvl1val")
      .add(1, "lvl2val")
      .add(2, "lvl3val")
    let query = this.accessor.buildSharedQuery(this.query)
    query = this.accessor.buildOwnQuery(query)


    //lvl1
    let aggs1 = query.query.aggs.lvl1
    expect(getFilters(aggs1)).toEqual([])
    expect(aggs1.aggs.lvl1.terms).toEqual({
      field:'lvl1', size:20
    })


    //lvl2
    let aggs2 = query.query.aggs.lvl2
    expect(getFilters(aggs2)).toEqual([
      {term:{lvl1:"lvl1val"}}
    ])
    expect(aggs2.aggs.lvl2.terms).toEqual({
      field:"lvl2", size:20
    })

    //lvl3
    let aggs3 = query.query.aggs.lvl3
    expect(getFilters(aggs3)).toEqual([
      {term:{lvl1:"lvl1val"}},
      {term:{lvl2:"lvl2val"}}
    ])
    expect(aggs3.aggs.lvl3.terms).toEqual({
      field:"lvl3", size:20
    })

  })

})
