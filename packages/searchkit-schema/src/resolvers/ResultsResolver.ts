/* eslint-disable no-useless-catch */
import createInstance, { SearchkitConfig, SearchkitRequest } from '@searchkit/sdk'
import { SearchkitResponse } from '@searchkit/sdk'
import ESClientTransporter from '@searchkit/sdk/lib/cjs/transporters/ESClientTransporter'
import DataLoader from 'dataloader'

type FacetsRequest = { identifier: string; query?: string; size?: number }[]

const transporter = {}

function getTransporter(config: SearchkitConfig) {
  if (!transporter[config.index]) {
    transporter[config.index] = new ESClientTransporter(config)
  }
  return transporter[config.index]
}

export class DataRequest {
  private dataloader: any
  private facets: boolean
  private facetsCriteria: { identifier: string; query?: string; size?: number }[] = []
  private size: number
  private from: number
  private skRequest: SearchkitRequest
  private baseFilters: any

  constructor(private config: SearchkitConfig) {
    this.dataloader = new DataLoader(this.performSearch.bind(this))
    this.skRequest = createInstance(config, getTransporter(this.config))
  }

  setFacets(enable: boolean): void {
    this.facets = enable
  }

  setFacetsCriteria(facetsCriteria: FacetsRequest): void {
    this.facetsCriteria = [...this.facetsCriteria, ...facetsCriteria]
  }

  setHits({ size, from, sortId }: { size: number; from: number; sortId: string }): void {
    this.size = size
    this.from = from
    this.skRequest.setSortBy(sortId)
  }

  setQuery(query: string) {
    this.skRequest.query(query)
  }

  setBaseFilters(baseFilters: any) {
    this.baseFilters = baseFilters
  }

  setFilters(filters) {
    this.skRequest.setFilters(filters)
  }

  setQueryOptions(options) {
    this.skRequest.setQueryOptions(options)
  }

  search(): Promise<SearchkitResponse> {
    return this.dataloader.load(1)
  }

  async performSearch(requests) {
    const results = await this.skRequest.execute(
      {
        facets: this.facetsCriteria.length > 0 ? this.facetsCriteria : this.facets,
        hits: {
          size: this.size,
          from: this.from,
          includeRawHit: true
        }
      },
      this.baseFilters
    )

    return requests.map(() => results)
  }
}

export default async (parent, parameters, ctx, info) => {
  try {
    const returnTypeName = info.returnType.name
    const config = ctx.searchkit.configs[returnTypeName] as SearchkitConfig

    const baseFilters = ctx.searchkit.baseFilters[returnTypeName]
      ? ctx.searchkit.baseFilters[returnTypeName](parent, parameters, ctx, info)
      : []

    const queryOptions = parameters.queryOptions || { fields: [] }

    const dataRequest = new DataRequest(config)

    dataRequest.setQueryOptions(queryOptions)
    dataRequest.setBaseFilters(baseFilters)

    if (parameters.query) {
      dataRequest.setQuery(parameters.query)
    }

    if (parameters.filters) {
      dataRequest.setFilters(parameters.filters)
    }

    return {
      searchkit: {
        dataRequest,
        config,
        hitType: ctx.searchkit.hitTypeMappings[returnTypeName]
      }
    }
  } catch (e) {
    throw e
  }
}
