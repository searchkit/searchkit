import {
  SortingAccessor, ImmutableQuery, ValueState,
  SortingOptions
} from "../../../"

describe("SortingAccessor", ()=> {

  beforeEach(()=> {
    this.options = {
      options:[
        {label:"None"},
        {
          label:"Highest Price",
          field:'price',
          order:'desc'
        },
        {
          label:"Lowest Price",
          field:'price',
          key:"cheap"
        }
      ]
    }

    this.accessor = new SortingAccessor(
      "sort", this.options)

  })

  it("constructor()", ()=> {
    expect(this.accessor.key).toBe("sort")
    expect(this.accessor.options).toBe(this.options)
    expect(this.options.options).toEqual([
      {label: 'None', key: 'none'},
      {label: 'Highest Price', field: 'price', order: 'desc', key: 'price_desc'},
      {label: 'Lowest Price', field: 'price', key: 'cheap'}
    ])
  })

  it("buildOwnQuery()", ()=> {
    this.accessor.state = new ValueState("cheap")
    let query = new ImmutableQuery()
    let priceQuery = this.accessor.buildOwnQuery(query)
    expect(priceQuery.query.sort).toEqual(['price'])
    this.accessor.state = this.accessor.state.clear()
    query = this.accessor.buildOwnQuery(query)
    expect(query.query.sort).toEqual(undefined)

    this.options.options[1].defaultOption = true
    query = this.accessor.buildOwnQuery(query)
    expect(query.query.sort).toEqual([{'price':'desc'}])

    // handle no options
    this.accessor.options.options = []
    query = this.accessor.buildOwnQuery(new ImmutableQuery())
    expect(query.query.sort).toEqual(undefined)
  })


})
