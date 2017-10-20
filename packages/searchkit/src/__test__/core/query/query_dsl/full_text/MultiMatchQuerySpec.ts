import {
  MultiMatchQuery
} from "../../../../../"


describe("MultiMatchQuery", ()=> {


  it("empty string", ()=> {
    expect(MultiMatchQuery("", {
      fields:["title"]
    })).toBe(undefined)
  })

  it("with string + options", ()=> {
    let query = MultiMatchQuery("foo", {
      type:"phrase_prefix",
      fields:["title"]
    })
    expect(query).toEqual({
      multi_match:{
        query:"foo",
        type:"phrase_prefix",
        fields:["title"]
      }
    })
  })


})
