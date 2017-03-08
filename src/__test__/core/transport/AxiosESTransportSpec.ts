import {AxiosESTransport, ESTransport} from "../../../"
import "jasmine-ajax"
import axios from "axios"

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
    expect(axiosConfig.headers).toEqual(axios.defaults.headers)
    expect(this.transport instanceof ESTransport).toBe(true)
  })

  it("constructor() - additional options", ()=> {
    const transport = new AxiosESTransport(this.host, {
      headers:{
        "Content-Type":"application/json",
      },
      basicAuth:"key:val",
      searchUrlPath:"/_search/",
      timeout: 10000
    })
    expect(transport.options.headers).toEqual({
      "Content-Type":"application/json"
    })
    expect(transport.axios.defaults.auth.username).toBe("key")
    expect(transport.axios.defaults.auth.password).toBe("val")
    expect(transport.options.timeout).toEqual(10000)
    expect(transport.options.searchUrlPath).toBe("/_search/")
  })

  it("search()", (done)=> {
    let mockResults = {hits:[1,2,3]}
    this.host = "http://search:9200/"
    this.transport = new AxiosESTransport(this.host, {
      searchUrlPath:"/search"
    })
    jasmine.Ajax.stubRequest(this.host + "search").andReturn({
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

  it("search - basicAuth", (done)=> {
    let mockResults = {hits:[1,2,3]}
    this.host = "http://search:9200/"
    this.transport = new AxiosESTransport(this.host, {
      searchUrlPath:"/search",
      basicAuth: 'user:pass'
    })
    jasmine.Ajax.stubRequest(this.host + "search").andReturn({
      "responseText": JSON.stringify(mockResults)
    });
    this.transport.search({
      size:10,
      from:0
    }).then((result)=> {
      expect(result.hits).toEqual([1,2,3])
      let request = jasmine.Ajax.requests.mostRecent()
      expect(request.requestHeaders['Authorization'])
        .toEqual("Basic " + btoa("user:pass"))
      done()
    })
  })

  it("search - withCredentials", (done)=> {
    document.cookie = axios.defaults.xsrfCookieName + '=12345';
    let mockResults = {hits:[1,2,3]}
    this.host = "http://search:9200/"
    this.transport = new AxiosESTransport(this.host, {
      searchUrlPath:"/search",
      withCredentials: true
    })
    jasmine.Ajax.stubRequest(this.host + "search").andReturn({
      "responseText": JSON.stringify(mockResults)
    });
    this.transport.search({
      size:10,
      from:0
    }).then((result)=> {
      expect(result.hits).toEqual([1,2,3])
      let request = jasmine.Ajax.requests.mostRecent()
      expect(request.requestHeaders[axios.defaults.xsrfHeaderName]).toEqual('12345');
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
