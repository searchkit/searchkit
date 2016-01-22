import {
  MinMetric, CardinalityMetric, TopHitsMetric,
  GeoBoundsMetric, MaxMetric, AvgMetric, SumMetric
} from "../../../../../"

describe("MetricAggregations", ()=> {

  beforeEach(()=> {
    this.testFieldMetric = (Metric, op)=>{
      let aggs = Metric("key", "field")
      expect(aggs).toEqual({
        key:{
          [op]:{field:"field"}
        }
      })
    }
  })

  it("CardinalityMetric", ()=> {
    this.testFieldMetric( CardinalityMetric, "cardinality" )
  })

  it("MinMetric", ()=> {
    this.testFieldMetric( MinMetric, "min" )
  })

  it("MaxMetric", ()=> {
    this.testFieldMetric( MaxMetric, "max" )
  })

  it("AvgMetric", ()=> {
    this.testFieldMetric( AvgMetric, "avg" )
  })

  it("SumMetric", ()=> {
    this.testFieldMetric( SumMetric, "sum" )
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

  it("GeoBoundsMetric", ()=> {
    expect(GeoBoundsMetric("bounds", "location"))
      .toEqual({
        bounds:{
          geo_bounds:{
            field:"location"
          }
        }
      })
    expect(GeoBoundsMetric(
      "bounds", "location",
      {wrap_longitude:true}
    )).toEqual({
      bounds:{
        geo_bounds:{
          field:"location",
          wrap_longitude:true
        }
      }
    })
  })


})
