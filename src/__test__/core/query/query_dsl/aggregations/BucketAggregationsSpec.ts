import {
  AggsContainer,
  TermsBucket, RangeBucket,
  ChildrenBucket, FilterBucket,
  NestedBucket,SignificantTermsBucket,
  GeohashBucket, HistogramBucket
} from "../../../../../"
import * as _ from "lodash"

describe("BucketAggregations", ()=> {

  beforeEach(()=>{
    this.childBucket = AggsContainer("child", {name:"child"})
    this.log = (ob)=> console.log(JSON.stringify(ob,null, 2))
    this.aggsKey = "aggsKey"
    this.expectAggs = (ob)=> {
      expect(this.aggs).toEqual({
        "aggsKey":_.assign(ob, {aggs:this.childBucket})
      })
    }
  })

  it("TermsBucket", ()=> {
    this.aggs = TermsBucket(
      this.aggsKey, "genres",
      {size:10, min_doc_count:0, include:"bmw", exclude:"audi"}, this.childBucket)
    this.expectAggs({
      terms:{
        field:"genres",
        size:10, min_doc_count:0,
        include:"bmw", exclude:"audi"
      }
    })
  })
  it("RangeBucket", ()=> {
    this.aggs = RangeBucket(
      this.aggsKey, "prices",
      [1,2,3], this.childBucket)
    this.expectAggs({
      range:{
        field:"prices", ranges:[1,2,3]
      }
    })
  })

  it("ChildrenBucket", ()=> {
    this.aggs = ChildrenBucket(
      this.aggsKey, "tags",
      this.childBucket
    )
    this.expectAggs({children:{type:"tags"}})
  })

  it("FilterBucket", ()=> {
    this.aggs = FilterBucket(
      this.aggsKey, "somefilter",
      this.childBucket
    )
    this.expectAggs({filter:"somefilter"})
  })

  it("NestedBucket", ()=> {
    this.aggs = NestedBucket(
      this.aggsKey, "tags",
      this.childBucket
    )
    this.expectAggs({nested:{path:"tags"}})
  })

  it("SignificantTermsBucket", ()=> {
    expect(SignificantTermsBucket(this.aggsKey, "crime_type")).toEqual({
      [this.aggsKey]:{
        significant_terms:{field:"crime_type"}
      }
    })
    this.aggs = SignificantTermsBucket(
      this.aggsKey, "crime_type",
      {size:10},
      this.childBucket
    )
    this.expectAggs({
      significant_terms:{field:"crime_type", size:10}})
  })

  it("GeohashBucket", ()=> {
    this.aggs = GeohashBucket(
      this.aggsKey, "location",
      {precision:5},
      this.childBucket
    )
    this.expectAggs({geohash_grid:{field:"location", precision:5}})
  })

  it("HistogramBucket", ()=> {
    expect(HistogramBucket(this.aggsKey, "price")).toEqual({
      [this.aggsKey]:{
        histogram:{field:"price"}
      }
    })
    this.aggs = HistogramBucket(
      this.aggsKey, "price",
      {interval:1},
      this.childBucket
    )
    this.expectAggs({histogram:{field:"price", interval:1}})
  })

})
