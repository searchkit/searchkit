import {
  NumericOptionsAccessor, ImmutableQuery,
  BoolMust, BoolShould, ValueState, RangeQuery,
  RangeBucket, FilterBucket
} from "../../../"

const _ = require("lodash")

describe("NumericOptionsAccessor", ()=> {

  beforeEach(()=> {
    this.options = {
      field:"price",
      id:"price_id",
      title:"”Price",
      options:[
        {title:"Cheap", from:1, to:11},
        {title:"Affordable", from:11, to:21},
        {title:"Pricey", from:21, to:101}
      ]
    }
    this.accessor = new NumericOptionsAccessor("categories", this.options)
    this.accessor.uuid = "9999"
    this.query = new ImmutableQuery()
    this.toPlainObject = (ob)=> {
      return JSON.parse(JSON.stringify(ob))
    }
  })

  it("constructor()", ()=> {
    expect(this.accessor.key).toBe("categories")
    expect(this.accessor.options).toBe(this.options)
  })

  it("getBuckets()", ()=> {
    this.accessor.results = {
      aggregations:{
        categories:{
          categories:{
            buckets:[
              {key:1, doc_count:1},
              {key:2, doc_count:2},
              {key:3, doc_count:3},
              {key:4, doc_count:0}
            ]
          }
        }
      }
    }
    expect(_.map(this.accessor.getBuckets(), "key"))
      .toEqual([1,2,3])
  })
  it("getRanges()", ()=> {
    expect(this.accessor.getRanges()).toEqual([
      {key: 'Cheap', from: 1, to: 11},
      {key: 'Affordable', from: 11, to: 21},
      {key: 'Pricey', from: 21, to: 101}
    ])
  })

  it("buildSharedQuery()", ()=> {
    this.accessor.state = new ValueState("Affordable")
    let query = this.accessor.buildSharedQuery(this.query)
    let expected = BoolMust([
      BoolMust([
        RangeQuery("price", {gte:11, lt:21})
      ])
    ])
    expect(query.query.filter).toEqual(expected)
    expect(_.keys(query.index.filtersMap))
      .toEqual(["9999"])

    let selectedFilters = query.getSelectedFilters()
    expect(selectedFilters.length).toEqual(1)
    expect(this.toPlainObject(selectedFilters[0])).toEqual({
      name: '”Price', value: 'Affordable', id: 'price_id',
    })
    expect(this.accessor.state.getValue()).toEqual("Affordable")
    selectedFilters[0].remove()
    expect(this.accessor.state.getValue()).toEqual(null)
  })


  it("buildOwnQuery()", ()=> {
    this.query = this.query.addFilter("other", BoolShould(["foo"]))
    let query = this.accessor.buildSharedQuery(this.query)
    query = this.accessor.buildOwnQuery(query)
    expect(query.query.aggs).toEqual(
      FilterBucket(
        "categories",
        BoolMust([BoolShould(["foo"])]),
        RangeBucket(
          "categories",
          "price",
          [
            {
              "key": "Cheap",
              "from": 1,
              "to": 11
            },
            {
              "key": "Affordable",
              "from": 11,
              "to": 21
            },
            {
              "key": "Pricey",
              "from": 21,
              "to": 101
            }
          ]
        )
      )
    )

  })

})
