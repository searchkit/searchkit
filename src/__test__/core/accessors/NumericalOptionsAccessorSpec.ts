import {
  NumericOptionsAccessor, ImmutableQuery, Searcher,
  BoolMust, BoolShould, ValueState
} from "../../../"
import * as _ from "lodash"

describe("NumericOptionsAccessor", ()=> {

  beforeEach(()=> {
    this.searcher = new Searcher(null)
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
    this.accessor.setSearcher(this.searcher)
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
    this.searcher.results = {
      aggregations:{
        categories:{
          categories:{
            buckets:[1,2,3,4]
          }
        }
      }
    }
    expect(this.accessor.getBuckets())
      .toEqual([1,2,3,4])
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
    let filters = query.query.filter.$array[0].$array
    expect(this.toPlainObject(filters)).toEqual([{
      "range": {
        "price": {
          "gte": 11,
          "lt": 21
        }
      },
      "$disabled": false,
      "$name": "”Price",
      "$value": "Affordable",
      "$id": "price_id"
    }])
    filters[0].$remove()
    expect(this.accessor.state.getValue()).toEqual(null)

    //test empty state yields same query
    let newQuery = this.accessor.buildSharedQuery(query)
    expect(newQuery).toBe(query)
  })


  it("buildOwnQuery()", ()=> {
    let query = this.accessor.buildOwnQuery(this.query)
    expect(query.getJSON().aggs).toEqual({
      "categories": {
        "filter": {
          "bool": {
            "must": []
          }
        },
        "aggs": {
          "categories": {
            "range": {
              "field": "price",
              "ranges": [
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
            }
          }
        }
      }
    })

  })

})
