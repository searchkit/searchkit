import {
  SearchAccessor, ImmutableQuery,
  SimpleQueryString, ValueState, BoolShould
} from "../../../"

describe("SearchAccessor", ()=> {

  beforeEach(()=> {
    this.accessor = new SearchAccessor("q")
  })

  it("buildSharedQuery()", ()=> {
    let query = new ImmutableQuery()
    this.accessor.state = new ValueState("some query")
    query = this.accessor.buildSharedQuery(query)
    expect(query.query.query.$array).toEqual([
      BoolShould([SimpleQueryString("some query")])
    ])
  })

})
