import {
  SortingAccessor, ImmutableQuery, ValueState,
  Searcher, SortingOptions
} from "../../../"

describe("SortingAccessor", ()=> {

  beforeEach(()=> {
    this.options = {
      options:[
        {
          label:"Highest Price",
          field:'price',
          order:'desc'
        },
        {
          label:"Lowest Price",
          field:'price',
          order:'asc'
        }
      ]
    }

    this.accessor = new SortingAccessor(
      "sort", this.options)

  })

  it("constructor()", ()=> {
    expect(this.accessor.key).toBe("sort")
    expect(this.accessor.options).toBe(this.options)
  })

  it("buildOwnQuery()", ()=> {
    this.accessor.state = new ValueState("Lowest Price")
    let query = new ImmutableQuery()
    let priceQuery = this.accessor.buildOwnQuery(query)
    expect(priceQuery.query.sort).toEqual([{
      price:'asc'
    }])
    this.accessor.state = this.accessor.state.clear()
    let emptyQuery = this.accessor.buildOwnQuery(query)
    expect(emptyQuery.query.sort).toBe(undefined)

    expect(emptyQuery).toBe(query)
  })


})
