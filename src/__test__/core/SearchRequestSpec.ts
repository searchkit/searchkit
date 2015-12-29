import {
  SearchRequest,
  SearcherCollection,
  ESTransport
} from "../../"

describe("SearchRequest", ()=> {

  beforeEach(()=> {
    this.searchers = new SearcherCollection([])
    this.host = "http://localhost:9200"

    this.request = new SearchRequest(
      this.host, this.searchers)
    this.searchers.getQueries = ()=> {
      return [1,2,3]
    }
    this.searchers.setResponses = (responses)=> {
      this.responses = responses
    }
    this.searchers.setError = (error)=> {
      this.error = error
    }
  })

  it("constructor()", ()=> {
    expect(this.request.active)
      .toBe(true)
    expect(this.request.transport)
      .toEqual(jasmine.any(ESTransport))
    expect(this.request.transport.host)
      .toBe(this.host)
    expect(this.request.host).toBe(this.host)
    expect(this.request.searchers).toBe(
      this.searchers)
  })


  it("run() - success", (done)=> {
    spyOn(this.request.transport, "search")
      .and.returnValue(Promise.resolve([
        "r1", "r2", "r2"
      ]))
    this.request.run().then(()=> {
      expect(this.responses)
        .toEqual(["r1", "r2", "r2"])
      done()
    })
  })

  it("run() - error", ()=> {
    let error = new Error("oh no")
    spyOn(this.request.transport, "search")
      .and.returnValue(Promise.reject(error))
    this.request.run().then(()=> {
      expect(this.error).toBe(error)
    })
  })

  it("deactivate()", ()=> {
    this.request.deactivate()
    expect(this.request.active).toBe(false)
  })

  it("setResponses()", ()=> {
    this.request.setResponses("responses")
    expect(this.responses).toBe("responses")
    delete this.responses
    this.request.deactivate()
    this.request.setResponses("responses")
    expect(this.responses).toBe(undefined)
  })

  it("setError()", ()=> {
    let error = new Error("oh no")
    this.request.setError(error)
    expect(this.error).toBe(error)
    delete this.error
    this.request.deactivate()
    this.request.setError(error)
    expect(this.error).toBe(undefined)
  })

})
