import * as history from '../../../core/history'

describe("History", () => {

  it("encode / decode searchkit obj", () => {
    const obj = {q: "test", categories: [["movie"],["Crime"]], actors: ["a", 'b-c', 'd & e', 'f=g'], writers: ['d'] }
    const str = history.encodeObjUrl(obj)
    expect(str).toEqual('q=test&categories%255B0%255D%255B0%255D=movie&categories%255B1%255D%255B0%255D=Crime&actors%255B0%255D=a&actors%255B1%255D=b-c&actors%255B2%255D=d%2520%2526%2520e&actors%255B3%255D=f%253Dg&writers%255B0%255D=d')
    expect(history.decodeObjString(str)).toEqual(obj)
  })

  it("createHistoryInstance",  ()=> {    
    //uses browser history by default
    expect(history.createHistoryInstance().location.pathname).toEqual("/context.html")
    spyOn(history, "supportsHistory").and.returnValue(false)
    //uses memory history
    expect(history.createHistoryInstance().location.pathname).toEqual("/")    
  })

})
