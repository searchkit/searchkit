import dataloader from 'dataloader'
import { Client, ClientOptions } from '@elastic/elasticsearch'
import HttpAgent, { HttpsAgent } from 'agentkeepalive'
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

const keepaliveHttpsAgent = new HttpsAgent()
const keepaliveAgent = new HttpAgent()

export default class SearchkitRequest {
  private dataloader: any
  private client: Client

  constructor(
    private queryManager: QueryManager,
    private config: SearchkitConfig,
    private baseFilters: Array<Record<string, unknown>>
  ) {
    this.client = new Client({
      node: this.config.host,
      agent: () =>
        new URL(this.config.host).protocol === 'http:' ? keepaliveAgent : keepaliveHttpsAgent
    })

    this.dataloader = new dataloader(async (partialQueries) => {
      const query = {
        bool: {
          ...(this.queryManager.hasQuery() && this.config.query
            ? { must: this.config.query.getFilter(this.queryManager) }
            : {}),
          filter: this.baseFilters
        }
      }

      const combinedFilterConfigs = [...(this.config.facets || []), ...(this.config.filters || [])]

      const baseQuery = {
        size: 0,
        query,
        post_filter: filterTransform(this.queryManager, combinedFilterConfigs)
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
      const response = await this.client.search<SearchResponse<any>>({
        index: this.config.index,
        body: esQuery
      })

      return response.body
    } catch (e) {
      console.log(e)
    }
  }
}
