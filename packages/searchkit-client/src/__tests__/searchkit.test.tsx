import { renderHook, act } from '@testing-library/react-hooks'
import React from 'react'
import {
  SearchkitClient,
  SearchkitContext,
  SearchkitProvider,
  useSearchkit,
  useSearchkitQuery,
  useSearchkitVariables,
  useSearchkitQueryValue,
  SearchkitClientConfig
} from '../searchkit'

const initial = {
  query: '',
  filters: [],
  sortBy: '',
  page: {
    size: 10,
    from: 0
  }
}

const createSearchkitClient = (config: SearchkitClientConfig = {}) => {
  const state = Object.assign({}, initial)
  const setState = (arg) => {
    Object.assign(state, arg(state))
  }
  const api = new SearchkitClient(config)
  api.setSearchState = setState
  api.searchState = state

  return api
}

describe('Searchkit Client', () => {
  it('should be exportable', () => {
    expect(SearchkitClient).not.toBeNull()
    expect(SearchkitProvider).not.toBeNull()
    expect(SearchkitContext).not.toBeNull()
    expect(useSearchkit).not.toBeNull()
  })

  it('default state to be empty', () => {
    const api = createSearchkitClient()

    expect(api.getQuery()).toBe('')
    expect(api.getFilters()).toEqual([])
    expect(api.getFiltersByIdentifier('anId')).toEqual([])
    expect(api.canResetSearch()).toBe(false)
    expect(api.baseSearchState.page.size).toBe(10)
  })

  it('allow to change items per page', () => {
    const api = createSearchkitClient({
      itemsPerPage: 20
    })

    expect(api.baseSearchState.page.size).toBe(20)
  })

  it('should be able to manipulate query', () => {
    const api = createSearchkitClient()
    expect(api.getQuery()).toBe('')
    api.setQuery('heat')
    expect(api.getQuery()).toBe('heat')
    expect(api.canResetSearch()).toBeTruthy()
    api.setQuery('')
    expect(api.canResetSearch()).toBeFalsy()
  })

  it('should be able to manipulate filters', () => {
    const api = createSearchkitClient()
    expect(api.getFilters()).toEqual([])
    api.addFilter({ identifier: 'type', value: 'Movie' })
    expect(api.getFilters()).toEqual([{ identifier: 'type', value: 'Movie' }])
    expect(api.getFiltersByIdentifier('type')).toEqual([{ identifier: 'type', value: 'Movie' }])
    expect(api.getFiltersByIdentifier('missing')).toEqual([])
    expect(api.canResetSearch()).toBeTruthy()

    // setting the query should reset filters
    api.setQuery('new query')
    expect(api.getFilters()).toEqual([])
    expect(api.canResetSearch()).toBeTruthy()
  })

  it('should be able to manage pagination', () => {
    const api = createSearchkitClient()
    api.setPage({ from: 10, size: 10 })
  })

  it('should toggle filter and keep order', () => {
    const api = createSearchkitClient()
    api.addFilter({ identifier: 'type', value: 'Movies' })
    api.addFilter({ identifier: 'type', value: 'Games' })
    expect(api.getFilters()).toEqual([
      { identifier: 'type', value: 'Games' },
      { identifier: 'type', value: 'Movies' }
    ])
    api.toggleFilter({ identifier: 'type', value: 'Movies' })
    expect(api.getFilters()).toEqual([{ identifier: 'type', value: 'Games' }])
    api.toggleFilter({ identifier: 'type', value: 'Movies' })
    expect(api.getFilters()).toEqual([
      { identifier: 'type', value: 'Movies' },
      { identifier: 'type', value: 'Games' }
    ])
  })

  it('should toggle range filters', () => {
    const api = createSearchkitClient()
    api.addFilter({ identifier: 'type', min: 0, max: 100 })
    expect(api.getFilters()).toEqual([{ identifier: 'type', min: 0, max: 100 }])
    api.toggleFilter({ identifier: 'type', min: 0, max: 100 })
    expect(api.getFilters()).toEqual([])
  })

  it('should toggle range filters min / max optional', () => {
    const api = createSearchkitClient()
    api.addFilter({ identifier: 'type', min: 0, max: null })
    expect(api.getFilters()).toEqual([{ identifier: 'type', min: 0, max: null }])
    api.toggleFilter({ identifier: 'type', min: 0, max: null })
    expect(api.getFilters()).toEqual([])
  })

  it('should toggle level value filters', () => {
    const api = createSearchkitClient()
    api.addFilter({ identifier: 'type', value: 'test', level: 1 })
    api.addFilter({ identifier: 'type', value: 'level2', level: 2 })

    expect(api.getFilters()).toEqual([
      { identifier: 'type', value: 'level2', level: 2 },
      { identifier: 'type', value: 'test', level: 1 }
    ])
    api.toggleFilter({ identifier: 'type', value: 'level2', level: 2 })
    expect(api.getFilters()).toEqual([{ identifier: 'type', value: 'test', level: 1 }])
  })

  it('should toggle date range filters', () => {
    const api = createSearchkitClient()
    const filter = {
      identifier: 'type',
      dateMin: '2012-12-26T00:00:00.000Z',
      dateMax: '2020-12-26T00:00:00.000Z'
    }
    api.addFilter({ ...filter })
    expect(api.getFilters()).toEqual([filter])
    api.toggleFilter({ ...filter })
    expect(api.getFilters()).toEqual([])
  })

  it('should toggle date range filters min / max optional', () => {
    const api = createSearchkitClient()
    api.addFilter({ identifier: 'released', dateMin: '2020-12-26T00:00:00.000Z', dateMax: null })
    expect(api.getFilters()).toEqual([
      { identifier: 'released', dateMin: '2020-12-26T00:00:00.000Z', dateMax: null }
    ])
    api.toggleFilter({ identifier: 'released', dateMin: '2020-12-26T00:00:00.000Z', dateMax: null })
    expect(api.getFilters()).toEqual([])
  })

  it('should remove multiple filters by id', () => {
    const api = createSearchkitClient()
    api.addFilter({ identifier: 'type', value: 'Movies' })
    api.addFilter({ identifier: 'type', value: 'Games' })
    api.removeFiltersByIdentifier('type')
    expect(api.getFilters()).toEqual([])
  })

  it('should determine whether a filter has been applied or not', () => {
    const api = createSearchkitClient()
    api.addFilter({ identifier: 'type', value: 'Movies' })
    api.addFilter({ identifier: 'type', value: 'Games' })
    expect(api.isFilterSelected({ identifier: 'type', value: 'Movies' })).toBeTruthy()
    expect(api.isFilterSelected({ identifier: 'type', value: 'no match' })).toBeFalsy()
  })

  it('should pass state within callback', () => {
    const callback = jest.fn()
    const api = createSearchkitClient()
    api.setCallbackFn(callback)
    api.setQuery('test')
    api.addFilter({ identifier: 'type', value: 'Movies' })
    api.setPage({ from: 10, size: 20 })
    api.setSortBy('released')
    api.search()
    expect(callback).toBeCalledWith({
      filters: [{ identifier: 'type', value: 'Movies' }],
      page: { from: 10, size: 20 },
      query: 'test',
      sortBy: 'released'
    })
  })

  it('Searchkit Provider + Hook', () => {
    const api = createSearchkitClient()
    const wrapper = ({ children }) => <SearchkitProvider client={api}>{children}</SearchkitProvider>

    const { result } = renderHook(() => useSearchkit(), { wrapper })
    act(() => {
      result.current.setQuery('test')
    })
    expect(api.getQuery()).toBe('test')
  })

  it('variables lifecycle', async () => {
    const api = createSearchkitClient()
    api.updateBaseSearchState({
      query: 'test',
      filters: [{ identifier: 'type', value: 'Movies' }],
      sortBy: 'released'
    })
    const wrapper = ({ children }) => <SearchkitProvider client={api}>{children}</SearchkitProvider>

    const variablesHook = renderHook(() => useSearchkitVariables(), { wrapper })

    expect(variablesHook.result.current).toEqual({
      filters: [{ identifier: 'type', value: 'Movies' }],
      page: { from: 0, size: 10 },
      query: 'test',
      sortBy: 'released'
    })
    act(() => {
      api.setQuery('hello')
    })

    variablesHook.rerender()

    expect(variablesHook.result.current).toEqual({
      filters: [{ identifier: 'type', value: 'Movies' }],
      page: { from: 0, size: 10 },
      query: 'test',
      sortBy: 'released'
    })

    act(() => {
      api.search()
    })

    expect(variablesHook.result.current).toEqual({
      filters: [],
      page: { from: 0, size: 10 },
      query: 'hello',
      sortBy: 'released'
    })
  })
})

describe('useSearchkitQuery', () => {
  it('should update when api state is updated', () => {
    const api = createSearchkitClient()
    api.updateBaseSearchState({
      query: 'test',
      filters: [{ identifier: 'type', value: 'Movies' }],
      sortBy: 'released'
    })
    const wrapper = ({ children }) => <SearchkitProvider client={api}>{children}</SearchkitProvider>

    const queryValueHook = renderHook(() => useSearchkitQueryValue(), { wrapper })

    expect(queryValueHook.result.current[0]).toEqual('test')
    act(() => {
      api.setQuery('hello')
    })
    queryValueHook.rerender()
    expect(queryValueHook.result.current[0]).toEqual('hello')
    act(() => {
      queryValueHook.result.current[1]('test')
    })
    expect(queryValueHook.result.current[0]).toEqual('test')
  })
})
