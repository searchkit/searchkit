import {
  MinMetric, CardinalityMetric
} from "../../../../"

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


})
