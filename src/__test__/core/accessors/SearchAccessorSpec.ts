import {
  SearchAccessor, ImmutableQuery, MatchPhrasePrefix,
  SimpleQueryString, ValueState, BoolShould
} from "../../../"

describe("SearchAccessor", ()=> {

  beforeEach(()=> {
    this.accessor = new SearchAccessor("q", {
      prefixQueryFields:["title^10", "keywords"]
    })
  })

  it("buildSharedQuery()", ()=> {
    let query = new ImmutableQuery()
    this.accessor.state = new ValueState("some query")
    query = this.accessor.buildSharedQuery(query)
    expect(query.query.query.$array).toEqual([
      BoolShould([
        MatchPhrasePrefix("some query", "title^10"),
        MatchPhrasePrefix("some query", "keywords"),
        SimpleQueryString("some query")
      ])
    ])
  })

  it("buildSharedQuery() - empty query", ()=> {
    this.accessor.state = new ValueState("")
    let query = new ImmutableQuery()
    let newQuery = this.accessor.buildSharedQuery(query)
    expect(newQuery).toBe(query)
  })

})
