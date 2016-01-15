import {
  NoFiltersHitCountAccessor,
  ImmutableQuery,
  TopHitsMetric
} from "../../../"

describe("NoFiltersHitCountAccessor", ()=> {

  beforeEach(()=> {
    this.accessor = new NoFiltersHitCountAccessor()
  })

  it("getCount()", ()=> {
    this.accessor.results = {
      aggregations:{
        "no_filters_top_hits":{
          hits:{
            total:2,
            hits:[1,2]
          }
        }
      }
    }
    expect(this.accessor.getCount()).toBe(2)
  })

  it("buildOwnQuery()", ()=> {
    let query = this.accessor.buildOwnQuery(new ImmutableQuery())
    expect(query.query.aggs)
      .toEqual(TopHitsMetric(
        "no_filters_top_hits",
        { size:1, _source:false }
      ))
  })

})
