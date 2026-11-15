import type {
  KnnSearchQuery,
  QueryConfig,
  RequestOptions,
  SearchAttribute,
  SearchSettingsConfig,
  SemanticSearchConfig
} from './core'

type KnnQueryBuilder = (
  query: string,
  search_attributes: SearchAttribute[],
  config: QueryConfig
) => KnnSearchQuery

const DEFAULT_K = 50

let getKnnQueryWarned = false

/** Logs the `getKnnQuery` deprecation warning, once per process. */
export const warnGetKnnQueryDeprecated = () => {
  if (getKnnQueryWarned) return
  getKnnQueryWarned = true
  console.warn(
    'Searchkit: the `getKnnQuery` request option is deprecated and will be removed in a future major version. Use `search_settings.semantic_search` instead. While `getKnnQuery` is set, it is used and `semantic_search` is ignored.'
  )
}

/**
 * The `semantic_search` settings in effect for a request: undefined when they are not set, when
 * `getKnnQuery` overrides them, or in `text_only` mode.
 */
export const getActiveSemanticSearch = (
  config: SearchSettingsConfig,
  requestOptions?: RequestOptions
): SemanticSearchConfig | undefined => {
  const semantic = config.semantic_search
  if (!semantic || typeof requestOptions?.getKnnQuery === 'function') return undefined
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
 * (it is set, not `text_only`, not overridden by `getKnnQuery`, and the query is not empty).
 */
export const getQueryVector = async (
  query: string,
  config: SearchSettingsConfig,
  requestOptions?: RequestOptions
): Promise<number[] | undefined> => {
  const semantic = getActiveSemanticSearch(config, requestOptions)
  if (!semantic?.embed || query === '') return undefined
  return await semantic.embed(query)
}

/**
 * The KNN query builder for a request: `getKnnQuery` (deprecated) wins, then `semantic_search`.
 * `semanticOnly` is true when `semantic_search` is in `semantic_only` mode (no text query).
 */
export const getKnnQueryBuilder = (
  config: SearchSettingsConfig,
  requestOptions?: RequestOptions,
  queryVector?: number[]
): { build: KnnQueryBuilder | undefined; semanticOnly: boolean } => {
  if (typeof requestOptions?.getKnnQuery === 'function') {
    return { build: requestOptions.getKnnQuery, semanticOnly: false }
  }

  const semantic = getActiveSemanticSearch(config, requestOptions)
  if (!semantic) return { build: undefined, semanticOnly: false }

  const k = semantic.k ?? DEFAULT_K
  const build: KnnQueryBuilder = (query) => ({
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
