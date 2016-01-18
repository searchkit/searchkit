import {
  MinMetric, CardinalityMetric, TopHitsMetric
} from "../../../../../"

describe("MetricAggregations", ()=> {

  beforeEach(()=> {

  })

  it("CardinalityMetric", ()=> {
    let aggs = CardinalityMetric("genre_count", "genres")
    expect(aggs).toEqual({
      genre_count:{
        cardinality:{
          field:"genres"
        }
      }
    })
  })

  it("MinMetric", ()=> {
    let aggs = MinMetric("min_price", "prices")
    expect(aggs).toEqual({
      min_price:{
        min:{
          field:"prices"
        }
      }
    })

  })

  it("TopHitsMetric", ()=> {
    expect(TopHitsMetric("sometophits", {
      size:1, _source:false
    })).toEqual({
      sometophits:{
        top_hits:{
          size:1, _source:false
        }
      }
    })

  })


})
