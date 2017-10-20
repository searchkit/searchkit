import {
  SimpleQueryString
} from "../../../../../"


describe("SimpleQueryString", ()=> {


  it("empty string", ()=> {
    expect(SimpleQueryString("")).toBe(undefined)
  })

  it("with string + options", ()=> {
    let sqs = SimpleQueryString("foo", {
      analyzer:"english",
      fields:["title"]
    })
    expect(sqs).toEqual({
      simple_query_string:{
        query:"foo",
        analyzer:"english",
        fields:["title"]
      }
    })
  })


})
