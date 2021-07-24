class ESQueryError extends Error {
  public query: string
  public errorCode: string

  constructor(message: string, query) {
    super(message)
    this.name = this.constructor.name
    this.errorCode = 'ES_CANNOT_PARSE_QUERY'
    Error.captureStackTrace(this, this.constructor)
    this.query = JSON.stringify(query)
  }
}

export default ESQueryError
