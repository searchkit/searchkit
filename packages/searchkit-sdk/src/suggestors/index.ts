import { SearchkitTransporter } from '../transporters'

export interface BaseSuggestor<T> {
  getSuggestions: (query: string, transport: SearchkitTransporter) => Promise<T>
}

export interface BaseSuggestorResponse {
  identifier: string
}

export * from './HitsSuggestor'
export * from './CompletionSuggestor'
