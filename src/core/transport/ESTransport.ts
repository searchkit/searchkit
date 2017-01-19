export interface ESTransportOptions {
  headers?:Object,
  basicAuth?:string,
  searchUrlPath?:string
  withCredentials?:boolean
}

export abstract class ESTransport {
  abstract search(query:Object):any
}
