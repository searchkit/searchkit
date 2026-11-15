import { ElasticsearchAdapter } from '../ElasticsearchAdapter'
import type { RequestOptions, SearchSettingsConfig, SemanticSearchConfig } from '@searchkit/core'
import { getQueryRulesActionsFromRequest } from '@searchkit/core'

const baseSettings: SearchSettingsConfig = {
  search_attributes: ['title'],
  result_attributes: ['title'],
  facet_attributes: ['type']
}

const request = (query: string, params: Record<string, unknown> = {}) => ({
  indexName: 'movies',
  params: { query, facetFilters: [['type:movie']], hitsPerPage: 10, ...params }
})

const build = async (
  query: string,
  semantic_search?: SemanticSearchConfig,
  options?: RequestOptions,
  params?: Record<string, unknown>
) => {
  const settings = { ...baseSettings, semantic_search }
  const req = request(query, params)
  const rules = getQueryRulesActionsFromRequest([], req, settings)
  const { body } = await ElasticsearchAdapter({ host: 'http://localhost:9200' }).buildRequest(
    req,
    settings,
    rules,
    options
  )
  return body
}

const knnQuery = (query: string) => ({
  field: 'embedding',
  k: 10,
  num_candidates: 100,
  query_vector_builder: {
    text_embedding: { model_id: 'my-model', model_text: query }
  }
})

const filter = [{ bool: { should: [{ term: { type: 'movie' } }] } }]

describe('semantic_search', () => {
  it('hybrid with model_id: text query + knn with query_vector_builder + rrf', async () => {
    const body = await build('shawshank', {
      field: 'embedding',
      model_id: 'my-model',
      k: 10,
      num_candidates: 100
    })

    expect(body.knn).toEqual({ filter, ...knnQuery('shawshank') })
    expect(body.rank).toEqual({ rrf: { window_size: 10 } })
    expect(body.query).toEqual(
      expect.objectContaining({ bool: expect.objectContaining({ filter }) })
    )
    // same body as text search, plus knn and rank
    const { knn, rank, ...rest } = body
    expect(JSON.stringify(rest)).toEqual(JSON.stringify(await build('shawshank')))
  })

  it('hybrid with embed sends the query vector, with k / num_candidates defaults', async () => {
    const embed = jest.fn(async () => [0.1, 0.2, 0.3])
    const body = await build('shawshank', { field: 'embedding', embed })

    expect(embed).toHaveBeenCalledWith('shawshank')
    expect(body.knn).toEqual({
      filter,
      field: 'embedding',
      k: 50,
      num_candidates: 100,
      query_vector: [0.1, 0.2, 0.3]
    })
    expect(body.rank).toEqual({ rrf: { window_size: 10 } })
    expect(body.query).toBeDefined()
  })

  it('accepts a synchronous embed', async () => {
    const body = await build('shawshank', { field: 'embedding', embed: () => [1, 2] })
    expect(body.knn).toMatchObject({ query_vector: [1, 2] })
  })

  it('semantic_only emits knn only, no text query', async () => {
    const body = await build('shawshank', {
      field: 'embedding',
      model_id: 'my-model',
      k: 10,
      num_candidates: 100,
      mode: 'semantic_only'
    })

    expect(body.query).toBeUndefined()
    expect(body.rank).toBeUndefined()
    expect(body.knn).toEqual({ filter, ...knnQuery('shawshank') })
  })

  it('text_only ignores the vector search', async () => {
    const embed = jest.fn(async () => [1])
    const body = await build('shawshank', { field: 'embedding', embed, mode: 'text_only' })
    expect(embed).not.toHaveBeenCalled()
    expect(JSON.stringify(body)).toEqual(JSON.stringify(await build('shawshank')))
  })

  it.each(['hybrid', 'semantic_only'] as const)(
    'with an empty query there is no vector search (%s)',
    async (mode) => {
      const embed = jest.fn(async () => [1])
      const body = await build('', { field: 'embedding', embed, mode })
      expect(embed).not.toHaveBeenCalled()
      expect(body.knn).toBeUndefined()
      expect(body.rank).toBeUndefined()
      expect(body.query).toEqual({ bool: { filter, must: { match_all: {} } } })
    }
  )

  it('no rank when no hits are requested', async () => {
    const body = await build('shawshank', { field: 'embedding', model_id: 'my-model' }, undefined, {
      hitsPerPage: 0
    })
    expect(body.knn).toBeDefined()
    expect(body.rank).toBeUndefined()
  })

  it('rejects the getKnnQuery option removed in v5 with a migration hint', async () => {
    await expect(
      build('shawshank', undefined, { getKnnQuery: knnQuery } as RequestOptions)
    ).rejects.toThrow('the `getKnnQuery` request option was removed in v5')
  })

  it('rejects getWhere, the SQL predicate of the postgres adapter', async () => {
    await expect(
      build('shawshank', undefined, { getWhere: () => ({ text: 't.a = $1', params: [1] }) })
    ).rejects.toThrow('the `getWhere` request option (a SQL predicate) is for the postgres adapter')
  })

  it('requires exactly one of embed or model_id', async () => {
    await expect(build('shawshank', { field: 'embedding' })).rejects.toThrow(
      'provide exactly one of `embed`'
    )
    await expect(
      build('shawshank', { field: 'embedding', model_id: 'm', embed: () => [1] })
    ).rejects.toThrow('provide exactly one of `embed`')
  })
})
