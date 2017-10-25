import {AxiosESTransport, ESTransport} from "../../../"
import axios from "axios"
import * as sinon from "sinon"

describe("AxiosESTransport", ()=> {

  beforeEach(()=> {    
    this.host = "http://search:9200/"
    this.server = sinon.fakeServer.create();
    this.mockResults = { hits: [1, 2, 3] }
    this.server.respondWith("POST", /search/,
      [200, { "Content-Type": "application/json" },
        JSON.stringify(this.mockResults)]);
    this.server.autoRespond = true
    this.transport = new AxiosESTransport(this.host)
  })

  afterEach(()=> {
    this.server.restore()
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

  it("search()", async ()=> {    
    this.transport = new AxiosESTransport(this.host, {
      searchUrlPath:"/search"
    })
    let result = await this.transport.search({
      size:10,
      from:0
    })
    expect(result).toEqual(this.mockResults)
    let request = this.server.requests[0]
    expect(request.method).toBe("POST")
    expect(request.url).toEqual(this.host+"search")     
    this.server.restore()   
  })

  it("search - basicAuth", async ()=> {    
    this.transport = new AxiosESTransport(this.host, {
      searchUrlPath:"/search",
      basicAuth: 'user:pass'
    })
    
    let result = await this.transport.search({
      size:10,
      from:0
    })
    expect(result).toEqual(this.mockResults)
    let request = this.server.requests[0]
    expect(request.requestHeaders['Authorization'])
      .toEqual("Basic " + btoa("user:pass"))
  })

  it("search - withCredentials", async ()=> {
    document.cookie = axios.defaults.xsrfCookieName + '=12345';
    this.transport = new AxiosESTransport(this.host, {
      searchUrlPath:"/search",
      withCredentials: true
    })
    
    let result = await this.transport.search({
      size:10,
      from:0
    })    
    let request = this.server.requests[0]
    expect(request.requestHeaders[axios.defaults.xsrfHeaderName]).toEqual('12345');
      
  })

  it("test timeout", ()=> {
    AxiosESTransport.timeout = 10
    this.transport = new AxiosESTransport(this.host)
    expect(this.transport.axios.defaults.timeout)
      .toEqual(10)
  })

})
