import {ImmutableQuery} from "../ImmutableQuery.ts";
import {BoolMust, SimpleQueryString} from "../Builders.ts";

const update = require("react-addons-update")

fdescribe("ImmutableQuery Test", ()=>{

  beforeEach(()=>{
    this.immutableQuery = new ImmutableQuery()
    this.printJSON = (ob)=>{
      console.log(JSON.stringify(ob, null, 2))
    }
  })

  it("update lib check", ()=>{
    console.log(update)
  })

  it("size", ()=>{
    var newQuery = this.immutableQuery.setSize(10)
    expect(newQuery == this.immutableQuery).toEqual(false)
    expect(newQuery.query.size).toEqual(10)
  })

  it("addFilter", ()=>{
    var filter = {term:{genre:"action"}}
    var newQuery = this.immutableQuery.addFilter("genre", filter)
    this.printJSON(newQuery.query)
    expect(newQuery.query).toEqual({
      "filter": BoolMust([filter]),
      "query":BoolMust()
    })
    expect(newQuery.index).toEqual({
      filters:{
        genre:filter
      }
    })

    expect(newQuery.getFilters()).toEqual({
      bool:{must:[filter]}
    })
    expect(newQuery.getFilters("genre"))
      .toEqual(BoolMust())
    expect(newQuery.getFilters("author"))
      .toEqual(BoolMust([filter]))
  });

  it("addQuery", ()=>{
    var query = SimpleQueryString("hi", {
      default_operator:"and"
    })

    console.log(query)
    var newQuery = this.immutableQuery.addQuery(query)
    expect(newQuery.query.query).toEqual(BoolMust([query]))
    expect(newQuery.query.query.bool.must[0]).toEqual({
      simple_query_string: {
        default_operator: 'and',
        query: 'hi'
      }
    })
  })

  it("setAggs", ()=>{
    var newAggs = {
      genres:{
        terms:{
          field:"genre"
        }
      }
    }
    var newQuery = this.immutableQuery.setAggs(newAggs)
    expect(newQuery.query.aggs).toEqual(newAggs)
  })

  it("areQueriesDifferent", ()=>{
    var a = new ImmutableQuery()
    var b = new ImmutableQuery()

    expect(ImmutableQuery.areQueriesDifferent(a,b)).toEqual(false)
    a = a.setSize(10)
    expect(ImmutableQuery.areQueriesDifferent(a,b)).toEqual(true)
    b = b.setSize(10)
    expect(ImmutableQuery.areQueriesDifferent(a,b)).toEqual(false)
    a = a.addFilter("genre",{term:{genre:"action"}})
    expect(ImmutableQuery.areQueriesDifferent(a,b)).toEqual(true)
    b = b.addFilter("genre",{term:{genre:"action"}})
    expect(ImmutableQuery.areQueriesDifferent(a,b)).toEqual(false)
  })

});
