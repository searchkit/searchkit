import type {
  KnnSearchQuery,
  RequestOptions,
  SearchSettingsConfig,
  SemanticSearchConfig
} from '@searchkit/core'

const DEFAULT_K = 50

/**
 * `getKnnQuery` was removed in v5. Fail loudly instead of silently ignoring it (e.g. in
 * JavaScript, where the type error does not show).
 */
export const assertNoGetKnnQuery = (requestOptions?: RequestOptions) => {
  if ((requestOptions as Record<string, unknown> | undefined)?.getKnnQuery !== undefined) {
    throw new Error(
      'Searchkit: the `getKnnQuery` request option was removed in v5. Configure `search_settings.semantic_search` instead, e.g. `{ field, model_id, k, num_candidates }` or `{ field, embed }`, with `mode: "semantic_only"` to replace `getQuery: () => false`.'
    )
  }
}

/**
 * `getWhere` is a SQL predicate for the postgres adapter. Fail instead of silently searching without it
 * (it is typically a permissions filter).
 */
export const assertNoGetWhere = (requestOptions?: RequestOptions) => {
  if (requestOptions?.getWhere !== undefined) {
    throw new Error(
      'Searchkit: the `getWhere` request option (a SQL predicate) is for the postgres adapter. With Elasticsearch use `getBaseFilters`, which returns Elasticsearch filter queries.'
    )
  }
}

/**
 * The `semantic_search` settings in effect: undefined when they are not set or in `text_only` mode.
 */
export const getActiveSemanticSearch = (
  config: SearchSettingsConfig
): SemanticSearchConfig | undefined => {
  const semantic = config.semantic_search
  if (!semantic) return undefined
  if ((semantic.mode ?? 'hybrid') === 'text_only') return undefined

  if (!semantic.field) {
    throw new Error('semantic_search: `field` is required')
  }
  if (!!semantic.embed === !!semantic.model_id) {
    throw new Error(
      'semantic_search: provide exactly one of `embed` (a function that returns the query vector) or `model_id` (an Elasticsearch text embedding model)'
    )
  }
  return semantic
}

/**
 * Embeds the query with `semantic_search.embed`, when semantic search applies to this request
 * (it is set, not `text_only`, and the query is not empty).
 */
export const getQueryVector = async (
  query: string,
  config: SearchSettingsConfig
): Promise<number[] | undefined> => {
  const semantic = getActiveSemanticSearch(config)
  if (!semantic?.embed || query === '') return undefined
  return await semantic.embed(query)
}

/**
 * The KNN query for `semantic_search`, if it applies. `semanticOnly` is true in `semantic_only`
 * mode (no text query).
 */
export const getKnnQueryBuilder = (
  config: SearchSettingsConfig,
  queryVector?: number[]
): { build: ((query: string) => KnnSearchQuery) | undefined; semanticOnly: boolean } => {
  const semantic = getActiveSemanticSearch(config)
  if (!semantic) return { build: undefined, semanticOnly: false }

  const k = semantic.k ?? DEFAULT_K
  const build = (query: string): KnnSearchQuery => ({
    field: semantic.field,
    k,
    num_candidates: semantic.num_candidates ?? 2 * k,
    ...(semantic.model_id
      ? {
          query_vector_builder: {
            text_embedding: {
              model_id: semantic.model_id,
              model_text: query
            }
          }
        }
      : { query_vector: queryVector })
  })

  return { build, semanticOnly: semantic.mode === 'semantic_only' }
}
