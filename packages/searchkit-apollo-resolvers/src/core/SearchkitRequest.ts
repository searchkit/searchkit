import dataloader from 'dataloader'
import { Client } from '@elastic/elasticsearch'
import { SearchkitConfig } from '../resolvers'
import QueryManager from './QueryManager'
import { filterTransform } from './FacetsFns'

export interface SearchResponse<T> {
  took: number
  timed_out: boolean
  hits: {
    total: {
      value: number
    }
    max_score: number
    hits: Array<{
      _id: number
      _source: any
      fields?: any
      highlight?: any
      inner_hits?: any
      matched_queries?: string[]
      sort?: string[]
    }>
  }
  aggregations?: any
}

export const mergeESQueries = (queries) =>
  queries.reduce(
    (combinedQuery, partial) => ({
      ...combinedQuery,
      ...partial,
      aggs: {
        ...combinedQuery.aggs,
        ...partial.aggs
      }
    }),
    {}
  )

export default class SearchkitRequest {
  private dataloader: any

  constructor(private queryManager: QueryManager, private config: SearchkitConfig) {
    this.dataloader = new dataloader(async (partialQueries) => {
      const baseQuery = {
        size: 0,
        ...(this.queryManager.hasQuery() && this.config.query
          ? { query: this.config.query.getFilter(this.queryManager) }
          : {}),
        post_filter: filterTransform(this.queryManager, this.config.facets)
      }

      const ESQuery = mergeESQueries([baseQuery, ...(partialQueries as any[])])
      const response = await this.executeQuery(ESQuery)
      return partialQueries.map(() => response)
    })
  }

  public async search(partialQuery): Promise<SearchResponse<any>> {
    return this.dataloader.load(partialQuery)
  }

  private async executeQuery(esQuery): Promise<SearchResponse<any>> {
    try {

      const client = new Client({
        node: this.config.host
      })

      const response = await client.search<SearchResponse<any>>({
        index: this.config.index,
        body: esQuery
      })

      return response.body
    } catch (e) {
      console.log(e)
    }
  }
}
