import {
  MatchQuery
} from "../../../../../"


describe("MatchQuery", ()=> {


  it("empty string empty field", ()=> {
    expect(MatchQuery("color", null)).toBe(undefined)
    expect(MatchQuery(null, "red")).toBe(undefined)
  })

  it("with string = options", ()=> {    
    expect(MatchQuery("color", "red yellow", {
      operator:"AND"
    })).toEqual({
      match:{
        color:{
          query:"red yellow",
          operator:"AND"
        }
      }
    })
  })


})
