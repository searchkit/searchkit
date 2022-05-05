import { SearchkitTransporter } from '../transporters'
import { BaseSuggestor, BaseSuggestorResponse } from '.'

export interface CompletionSuggesterOptions {
  index?: string
  identifier: string
  field: string
  size?: number
  skip_duplicates?: boolean
}

export interface CompletionSuggesterResponse extends BaseSuggestorResponse {
  identifier: string
  suggestions: string[]
}

export class CompletionSuggester implements BaseSuggestor<CompletionSuggesterResponse> {
  options: CompletionSuggesterOptions

  constructor(options: CompletionSuggesterOptions) {
    this.options = options
  }

  async getSuggestions(
    query: string,
    transport: SearchkitTransporter
  ): Promise<CompletionSuggesterResponse> {
    const { index, identifier, field, size = 5, skip_duplicates } = this.options

    const eql = {
      size: 0,
      _source: [],
      suggest: {
        suggest: {
          prefix: query,
          completion: {
            size: size,
            skip_duplicates: !skip_duplicates,
            field: field,
            fuzzy: {
              fuzziness: 1
            }
          }
        }
      }
    }

    const response = await transport.performRequest(eql, { index })

    return {
      identifier: identifier,
      suggestions: response.suggest.suggest[0].options.map((suggestion) => suggestion.text)
    }
  }
}
