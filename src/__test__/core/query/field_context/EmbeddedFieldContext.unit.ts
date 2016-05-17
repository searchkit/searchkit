import {
  EmbeddedFieldContext, FieldContextFactory
} from "../../../../"

describe("EmbeddedFieldContext", ()=> {

  beforeEach(()=> {
    this.fieldContext = FieldContextFactory({
      type:"embedded"
    })
  })

  it("should be instance of EmbeddedFieldContext", ()=> {
    expect(this.fieldContext).toEqual(jasmine.any(EmbeddedFieldContext))
  })

  it("getAggregationPath()", ()=> {
    expect(this.fieldContext.getAggregationPath())
      .toBe(undefined)
  })

  it("wrapAggregations()", ()=> {
    expect(this.fieldContext.wrapAggregations(1,2))
      .toEqual([1,2])
  })

  it("wrapFilter()", ()=> {
    expect(this.fieldContext.wrapFilter("aFilter"))
      .toBe("aFilter")

  })

})
