import {ESTransport} from "../../"
import "jasmine-ajax"

describe("ESTransport", ()=> {

  beforeEach(()=> {
    jasmine.Ajax.install()
    this.host = "http://search:9200/"
    this.transport = new ESTransport(this.host)
  })

  afterEach(()=> {
    jasmine.Ajax.uninstall()
  })

  it("_search()", (done)=> {
    let mockResults = {hits:[1,2,3]}
    jasmine.Ajax.stubRequest(this.host + "_search").andReturn({
      "responseText": JSON.stringify(mockResults)
    });
    this.transport._search({
      size:10,
      from:0
    }).then((result)=> {
      expect(result.hits).toEqual([1,2,3])
      let request = jasmine.Ajax.requests.mostRecent()
      expect(request.method).toBe("POST")
      expect(request["data"]()).toEqual(
        {size:10, from:0})
      done()
    })
  })

  it("_search()", (done)=> {
    let mockResults = {responses:[1,2,3]}
    jasmine.Ajax.stubRequest(this.host + "_msearch").andReturn({
      "responseText": JSON.stringify(mockResults)
    });
    this.transport._msearch(["a", "b", "c"]).then((result)=> {
      expect(result).toEqual([1,2,3])
      let request = jasmine.Ajax.requests.mostRecent()
      expect(request.method).toBe("POST")
      expect(request["data"]()).toEqual(
        ["a", "b", "c"])
      done()
    })
  })

  it("search() - single query", (done)=> {
    spyOn(this.transport, "_search")
      .and.returnValue(Promise.resolve("singleSearchResponse"))
    let queries = ["query1"]
    this.transport.search(queries)
      .then((result)=> {
        expect(result).toEqual(["singleSearchResponse"])
        expect(this.transport._search)
        .toHaveBeenCalledWith("query1")
        done()
      })
  })

  it("search() - multiple query", (done)=> {
    spyOn(this.transport, "_msearch")
      .and.returnValue(Promise.resolve([
        "r1", "r2"
      ]))
    let queries = ["q1", "q2"]
    this.transport.search(queries)
      .then((result)=> {
        expect(result).toEqual(["r1", "r2"])
        expect(this.transport._msearch)
          .toHaveBeenCalledWith(["q1", "q2"])
        done()
      })
  })

  it("test timeout", (done)=> {
    ESTransport.timeout = 10
    this.transport = new ESTransport(this.host)
    expect(this.transport.axios.defaultConfig.timeout)
      .toEqual(10)
  })

})
