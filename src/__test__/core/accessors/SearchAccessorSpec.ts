import {
  SearchAccessor, ImmutableQuery,
  SimpleQueryString, ValueState
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
      SimpleQueryString("some query")
    ])
  })

})
