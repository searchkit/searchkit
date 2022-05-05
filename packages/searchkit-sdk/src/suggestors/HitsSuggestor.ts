import { CustomHighlightConfig } from '..'
import { BaseQuery } from '../query'
import { SearchkitTransporter } from '../transporters'
import QueryManager from '../core/QueryManager'
import { SearchkitHit } from '../transformers'
import { BaseSuggestor, BaseSuggestorResponse } from '.'

export interface HitsSuggestorResponse extends BaseSuggestorResponse {
  hits: SearchkitHit[]
}

export interface HitsSuggestorOptions {
  index?: string
  identifier: string
  hits: {
    fields: string[]
    highlightedFields?: (string | CustomHighlightConfig)[]
  }
  query: BaseQuery
  size?: number
}

export class HitsSuggestor implements BaseSuggestor<HitsSuggestorResponse> {
  options: HitsSuggestorOptions

  constructor(options: HitsSuggestorOptions) {
    this.options = options
  }

  async getSuggestions(
    query: string,
    transport: SearchkitTransporter
  ): Promise<HitsSuggestorResponse> {
    const { index, identifier, hits, query: queryHandler, size = 5 } = this.options

    const qm = new QueryManager()
    qm.setQuery(query)

    const sourceFields = {
      _source: {
        includes: hits.fields
      }
    }

    let highlight
    hits.highlightedFields?.forEach((field) => {
      if (!highlight) {
        highlight = { fields: {} }
      }
      if (typeof field == 'string') {
        highlight.fields[field] = {}
      } else {
        highlight.fields[field.field] = field.config
      }
    })

    const eql = {
      size,
      query: queryHandler.getFilter(qm),
      ...sourceFields,
      highlight
    }

    const response = await transport.performRequest(eql, { index })

    return {
      identifier,
      hits: response.hits.hits.map((hit) => ({
        id: hit._id,
        fields: hit._source,
        highlight: hit.highlight || {},
        rawHit: hit
      }))
    }
  }
}
