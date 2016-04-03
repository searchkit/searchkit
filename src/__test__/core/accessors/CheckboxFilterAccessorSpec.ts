import {
  CheckboxFilterAccessor, ImmutableQuery,Utils,
  BoolMust, BoolShould, ArrayState, TermQuery,
  CardinalityMetric, FilterBucket
} from "../../../"


function toPlainObject(ob) {
  return JSON.parse(JSON.stringify(ob))
}

describe("CheckboxFilterAccessor", ()=> {

  beforeEach(()=> {
    Utils.guidCounter = 0
    this.options = {
      id: "movie-filter",
      filter: TermQuery("type", "movie"),
      title:"Type",
      label: "Movie"
    }
    this.accessor = new CheckboxFilterAccessor("movie-filter-key", this.options)
  })

  it("constructor()", ()=> {
    expect(this.accessor.options).toBe(this.options)
    expect(this.accessor.urlKey).toBe("movie-filter")
    expect(this.accessor.key).toBe("movie-filter-key")
  })

  it("getDocCount()", ()=> {
    expect(this.accessor.getDocCount()).toEqual(0)
    this.accessor.results = {
      aggregations:{
        "movie-filter-key1":{
          doc_count:50
        }
      }
    }
    expect(this.accessor.getDocCount())
      .toEqual(50)
  })

  it("buildSharedQuery", ()=> {
    let query = new ImmutableQuery()
    query = this.accessor.buildSharedQuery(query)
    let filters = query.getFilters()
    expect(toPlainObject(filters)).toEqual({})
    
    this.accessor.state = this.accessor.state.create(true)
    query = new ImmutableQuery()
    query = this.accessor.buildSharedQuery(query)
    filters = query.getFilters()
    expect(toPlainObject(filters)).toEqual({
      "term": {
        type: "movie"
      }
    })
    
    let selectedFilters = query.getSelectedFilters()
    expect(selectedFilters.length).toEqual(1)
    
    expect(this.accessor.state.getValue()).toEqual(true)
    selectedFilters[0].remove()
    expect(this.accessor.state.getValue()).toEqual(false)
  })

  it("buildOwnQuery", ()=> {
    let query = new ImmutableQuery()
    query = this.accessor.buildOwnQuery(query)
    expect(query.query.aggs).toEqual(
      FilterBucket("movie-filter-key1",
        TermQuery("type", "movie")
      )
    )
  })
})
