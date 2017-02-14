import {
  DynamicRangeAccessor,
  ImmutableQuery,
  ObjectState,
  RangeQuery,
  BoolShould,
  FilterBucket,
  BoolMust,
  StatsMetric,
  NestedQuery,
  NestedBucket
} from "../../../"

describe("DynamicRangeAccessor", ()=> {

  beforeEach(()=> {
    this.accessor = new DynamicRangeAccessor("metascore", {
      title:"Metascore",
      id:"metascore",
      field:"metaScore"
    })
  })

  it("getStat()", ()=> {
    this.accessor.results = {
      aggregations:{
        metascore:{
          metascore:{
            min:0,
            max:100
          }
        }
      }
    }
    expect(this.accessor.getStat("max"))
      .toEqual(100)
    expect(this.accessor.getStat("dd"))
      .toEqual(0)
  })

  it("isDisabled()", () => {
    this.accessor.results = {
      aggregations:{
        metascore:{
          metascore:{
            min:0,
            max:100,
            count:100
          }
        }
      }
    }

    expect(this.accessor.isDisabled()).toEqual(false)

    this.accessor.results = {
      aggregations:{
        metascore:{
          metascore:{
            min:100,
            max:100,
            count:100
          }
        }
      }
    }

    expect(this.accessor.isDisabled()).toEqual(true)

    this.accessor.results = {
      aggregations:{
        metascore:{
          metascore:{
            min:0,
            max:0,
            count:0
          }
        }
      }
    }

    expect(this.accessor.isDisabled()).toEqual(true)

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
            BoolShould(["PG"])
          ]),
          StatsMetric("metascore", "metaScore")
        )
      )
    })

  })

  describe("Nested support", ()=> {

    beforeEach(()=> {
      this.accessor = new DynamicRangeAccessor("metascore", {
        title:"Metascore",
        id:"metascore",
        field:"metaScore",
        fieldOptions:{
          type:'nested',
          options:{path:"nestedField"}
        }
      })
    })

    it("getStats()", ()=> {
      this.accessor.results = {
        aggregations:{
          metascore:{
            inner:{
              metascore:{
                min:0,
                max:100
              }
            }
          }
        }
      }
      expect(this.accessor.getStat("max"))
        .toEqual(100)
      expect(this.accessor.getStat("dd"))
        .toEqual(0)
    })

    it("buildSharedQuery()", ()=> {
      let query = new ImmutableQuery()
      this.accessor.state = new ObjectState({min:20, max:70})
      query = this.accessor.buildSharedQuery(query)
      expect(query.query.post_filter).toEqual(
        NestedQuery("nestedField",
          RangeQuery("metaScore", {gte:20, lte:70})
        )
      )
    })


    it("build own query", ()=> {
      this.accessor.state = new ObjectState({min:20, max:70})
      this.query = new ImmutableQuery()
      .addFilter("rating_uuid", BoolShould(["PG"]))
      this.query = this.accessor.buildSharedQuery(this.query)
      let query = this.accessor.buildOwnQuery(this.query)
      expect(query.query.aggs).toEqual(
        FilterBucket("metascore",
          BoolMust([
            BoolShould(["PG"])
          ]),
          NestedBucket("inner", "nestedField",
            StatsMetric("metascore", "metaScore")
          )
        )
      )
    })


  })

})
