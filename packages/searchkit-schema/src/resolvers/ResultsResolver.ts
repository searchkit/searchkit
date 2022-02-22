/* eslint-disable no-useless-catch */
import createInstance, { SearchkitConfig, SearchkitRequest, SortingOption } from '@searchkit/sdk'
import DataLoader from 'dataloader'

export class DataRequest {
  private dataloader: any
  private enableFacets: boolean
  private size: number
  private from: number
  private skRequest: SearchkitRequest
  private baseFilters: any

  constructor(private config: SearchkitConfig) {
    this.dataloader = new DataLoader(this.performSearch.bind(this))
    this.skRequest = createInstance(config)
  }

  setFacets(): void {
    this.enableFacets = true
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

  search(): Promise<any> {
    return this.dataloader.load(1)
  }

  async performSearch(requests) {
    const results = await this.skRequest.execute(
      {
        facets: this.enableFacets,
        hits: {
          size: this.size,
          from: this.from
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
    const skRequest = createInstance(config)

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
        skRequest: skRequest,
        dataRequest,
        config,
        hitType: ctx.searchkit.hitTypeMappings[returnTypeName]
      }
    }
  } catch (e) {
    throw e
  }
}
