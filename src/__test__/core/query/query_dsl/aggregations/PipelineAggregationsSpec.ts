import {
  AvgBucketPipeline
} from "../../../../../"

describe("PipelineAggregations", ()=> {

  it("AvgBucketPipeline", ()=> {
    let aggs = AvgBucketPipeline("avg_prices", "houses>price")
    expect(aggs).toEqual({
      avg_prices:{
        buckets_path: 'houses>price'
      }
    })
  })


})
