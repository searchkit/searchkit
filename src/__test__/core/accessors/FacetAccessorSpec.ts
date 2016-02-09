import {
  FacetAccessor, ImmutableQuery,Utils,
  BoolMust, BoolShould, ArrayState, TermQuery,
  FilterBucket, TermsBucket, CardinalityMetric
} from "../../../"


describe("FacetAccessor", ()=> {

  beforeEach(()=> {
    Utils.guidCounter = 0
    this.options = {
      operator:"OR",
      title:"Genres",
      id:"GenreId",
      size:20,
      orderKey:"_term",
      orderDirection:"asc",
      translations:{
        "facets.view_more":"View more genres"
      }
    }
    this.accessor = new FacetAccessor("genre", this.options)
  })

  it("constructor()", ()=> {
    expect(this.accessor.options).toBe(this.options)
    expect(this.accessor.urlKey).toBe("GenreId")
    expect(this.accessor.key).toBe("genre")
  })

  it("getBuckets()", ()=> {
    expect(this.accessor.getBuckets()).toEqual([])
    this.accessor.results = {
      aggregations:{
        genre1:{
          genre:{buckets:[1,2]}
        }
      }
    }
    expect(this.accessor.getBuckets())
      .toEqual([1,2])
  })

  it("getCount()", ()=> {
    expect(this.accessor.getCount()).toEqual(0)
    this.accessor.results = {
      aggregations:{
        genre1:{
          genre_count:{
            value:99
          }
        }
      }
    }
    expect(this.accessor.getCount())
      .toEqual(99)
  })

  it("isOrOperator()", ()=> {
    expect(this.accessor.isOrOperator())
      .toBe(true)
    this.options.operator = "AND"
    expect(this.accessor.isOrOperator())
      .toBe(false)
  })

  it("getBoolBuilder()", ()=> {
    expect(this.accessor.getBoolBuilder())
      .toBe(BoolShould)
    this.options.operator = "AND"
    expect(this.accessor.getBoolBuilder())
      .toBe(BoolMust)
  })

  describe("view more options", () => {

    it("setViewMoreOption", () => {
      this.accessor.setViewMoreOption({size:30})
      expect(this.accessor.size).toBe(30)
    })

    it("getMoreSizeOption - view more", () => {
      this.accessor.getCount = () => {
        return 100
      }
      expect(this.accessor.getMoreSizeOption()).toEqual({size:70, label:"View more genres"})
    })

    it("getMoreSizeOption - view all", () => {
      this.accessor.getCount = () => {
        return 30
      }
      expect(this.accessor.getMoreSizeOption()).toEqual({size:30, label:"View all"})
    })

    it("getMoreSizeOption - view less", () => {
      this.accessor.getCount = () => {
        return 30
      }
      this.accessor.size = 30
      expect(this.accessor.getMoreSizeOption()).toEqual({size:20, label:"View less"})
    })

    it("getMoreSizeOption - no option", () => {
      this.accessor.getCount = () => {
        return 15
      }
      this.accessor.size = 20
      expect(this.accessor.getMoreSizeOption()).toEqual(null)
    })
  })

  describe("buildSharedQuery", ()=> {
    beforeEach(()=> {
      this.accessor.translate = (key)=> {
        return {
          "1":"Games", "2":"Action",
          "3":"Comedy", "4":"Horror"
        }[key]
      }
      this.toPlainObject = (ob)=> {
        return JSON.parse(JSON.stringify(ob))
      }
      this.accessor.state = new ArrayState([
        "1", "2"
      ])
      this.query = new ImmutableQuery()
    })

    it("filter test", ()=> {
      this.query = this.accessor.buildSharedQuery(this.query)
      let filters = this.query.getFilters().bool.should
      expect(this.toPlainObject(filters)).toEqual([
        {
          "term": {
            "genre": "1"
          }
        },
        {
          "term": {
            "genre": "2"
          }
        }
      ])
      let selectedFilters = this.query.getSelectedFilters()
      expect(selectedFilters.length).toEqual(2)
      //
      expect(this.accessor.state.getValue()).toEqual(["1","2"])
      selectedFilters[0].remove()
      expect(this.accessor.state.getValue()).toEqual(["2"])
      selectedFilters[1].remove()
      expect(this.accessor.state.getValue()).toEqual([])
    })

    it("AND filter", ()=> {
      this.options.operator = "AND"
      this.query = this.accessor.buildSharedQuery(this.query)
      expect(this.query.getFilters().bool.should).toBeFalsy()
      expect(this.query.getFilters().bool.must).toBeTruthy()
    })

    it("Empty state", ()=> {
      this.accessor.state = new ArrayState([])
      let query = this.accessor.buildSharedQuery(this.query)
      expect(query).toBe(this.query)
    })

  })

  describe("buildOwnQuery", ()=> {

    beforeEach(()=> {

      this.accessor.state = new ArrayState([
        "1", "2"
      ])
      this.query = new ImmutableQuery()
        .addFilter("rating_uuid", BoolShould(["PG"]))
      this.query = this.accessor.buildSharedQuery(this.query)
    })

    it("build own query - or", ()=> {
      let query = this.accessor.buildOwnQuery(this.query)
      expect(query.query.aggs).toEqual(
        FilterBucket("genre1",
          BoolMust([
            BoolShould(["PG"])
          ]),
          TermsBucket("genre", "genre", {size:20, order:{_term:"asc"}}),
          CardinalityMetric("genre_count", "genre")
        )
      )
    })

    it("build own query - and", ()=> {
      this.options.operator = "AND"
      let query = this.accessor.buildOwnQuery(this.query)
      expect(query.query.aggs).toEqual(
        FilterBucket("genre1",
          BoolMust([
            BoolShould(["PG"]),
            BoolShould([
              TermQuery("genre", "1"),
              TermQuery("genre", "2")
            ])
          ]),
          TermsBucket("genre", "genre", {size:20, order:{_term:"asc"}}),
          CardinalityMetric("genre_count", "genre")
        )
      )
    })

    it("build own query - include/exclude", ()=> {
      this.options.operator = "AND"
      this.options.include = ["one", "two"]
      this.options.exclude = ["three"]
      let query = this.accessor.buildOwnQuery(this.query)
      expect(query.query.aggs).toEqual(
        FilterBucket("genre1",
          BoolMust([
            BoolShould(["PG"]),
            BoolShould([
              TermQuery("genre", "1"),
              TermQuery("genre", "2")
            ])
          ]),
          TermsBucket("genre", "genre", {
            size:20,
            include: ["one", "two"],
            exclude: ["three"],
            order:{_term:"asc"}
          }),
          CardinalityMetric("genre_count", "genre")
        )
      )
    })


  })


})
