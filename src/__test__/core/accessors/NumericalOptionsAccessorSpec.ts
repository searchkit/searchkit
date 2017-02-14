import {
  NumericOptionsAccessor, ImmutableQuery,
  BoolMust, BoolShould, ArrayState, RangeQuery,
  CardinalityMetric, NestedQuery,NestedBucket,
  RangeBucket, FilterBucket,SearchkitManager, Utils
} from "../../../"

import * as _ from "lodash"

describe("NumericOptionsAccessor", ()=> {

  beforeEach(()=> {
    this.searchkit = SearchkitManager.mock()
    this.options = {
      field:"price",
      id:"price_id",
      title:"”Price",
      options:[
        {title:"All"},
        {title:"Cheap", from:1, to:11},
        {title:"Affordable", from:11, to:21},
        {title:"Pricey", from:21, to:101}
      ]
    }
    this.accessor = new NumericOptionsAccessor("categories", this.options)
    this.accessor.uuid = "9999"
    this.searchkit.addAccessor(this.accessor)
    spyOn(this.searchkit, "performSearch")
    this.query = new ImmutableQuery()
    this.toPlainObject = (ob)=> {
      return JSON.parse(JSON.stringify(ob))
    }
  })

  it("constructor()", ()=> {
    expect(this.accessor.key).toBe("categories")
    expect(this.accessor.options.options).toEqual([
      {title: 'All', key: 'all'},
      {title: 'Cheap', from: 1, to: 11, key: '1_11'},
      {title: 'Affordable', from: 11, to: 21, key: '11_21'},
      {title: 'Pricey', from: 21, to: 101, key: '21_101'}
    ])
  })

  it("getBuckets()", ()=> {
    this.accessor.results = {
      aggregations:{
        "9999":{
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

  it("getDefaultOption()", ()=> {
    expect(this.accessor.getDefaultOption()).toEqual(this.options.options[0])
  })

  it("getSelectedOptions(), getSelectedOrDefaultOptions()", ()=> {
    expect(this.accessor.getSelectedOptions()).toEqual([])
    expect(this.accessor.getSelectedOrDefaultOptions())
      .toEqual([this.options.options[0]])
    this.accessor.state = new ArrayState(["all", "21_101"])
    let expectedSelected = [
      this.options.options[0],
      this.options.options[3]
    ]
    expect(this.accessor.getSelectedOptions()).toEqual(expectedSelected)
    this.accessor.state = new ArrayState([])

    // test no default code path
    this.options.options[0].from = 10
    expect(this.accessor.getSelectedOrDefaultOptions()).toEqual([])

  })

  it("setOptions()", ()=> {
    expect(this.accessor.state.getValue()).toEqual([])
    this.accessor.setOptions(["Affordable", "Pricey"])
    expect(this.accessor.state.getValue()).toEqual(["11_21", "21_101"])
    expect(this.searchkit.performSearch).toHaveBeenCalled()
  })

  it("setOption(), single key", ()=> {
    expect(this.accessor.state.getValue()).toEqual([])
    this.accessor.setOptions(["Affordable"])
    expect(this.accessor.state.getValue()).toEqual(["11_21"])
    expect(this.searchkit.performSearch).toHaveBeenCalled()
    this.accessor.setOptions(["All"])
    expect(this.accessor.state.getValue()).toEqual([])
  })

  describe("toggleOption()", ()=> {

    it("no option found", ()=> {
      this.accessor.toggleOption("none")
      expect(this.searchkit.performSearch).not.toHaveBeenCalled()
      expect(this.accessor.state.getValue()).toEqual([])
    })

    it("defaultOption", ()=> {
      this.accessor.toggleOption("All")
      expect(this.searchkit.performSearch).toHaveBeenCalled()
      expect(this.accessor.state.getValue()).toEqual([])
    })

    it("multiple select", ()=> {
      this.options.multiselect = true
      this.accessor.state = new ArrayState(["21_101"])
      this.accessor.toggleOption("Affordable")
      expect(this.searchkit.performSearch).toHaveBeenCalled()
      expect(this.accessor.state.getValue()).toEqual(["21_101", "11_21"])
    })

    it("single select", ()=> {
      this.options.multiselect = false
      this.accessor.state = new ArrayState(["21_101"])
      this.accessor.toggleOption("Affordable")
      expect(this.searchkit.performSearch).toHaveBeenCalled()
      expect(this.accessor.state.getValue()).toEqual(["11_21"])
    })
  })

  it("getRanges()", ()=> {
    expect(this.accessor.getRanges()).toEqual([
      {key: 'All'},
      {key: 'Cheap', from: 1, to: 11},
      {key: 'Affordable', from: 11, to: 21},
      {key: 'Pricey', from: 21, to: 101}
    ])
  })

  it("buildSharedQuery()", ()=> {
    this.accessor.state = new ArrayState(["11_21", "21_101"])
    let query = this.accessor.buildSharedQuery(this.query)
    let expected = BoolMust([
      BoolShould([
        RangeQuery("price", {gte:11, lt:21}),
        RangeQuery("price", {gte:21, lt:101})
      ])
    ])
    expect(query.query.post_filter).toEqual(expected)
    expect(_.keys(query.index.filtersMap))
      .toEqual(["9999"])

    let selectedFilters = query.getSelectedFilters()
    expect(selectedFilters.length).toEqual(2)
    expect(this.toPlainObject(selectedFilters[0])).toEqual({
      name: '”Price', value: 'Affordable', id: 'price_id',
    })
    expect(this.toPlainObject(selectedFilters[1])).toEqual({
      name: '”Price', value: 'Pricey', id: 'price_id',
    })
    expect(this.accessor.state.getValue()).toEqual(["11_21", "21_101"])
    selectedFilters[0].remove()
    expect(this.accessor.state.getValue()).toEqual(["21_101"])
  })


  it("buildOwnQuery()", ()=> {
    this.query = this.query.addFilter("other", BoolShould(["foo"]))
    let query = this.accessor.buildSharedQuery(this.query)
    query = this.accessor.buildOwnQuery(query)
    expect(query.query.aggs).toEqual(
      FilterBucket(
        "9999",
        BoolMust([BoolShould(["foo"])]),
        RangeBucket(
          "categories",
          "price",
          [
            {
              "key": "All"
            },
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

  describe("Nested usecase", ()=> {

    beforeEach(()=> {
      this.options = {
        field:"price",
        id:"price_id",
        title:"”Price",
        options:[
          {title:"All"},
          {title:"Cheap", from:1, to:11},
          {title:"Affordable", from:11, to:21},
          {title:"Pricey", from:21, to:101}
        ],
        fieldOptions:{
          type:"nested",
          options:{
            path:"nestedPrice"
          }
        }
      }
      this.accessor = new NumericOptionsAccessor("categories", this.options)
      this.accessor.uuid = "9999"
    })

    it("buildSharedQuery()", ()=> {
      this.accessor.state = new ArrayState(["11_21", "21_101"])
      let query = this.accessor.buildSharedQuery(this.query)
      let expected = BoolMust([
        BoolShould([
          NestedQuery("nestedPrice", RangeQuery("price", {gte:11, lt:21})),
          NestedQuery("nestedPrice", RangeQuery("price", {gte:21, lt:101}))
        ])
      ])
      expect(query.query.post_filter).toEqual(expected)
    })

    it("buildOwnQuery()", ()=> {
      this.query = this.query.addFilter("other", BoolShould(["foo"]))
      let query = this.accessor.buildSharedQuery(this.query)
      query = this.accessor.buildOwnQuery(query)
      expect(query.query.aggs).toEqual(
        FilterBucket(
          "9999",
          BoolMust([BoolShould(["foo"])]),
          NestedBucket(
            "inner", "nestedPrice",
            RangeBucket(
              "categories",
              "price",
              [
                {
                  "key": "All"
                },
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
      )
    })

    it("getBuckets()", ()=> {
      this.accessor.results = {
        aggregations:{
          "9999":{
            inner:{
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
      }
      expect(_.map(this.accessor.getBuckets(), "key"))
        .toEqual([1,2,3])
    })

  })

})
