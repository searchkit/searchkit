import {
  NestedFieldContext, FieldContextFactory,
  TermsBucket, NestedBucket, TermQuery, NestedQuery
} from "../../../../"

describe("NestedFieldContext", ()=> {

  beforeEach(()=> {
    this.fieldContext = FieldContextFactory({
      type:"nested",
      options:{
        path:"tags",
        score_mode:"sum"
      }
    })
  })

  it("should be instance of NestedFieldContext", ()=> {
    expect(this.fieldContext).toEqual(jasmine.any(NestedFieldContext))
  })

  it("should validate missing path", ()=> {
    expect(()=> {
      return FieldContextFactory({type:"nested"})
    }).toThrowError("fieldOptions type:nested requires options.path")

  })

  it("getAggregationPath()", ()=> {
    expect(this.fieldContext.getAggregationPath())
      .toBe("inner")
  })

  it("wrapAggregations()", ()=> {
    let agg1 = TermsBucket("terms", "name")
    let agg2 = TermsBucket("terms", "color")
    expect(this.fieldContext.wrapAggregations(agg1, agg2))
      .toEqual([NestedBucket(
        "inner", "tags", agg1, agg2
      )])
  })

  it("wrapFilter()", ()=> {
    let termFilter = TermQuery("color", "red")
    expect(this.fieldContext.wrapFilter(termFilter))
      .toEqual(NestedQuery("tags", termFilter, {score_mode:'sum'}))

  })

})
