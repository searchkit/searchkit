import {AxiosESTransport, ESTransport} from "../../../"
import "jasmine-ajax"

describe("AxiosESTransport", ()=> {

  beforeEach(()=> {
    jasmine.Ajax.install()
    this.host = "http://search:9200/"
    this.transport = new AxiosESTransport(this.host)
  })

  afterEach(()=> {
    jasmine.Ajax.uninstall()
  })

  it("constructor()", ()=> {
    expect(this.transport.host).toBe(this.host)
    expect(this.transport.options.headers).toEqual({})
    let axiosConfig = this.transport.axios.defaults
    expect(axiosConfig.baseURL).toBe(this.host)
    expect(axiosConfig.timeout).toBe(AxiosESTransport.timeout)
    expect(axiosConfig.headers).toBe(this.transport.options.headers)
    expect(this.transport instanceof ESTransport).toBe(true)
  })

  it("constructor() - headers", ()=> {
    const transport = new AxiosESTransport(this.host, {
      headers:{
        "Content-Type":"application/json",
      },
      basicAuth:"key:val"
    })
    expect(transport.options.headers).toEqual({
      "Content-Type":"application/json",
      "Authorization":"Basic " + btoa("key:val")
    })
  })

  it("search()", (done)=> {
    let mockResults = {hits:[1,2,3]}
    jasmine.Ajax.stubRequest(this.host + "_search").andReturn({
      "responseText": JSON.stringify(mockResults)
    });
    this.transport.search({
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



  it("test timeout", ()=> {
    AxiosESTransport.timeout = 10
    this.transport = new AxiosESTransport(this.host)
    expect(this.transport.axios.defaults.timeout)
      .toEqual(10)
  })

})
