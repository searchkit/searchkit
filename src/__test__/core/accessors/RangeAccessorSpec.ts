import {
  RangeAccessor,
  ImmutableQuery,
  ObjectState,
  RangeQuery,
  BoolShould,
  FilterBucket,
  BoolMust,
  HistogramBucket,
  CardinalityMetric,
  NestedQuery,
  NestedBucket
} from "../../../"

describe("RangeAccessor", ()=> {

  beforeEach(()=> {
    this.accessor = new RangeAccessor("metascore", {
      title:"Metascore",
      id:"metascore",
      min:0,
      max:100,
      field:"metaScore",
      loadHistogram:true
    })
  })

  it("getBuckets()", ()=> {
    expect(this.accessor.getBuckets()).toEqual([])
    this.accessor.results = {
      aggregations:{
        metascore:{
          metascore:{buckets:[1,2]}
        }
      }
    }
    expect(this.accessor.getBuckets())
      .toEqual([1,2])
  })

  it("isDisabled() - with histogram", () => {
    this.accessor.options.loadHistogram = true

    this.accessor.results = {
      aggregations:{
        metascore:{
          metascore:{buckets:[{key:1, doc_count:0}, {key:2, doc_count:0}]}
        }
      }
    }
    expect(this.accessor.isDisabled()).toEqual(true)

    this.accessor.results = {
      aggregations:{
        metascore:{
          metascore:{buckets:[{key:1, doc_count:0}, {key:2, doc_count:1}]}
        }
      }
    }
    expect(this.accessor.isDisabled()).toEqual(false)

  })

  it("isDisabled() - without histogram", () => {
    this.accessor.options.loadHistogram = false

    this.accessor.results = {
      aggregations:{
        metascore:{
          metascore:{value:0}
        }
      }
    }
    expect(this.accessor.isDisabled()).toEqual(true)

    this.accessor.results = {
      aggregations:{
        metascore:{
          metascore:{value:1}
        }
      }
    }
    expect(this.accessor.isDisabled()).toEqual(false)

  })

  describe("build query", () => {

    it("buildSharedQuery()", ()=> {
      let query = new ImmutableQuery()
      this.accessor.state = new ObjectState({min:20, max:70})
      query = this.accessor.buildSharedQuery(query)
      expect(query.query.post_filter).toEqual(RangeQuery("metaScore", {gte:20, lte:70}))
      let selectedFilter = query.getSelectedFilters()[0]
      expect(selectedFilter).toEqual(jasmine.objectContaining({
        name:"Metascore", value:"20 - 70", id:"metascore"
      }))
      selectedFilter.remove()
      expect(this.accessor.state.getValue()).toEqual({})
    })

    it("buildSharedQuery() - empty", ()=> {
      this.accessor.state = new ObjectState()
      let query = new ImmutableQuery()
      let newQuery = this.accessor.buildSharedQuery(query)
      expect(newQuery).toBe(query)
    })
  })

  describe("buildOwnQuery", ()=> {

    beforeEach(()=> {

      this.accessor.state = new ObjectState({min:20, max:70})
      this.query = new ImmutableQuery()
        .addFilter("rating_uuid", BoolShould(["PG"]))
      this.query = this.accessor.buildSharedQuery(this.query)
    })

    it("build own query", ()=> {
      let query = this.accessor.buildOwnQuery(this.query)
      expect(query.query.aggs).toEqual(
        FilterBucket("metascore",
          BoolMust([
            BoolMust([
              BoolShould(["PG"])
            ]),
            {range:{
              metaScore:{
                gte:0, lte:100
              }
            }}
          ]),
          HistogramBucket("metascore", "metaScore", {
            interval:5,
            min_doc_count:0,
            extended_bounds:{
              min:0,
              max:100
            }
          })
        )
      )
    })

    it("build own query loadBuckets:false", ()=> {
      this.accessor.options.loadHistogram = false
      let query = this.accessor.buildOwnQuery(this.query)
      // expect(query).toBe(this.query)
      expect(query.query.aggs).toEqual(
        FilterBucket("metascore",
          BoolMust([
            BoolMust([
              BoolShould(["PG"])
            ]),
            {range:{
              metaScore:{
                gte:0, lte:100
              }
            }}
          ]),
          CardinalityMetric("metascore", "metaScore")
        )
      )
    })

  })

  describe("Nested query usecase", ()=> {

    beforeEach(()=> {
      this.accessor = new RangeAccessor("metascore", {
        title:"Metascore",
        id:"metascore",
        min:0,
        max:100,
        field:"metaScore",
        loadHistogram:true,
        fieldOptions:{
          type:"nested",
          options:{
            path:"nestedField"
          }
        }
      })
    })

    it("buildSharedQuery()", ()=> {
      let query = new ImmutableQuery()
      this.accessor.state = new ObjectState({min:20, max:70})
      query = this.accessor.buildSharedQuery(query)
      expect(query.query.post_filter).toEqual(NestedQuery(
        "nestedField",
        RangeQuery("metaScore", {gte:20, lte:70})
      ))
      let selectedFilter = query.getSelectedFilters()[0]
      expect(selectedFilter).toEqual(jasmine.objectContaining({
        name:"Metascore", value:"20 - 70", id:"metascore"
      }))
      selectedFilter.remove()
      expect(this.accessor.state.getValue()).toEqual({})
    })

    it("build own query", ()=> {
      let query = this.accessor.buildOwnQuery(this.query)
      expect(query.query.aggs).toEqual(
        FilterBucket("metascore",
          BoolMust([
            BoolMust([
              BoolShould(["PG"])
            ]),
            NestedQuery(
              "nestedField",
              {range:{
                metaScore:{
                  gte:0, lte:100
                }
              }}
            )            
          ]),
          NestedBucket(
            "inner",
            "nestedField",
            HistogramBucket("metascore", "metaScore", {
              interval:5,
              min_doc_count:0,
              extended_bounds:{
                min:0,
                max:100
              }
            })

          )
        )
      )
    })

    it("getBuckets()", ()=> {
      expect(this.accessor.getBuckets()).toEqual([])
      this.accessor.results = {
        aggregations:{
          metascore:{
            inner:{
              metascore:{buckets:[1,2]}
            }
          }
        }
      }
      expect(this.accessor.getBuckets())
        .toEqual([1,2])
    })


  })

})
