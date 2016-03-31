import {
  QueryAccessor, ImmutableQuery, MatchPhrasePrefix,
  SimpleQueryString, ValueState, BoolShould, BoolMust,
  MultiMatchQuery,QueryString
} from "../../../"

describe("QueryAccessor", ()=> {

  describe("prefix", () => {

    beforeEach(()=> {
      this.accessor = new QueryAccessor("q", {
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
            SimpleQueryString("some query", {fields:["title^10", "keywords"]}),
            MultiMatchQuery("some query", {
              type:"phrase_prefix",
              fields:["title^10", "keywords"]
            })
          ])
        ])
      )
      expect(query.getQueryString()).toBe("some query")
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
      this.accessor = new QueryAccessor("q", {
        queryFields:["_all"],
        queryBuilder:QueryString,
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
            QueryString("some query", {fields:["_all"], type:"best_fields", x:"y"})
          ])
        ])
      )
    })
  })

  describe("queryFields", () => {

    beforeEach(() => {
      this.createAccessor = (fields) => {
        this.accessor = new QueryAccessor("q", {
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

  it("prefixQueryFields with options", ()=> {
    this.accessor = new QueryAccessor("q", {
      prefixQueryFields:["title"],
      prefixQueryOptions: {
        minimum_should_match:"50%"
      }
    })
    let query = new ImmutableQuery()
    this.accessor.state = new ValueState("some query")
    query = this.accessor.buildSharedQuery(query)
    expect(query.query.query).toEqual(BoolMust([
      BoolShould([
        SimpleQueryString("some query", {fields:["_all"]}),
        MultiMatchQuery("some query", {
          type:"phrase_prefix",
          fields:["title"],
          minimum_should_match:"50%"
        })
      ])
    ]))
  })

})
