import {
  BoolMust, BoolMustNot, BoolShould
} from "../../../../../"

describe("BoolQueries", ()=> {

  beforeEach(()=> {
    this.testBool = (boolFn, operator)=> {
      expect(boolFn([])).toEqual({})
      expect(boolFn(["filter"])).toEqual("filter")
      expect(boolFn(["filter1", "filter2"])).toEqual({
        bool:{[operator]:["filter1", "filter2"]}
      })
    }
  })

  it("BoolMust", ()=> {
    this.testBool(BoolMust, "must")
  })
  it("BoolShould", ()=> {
    this.testBool(BoolShould, "should")
  })
  it("BoolMustNot", ()=> {
    this.testBool(BoolMustNot, "must_not")
  })

})
