import {
  SuggestionsAccessor,
  SearchkitManager,
  ImmutableQuery
} from "../../../"

describe("SuggestionsAccessor", ()=> {

  beforeEach(()=> {
    this.searchkit = SearchkitManager.mock()
    this.accessor = new SuggestionsAccessor("title")
    this.searchkit.addAccessor(this.accessor)
  })

  it("getSuggestion()", ()=> {
    this.searchkit.setResults({
      "suggest":{
        "suggestions":[
          {
            options:[
              {text:"Some Suggestion"}
            ]
          }
        ]

      }
    })
    expect(this.accessor.getSuggestion())
      .toBe("Some Suggestion")
  })

  it("buildOwnQuery() - query too short", ()=> {
    let query = new ImmutableQuery()
    query = query.setQueryString("ab")
    let newQuery = this.accessor.buildOwnQuery(query)
    expect(newQuery).toBe(query)
  })

  it("buildOwnQuery() -  with query ", ()=> {
    let query = new ImmutableQuery().setQueryString("hello")
    let newQuery = this.accessor.buildOwnQuery(query)
    expect(newQuery).not.toBe(query)
    expect(newQuery.query.suggest.text)
      .toBe("hello")
    expect(newQuery.query.suggest.suggestions.phrase.field)
      .toBe("title")
  })


})
