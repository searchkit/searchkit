import {
  BoolMust, BoolMustNot,BoolShould,
  SimpleQueryString,
  Term, Terms
} from "../../../"

describe("QueryBuilders", ()=> {

  it("BoolMust", ()=> {
    expect(BoolMust([1,2])).toEqual({
      bool:{must:[1,2]},
      $array:[1,2]
    })
  })

  it("BoolMustNot", ()=> {
    expect(BoolMustNot([1,2])).toEqual({
      bool:{must_not:[1,2]},
      $array:[1,2]
    })
  })

  it("BoolShould", ()=> {
    expect(BoolShould([1,2])).toEqual({
      bool:{should:[1,2]},
      $array:[1,2]
    })
  })

  it("SimpleQueryString", ()=> {
    expect(SimpleQueryString("")).toEqual(undefined)
    expect(SimpleQueryString("foo", {size:10})).toEqual({
      simple_query_string: {size: 10, query: 'foo'}
    })
  })

  it("Term", ()=> {
    expect(Term("genre", "games")).toEqual({
      term:{
        genre:'games'
      },
      $disabled:true
    })
    const options = {
      $name:"Genre", $value:"Games",
      $id:"1", $disabled:false
    }
    expect(Term("genre", "games", options)).toEqual({
      term:{
        genre:'games'
      },
      $disabled:false,
      $name:"Genre",
      $value:"Games",
      $id:"1"
    })
  })

  it("Terms", ()=> {
    expect(Terms("games", {size:50})).toEqual({
      terms:{field:'games', size:50}
    })
  })

})
