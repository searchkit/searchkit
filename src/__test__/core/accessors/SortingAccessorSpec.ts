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
        },
        {
          label: "Highly rated",
          key:"rated",
          fields: [
            {field:"rating", options:{order:"asc"}},
            {field:"price", options:{order:"desc", customKey:"custom"}}
          ]
        },
        {
          label: "Cheapest",
          key:"cheapest",
          fields: [
            {field:"price", options:{order:'desc'}},
            {field:"rated"}
          ]
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
      {label: 'Lowest Price', field: 'price', key: 'cheap'},
      {
        label: "Highly rated",
        key:"rated",
        fields: [
          {field:"rating", options:{order:"asc"}},
          {field:"price", options:{order:"desc", customKey:"custom"}}
        ]
      },
      {
        label: "Cheapest",
        key:"cheapest",
        fields: [
          {field:"price", options:{order:'desc'}},
          {field:"rated"}
        ]
      }
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

    // handle complex sort
    this.accessor.state = new ValueState("rated")
    query = this.accessor.buildOwnQuery(query)
    expect(query.query.sort).toEqual([{'rating':{order:'asc'}}, {'price':{order:'desc', customKey:'custom'}}])

    // empty options
    this.accessor.state = new ValueState("cheapest")
    query = this.accessor.buildOwnQuery(query)
    expect(query.query.sort).toEqual([{'price':{order:'desc'}}, {'rated':{}}])

    // handle no options
    this.accessor.options.options = []
    query = this.accessor.buildOwnQuery(new ImmutableQuery())
    expect(query.query.sort).toEqual(undefined)
  })


})
