import {
  SearchRequest,
  SearchkitManager,
  AxiosESTransport,
  ImmutableQuery
} from "../../"

describe("SearchRequest", ()=> {

  beforeEach(()=> {
    this.searchkit = SearchkitManager.mock()
    this.transport = new AxiosESTransport("http://localhost:9200")

    this.query = new ImmutableQuery().setSize(10)

    this.request = new SearchRequest(
      this.transport, this.query.getJSON(), this.searchkit)
  })

  it("constructor()", ()=> {
    expect(this.request.active)
      .toBe(true)
    expect(this.request.transport)
      .toBe(this.transport)
    expect(this.request.searchkit).toBe(
      this.searchkit)
    expect(this.request.query).toBe(
      this.query.getJSON())
  })


  it("run() - success", (done)=> {
    spyOn(this.request.transport, "search")
      .and.returnValue(Promise.resolve([
        "r1", "r2", "r2"
      ]))
    this.request.run().then(()=> {
      expect(this.searchkit.results)
        .toEqual(["r1", "r2", "r2"])
      done()
    })
  })

  it("run() - error", (done)=> {
    let error = new Error("oh no")
    spyOn(this.request.transport, "search")
      .and.returnValue(Promise.reject(error))
    this.request.run().then(()=> {
      expect(this.searchkit.error).toBe(error)
      done()
    })
  })

  it("deactivate()", ()=> {
    this.request.deactivate()
    expect(this.request.active).toBe(false)
  })

  it("setResponses()", ()=> {
    this.request.setResults("results")
    expect(this.searchkit.results).toBe("results")
    delete this.searchkit.results
    this.request.deactivate()
    this.request.setResults("results")
    expect(this.searchkit.results).toBe(undefined)
  })

  it("setError()", ()=> {
    let error = new Error("oh no")
    this.request.setError(error)
    expect(this.searchkit.error).toBe(error)
    delete this.searchkit.error
    this.request.deactivate()
    this.request.setError(error)
    expect(this.searchkit.error).toBe(undefined)
  })

})
