import {
  FacetAccessor, ImmutableQuery,
  BoolMust, BoolShould, ArrayState, HierarchicalFacetAccessor,
  TermQuery, FilterBucket, TermsBucket
} from "../../../"
import * as _ from "lodash"


describe("HierarchicalFacetAccessor", ()=> {

  beforeEach(()=> {
    this.accessor = new HierarchicalFacetAccessor("categories", {
      fields:["lvl1", "lvl2", "lvl3"],
      id:"categories_id",
      title:"Categories",
      size:20,
      orderKey:"_term",
      orderDirection:"asc"
    })
    this.accessor.uuid = "999"
    this.accessor.computeUuids()
    this.query = new ImmutableQuery()
    this.toPlainObject = (ob)=> {
      return JSON.parse(JSON.stringify(ob))
    }
  })




  it("getBuckets()", ()=> {
    this.accessor.results = {
      aggregations:{
        categories_id:{
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
      .add(2, "lvl3val2")
    expect(this.accessor.state.getValue())
      .toEqual([["lvl1val"], ['lvl2val'], ["lvl3val", "lvl3val2"]])

    let query = this.accessor.buildSharedQuery(this.query)
    // console.log(JSON.stringify(query.query.post_filter, null, 2 ))

    expect(query.query.post_filter).toEqual(
      BoolMust([
        TermQuery("lvl1", "lvl1val"),
        TermQuery("lvl2", "lvl2val"),
        BoolShould([
          TermQuery("lvl3", "lvl3val"),
          TermQuery("lvl3", "lvl3val2")
        ])
      ])
    )

    let selectedFilters = query.getSelectedFilters()
    expect(this.toPlainObject(selectedFilters)).toEqual([
      {
        "id": "categories_id",
        "name": "lvl2val",
        "value": "lvl3val"
      },
      {
        "id": "categories_id",
        "name": "lvl2val",
        "value": "lvl3val2"
      }
    ])
    // console.log(JSON.stringify(selectedFilters, null, 2 ))
    selectedFilters[0].remove()
    expect(this.accessor.state.getValue())
      .toEqual([["lvl1val"], ['lvl2val'], ["lvl3val2"]])
    selectedFilters[1].remove()
    expect(this.accessor.state.getValue())
      .toEqual([["lvl1val"], ['lvl2val'], []])
  })


  it("buildOwnQuery()", ()=> {

    this.accessor.state = this.accessor.state
      .add(0, "lvl1val")
      .add(1, "lvl2val")
      .add(2, "lvl3val")
    this.query = this.query.addFilter("other", BoolShould(["foo"]))
    let query = this.accessor.buildSharedQuery(this.query)
    query = this.accessor.buildOwnQuery(query)
    expect(_.keys(query.index.filtersMap)).toEqual([
      'other', '999lvl1', '999lvl2', '999lvl3'
    ])

    let order = {_term:"asc"}
    // console.log(JSON.stringify(query.query.aggs, null, 2))
    var expected = FilterBucket(
      "categories_id", BoolMust([BoolShould(["foo"])]),
      FilterBucket(
        "lvl1",
        BoolMust([]),
        TermsBucket("lvl1", "lvl1", {size:20, order})
      ),
      FilterBucket(
        "lvl2",
        BoolMust([
          TermQuery("lvl1", "lvl1val")
        ]),
        TermsBucket("lvl2", "lvl2", {size:20,order})
      ),
      FilterBucket(
        "lvl3",
        BoolMust([
          TermQuery("lvl1", "lvl1val"),
          TermQuery("lvl2", "lvl2val")
        ]),
        TermsBucket("lvl3", "lvl3", {size:20, order})
      )
    )
    // console.log(JSON.stringify(expected, null, 2))
    expect(query.query.aggs).toEqual(expected)


  })

})
