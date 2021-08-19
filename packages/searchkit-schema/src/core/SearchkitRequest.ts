import dataloader from 'dataloader'
import { Client, ClientOptions, NodeOptions } from '@elastic/elasticsearch'
import HttpAgent, { HttpsAgent } from 'agentkeepalive'
import { SearchkitConfig } from '../resolvers'
import ESQueryError from '../utils/ESQueryError'
import { BaseFacet } from '../facets'
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

export type Query = {
  bool?: {
    must?: Array<Record<string, unknown>>
    should?: Array<Record<string, unknown>>
    filter?: Array<Record<string, unknown>>
  }
}

type BaseQuery = {
  size: number
  query?: Query
  post_filter?: Query
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
    private baseFilters: Array<Record<string, unknown>>,
    private facets: Array<BaseFacet>
  ) {
    if (typeof this.config.host === 'string') {
      this.client = new Client({
        node: this.config.host,
        agent: this.getHostAgent(this.config.host)
      })
    } else {
      this.client = new Client({
        ...this.config.host,
        agent: this.getHostAgent(this.config.host)
      })
    }

    this.dataloader = new dataloader(async (partialQueries) => {
      const query = this.buildQuery(partialQueries)
      const esQuery = this.config.postProcessRequest ? this.config.postProcessRequest(query) : query
      const response = await this.executeQuery(esQuery)
      return partialQueries.map(() => response)
    })
  }

  public async search(partialQuery): Promise<SearchResponse<any>> {
    return this.dataloader.load(partialQuery)
  }

  private buildQuery(partialQueries): BaseQuery {
    const queryFilter =
      this.queryManager.hasQuery() && this.config.query
        ? this.config.query.getFilter(this.queryManager)
        : null

    const baseFiltersQuery = filterTransform(this.queryManager, this.config.filters)
    const combinedBaseFilters = [].concat(this.baseFilters, baseFiltersQuery?.bool?.must || [])
    const query: Query = queryFilter || (combinedBaseFilters.length > 0 ? {} : null)

    if (combinedBaseFilters.length) {
      if (query.bool) {
        Object.assign(query.bool, {
          filter: query.bool.filter?.length
            ? [].concat(query.bool.filter, combinedBaseFilters)
            : combinedBaseFilters
        })
      } else {
        Object.assign(query, { bool: { filter: combinedBaseFilters } })
      }
    }

    const postFilter = filterTransform(this.queryManager, this.facets)

    let highlight
    this.config.hits.highlightedFields?.forEach((field) => {
      if (!highlight) {
        highlight = { fields: {} }
      }
      if (typeof field == 'string') {
        highlight.fields[field] = {}
      } else {
        highlight.fields[field.field] = field.config
      }
    })

    const baseQuery = { size: 0 }

    return mergeESQueries(
      [
        baseQuery,
        query && { query },
        postFilter && { post_filter: postFilter },
        highlight && { highlight },
        ...(partialQueries as any[])
      ].filter(Boolean)
    )
  }

  private async executeQuery(esQuery): Promise<SearchResponse<any>> {
    try {
      const response = await this.client.search<SearchResponse<any>>({
        index: this.config.index,
        body: esQuery
      })

      return response.body
    } catch (e) {
      if (e.meta?.statusCode === 400) {
        throw new ESQueryError(
          `Elasticsearch query failed. Check your custom filters or configuration. Below is the ES Query`,
          esQuery
        )
      } else {
        throw e
      }
    }
  }

  private getHostAgent(host: string | ClientOptions): HttpsAgent | HttpAgent {
    let url: string = null
    if (typeof host === 'string') {
      url = host
    } else {
      const nodes = host.nodes || host.node
      let node: string | NodeOptions
      if (nodes) {
        if (Array.isArray(nodes)) {
          if (nodes.length > 0) {
            node = nodes[0]
          }
        } else {
          node = nodes
        }
      }
      url = typeof node === 'string' ? node : node.url.toString()
    }

    return new URL(url).protocol === 'http:' ? keepaliveAgent : keepaliveHttpsAgent
  }
}
