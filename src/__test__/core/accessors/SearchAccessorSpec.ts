import {
  SearchAccessor, ImmutableQuery, MatchPhrasePrefix,
  SimpleQueryString, ValueState, BoolShould, BoolMust

} from "../../../"

describe("SearchAccessor", ()=> {

  describe("prefix", () => {

    beforeEach(()=> {
      this.accessor = new SearchAccessor("q", {
        queryFields:["title^10", "keywords"],
        prefixQueryFields:["title^10", "keywords"]
      })
    })

    it("buildSharedQuery()", ()=> {
      let query = new ImmutableQuery()
      this.accessor.state = new ValueState("some query")
      query = this.accessor.buildSharedQuery(query)
      expect(query.query.query).toEqual(
        BoolMust([
          BoolShould([
            BoolShould([
              MatchPhrasePrefix("some query", "title^10"),
              MatchPhrasePrefix("some query", "keywords")
            ]),
            SimpleQueryString("some query", {fields:["title^10", "keywords"]})
          ])
        ])
      )
    })

    it("buildSharedQuery() - empty query", ()=> {
      this.accessor.state = new ValueState("")
      let query = new ImmutableQuery()
      let newQuery = this.accessor.buildSharedQuery(query)
      expect(newQuery).toBe(query)
    })

  })

  describe("queryOptions", () => {
    it("extend options", () => {
      this.accessor = new SearchAccessor("q", {
        queryFields:["_all"],
        queryOptions: {
          type:"best_fields",
          x:"y"
        }
      })

      let query = new ImmutableQuery()
      this.accessor.state = new ValueState("some query")
      query = this.accessor.buildSharedQuery(query)
      expect(query.query.query).toEqual(
        BoolMust([
          BoolShould([
            SimpleQueryString("some query", {fields:["_all"], type:"best_fields", x:"y"})
          ])
        ])
      )
    })
  })

  describe("queryFields", () => {

    beforeEach(() => {
      this.createAccessor = (fields) => {
        this.accessor = new SearchAccessor("q", {
          queryFields:fields
        })
      }
    })

    it("queryFields specified", () => {

      this.createAccessor(["title^10", "_all"])

      let query = new ImmutableQuery()
      this.accessor.state = new ValueState("some query")
      query = this.accessor.buildSharedQuery(query)
      expect(query.query.query).toEqual(BoolMust([
        BoolShould([
          SimpleQueryString("some query", {fields:["title^10", "_all"]})
        ])
      ]))

    })

    it("queryFields not specified", () => {

      this.createAccessor(null)

      let query = new ImmutableQuery()
      this.accessor.state = new ValueState("some query")
      query = this.accessor.buildSharedQuery(query)
      expect(query.query.query).toEqual(BoolMust([
        BoolShould([
          SimpleQueryString("some query", {fields:["_all"]})
        ])
      ]))

    })

  })

})
