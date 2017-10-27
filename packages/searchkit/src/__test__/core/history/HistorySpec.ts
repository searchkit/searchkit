import * as history from '../../../core/history'

describe("History", () => {

  it("encode / decode searchkit obj", () => {
    const obj = {q: "test", categories: [["movie"],["Crime"]], actors: ["a", 'b-c', 'd & e', 'f=g'], writers: ['d'] }
    const str = history.encodeObjUrl(obj)
    expect(str).toEqual('q=test&categories[0][0]=movie&categories[1][0]=Crime&actors[0]=a&actors[1]=b-c&actors[2]=d%20%26%20e&actors[3]=f%3Dg&writers[0]=d')
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
