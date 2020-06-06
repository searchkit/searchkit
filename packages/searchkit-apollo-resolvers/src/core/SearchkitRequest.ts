import dataloader from "dataloader"
import QueryManager from "./QueryManager"
import fetch from 'node-fetch'

interface ESResponse {
  hits: {
    hits: [{
      _id: string,
      _source: Object
    }]
  }
}

export default class SearchkitRequest {
  private dataloader: any
  
  constructor(private queryManager: QueryManager) {
    this.dataloader = new dataloader(async (partialQueries) => {
      const ESQuery = this.buildESQuery(partialQueries as any[])
      return this.executeQuery(ESQuery)
    })
  }

  private buildESQuery(partialQueries) {
    return partialQueries.reduce({}, (sum, partialQuery) => ({
      ...sum,
      ...partialQuery
    }))
  }

  public async search(partialQuery) : Promise<ESResponse> {
    return this.dataloader.load(partialQuery)
  }

  private async executeQuery(esQuery) {
    return Promise.resolve([])
  }
}