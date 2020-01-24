import { ImmutableQuery, SearchkitManager } from 'searchkit'
export interface SuggestGroup {
  title?: string
  results: Array<Record<string, any>>
}

export type Source = DataSource | SearchkitDatasource

export interface DataSource {
  isSearchkitSource(): boolean
  search(queryString: string): Promise<Array<SuggestGroup>>
}

export interface SearchkitDatasource {
  isSearchkitSource(): boolean
  search(query: ImmutableQuery, queryString: string): ImmutableQuery
  getGroupedResult(results: Record<string, any>): SuggestGroup
  configure(searchkit: SearchkitManager): void
}
