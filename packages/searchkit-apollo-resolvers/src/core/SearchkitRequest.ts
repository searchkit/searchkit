import dataloader from 'dataloader'
import fetch from 'node-fetch'
import QueryManager from './QueryManager'

interface ESResponse {
  hits: {
    hits: [
      {
        _id: string
        _source: Record<string, any>
      }
    ]
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

  public async search(partialQuery): Promise<ESResponse> {
    return this.dataloader.load(partialQuery)
  }

  private async executeQuery(esQuery) {
    return Promise.resolve([])
  }
}
