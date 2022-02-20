/* eslint-disable no-useless-catch */
import createInstance, { SearchkitConfig, SearchkitRequest } from '@searchkit/sdk'
import DataLoader from 'dataloader'

class DataRequest {
  private dataloader: any
  private enableFacets: boolean
  private size: number
  private from: number

  constructor(private skRequest: SearchkitRequest) {
    this.dataloader = new DataLoader(this.execute.bind(this))
  }

  setFacets() {
    this.enableFacets = true
  }

  setHits({ size, from }: { size: number; from: number }) {
    this.size = size
    this.from = from
  }

  async execute() {
    return this.skRequest.execute({
      facets: this.enableFacets,
      hits: {
        size: this.size,
        from: this.from
      }
    })
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

    return {
      searchkit: {
        skRequest: skRequest,
        dataloader,
        config,
        hitType: ctx.searchkit.hitTypeMappings[returnTypeName]
      }
    }
  } catch (e) {
    throw e
  }
}
