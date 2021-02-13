import { renderHook, act } from '@testing-library/react-hooks'
import React from 'react'
import { useLazyQuery } from '@apollo/client'
import {
  SearchkitClient,
  SearchkitContext,
  SearchkitProvider,
  useSearchkit,
  useSearchkitQuery
} from '../searchkit'

jest.mock('@apollo/client', () => ({
  useLazyQuery: jest.fn().mockReturnValue([jest.fn(), {}])
}))

describe('Searchkit Client', () => {
  it('should be exportable', () => {
    expect(SearchkitClient).not.toBeNull()
    expect(SearchkitProvider).not.toBeNull()
    expect(SearchkitContext).not.toBeNull()
    expect(useSearchkit).not.toBeNull()
  })

  it('default state to be empty', () => {
    const api = new SearchkitClient()
    expect(api.getQuery()).toBe('')
    expect(api.getFilters()).toEqual([])
    expect(api.getFiltersByIdentifier('anId')).toEqual([])
    expect(api.canResetSearch()).toBe(false)
  })

  it('should be able to manipulate query', () => {
    const api = new SearchkitClient()
    expect(api.getQuery()).toBe('')
    api.setQuery('heat')
    expect(api.getQuery()).toBe('heat')
    expect(api.canResetSearch()).toBeTruthy()
    api.setQuery('')
    expect(api.canResetSearch()).toBeFalsy()
  })

  it('should be able to manipulate filters', () => {
    const api = new SearchkitClient()
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
    const api = new SearchkitClient()
    api.setPage({ from: 10, size: 10 })
  })

  it('should toggle filter and keep order', () => {
    const api = new SearchkitClient()
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
    const api = new SearchkitClient()
    api.addFilter({ identifier: 'type', min: 0, max: 100 })
    expect(api.getFilters()).toEqual([{ identifier: 'type', min: 0, max: 100 }])
    api.toggleFilter({ identifier: 'type', min: 0, max: 100 })
    expect(api.getFilters()).toEqual([])
  })

  it('should toggle range filters min / max optional', () => {
    const api = new SearchkitClient()
    api.addFilter({ identifier: 'type', min: 0, max: null })
    expect(api.getFilters()).toEqual([{ identifier: 'type', min: 0, max: null }])
    api.toggleFilter({ identifier: 'type', min: 0, max: null })
    expect(api.getFilters()).toEqual([])
  })

  it('should toggle date range filters', () => {
    const api = new SearchkitClient()
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
    const api = new SearchkitClient()
    api.addFilter({ identifier: 'released', dateMin: '2020-12-26T00:00:00.000Z', dateMax: null })
    expect(api.getFilters()).toEqual([
      { identifier: 'released', dateMin: '2020-12-26T00:00:00.000Z', dateMax: null }
    ])
    api.toggleFilter({ identifier: 'released', dateMin: '2020-12-26T00:00:00.000Z', dateMax: null })
    expect(api.getFilters()).toEqual([])
  })

  it('should remove multiple filters by id', () => {
    const api = new SearchkitClient()
    api.addFilter({ identifier: 'type', value: 'Movies' })
    api.addFilter({ identifier: 'type', value: 'Games' })
    api.removeFiltersByIdentifier('type')
    expect(api.getFilters()).toEqual([])
  })

  it('should determine whether a filter has been applied or not', () => {
    const api = new SearchkitClient()
    api.addFilter({ identifier: 'type', value: 'Movies' })
    api.addFilter({ identifier: 'type', value: 'Games' })
    expect(api.isFilterSelected({ identifier: 'type', value: 'Movies' })).toBeTruthy()
    expect(api.isFilterSelected({ identifier: 'type', value: 'no match' })).toBeFalsy()
  })

  it('should pass state within callback', () => {
    const callback = jest.fn()
    const api = new SearchkitClient()
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
    const api = new SearchkitClient()
    const wrapper = ({ children }) => <SearchkitProvider client={api}>{children}</SearchkitProvider>

    const { result } = renderHook(() => useSearchkit(), { wrapper })
    act(() => {
      result.current.setQuery('test')
    })
    expect(api.getQuery()).toBe('test')
  })

  it('useSearchQuery', () => {
    const api = new SearchkitClient({ searchOnLoad: true })
    api.setQuery('test')
    api.addFilter({ identifier: 'type', value: 'Movies' })
    api.setSortBy('released')
    api.search = jest.fn()
    const wrapper = ({ children }) => <SearchkitProvider client={api}>{children}</SearchkitProvider>

    renderHook(() => useSearchkitQuery('gqlQuery'), { wrapper })

    expect(useLazyQuery).toHaveBeenCalledWith('gqlQuery', {
      variables: {
        filters: [{ identifier: 'type', value: 'Movies' }],
        page: { from: 0, size: 10 },
        query: 'test',
        sortBy: 'released'
      }
    })
    expect(api.search).toBeCalled()
  })

  it('searchOnLoad', () => {
    ;(useLazyQuery as any).mockReset()
    const api = new SearchkitClient({ searchOnLoad: false })
    api.setQuery('test')
    api.addFilter({ identifier: 'type', value: 'Movies' })
    api.setSortBy('released')
    api.search = jest.fn()
    const wrapper = ({ children }) => <SearchkitProvider client={api}>{children}</SearchkitProvider>

    renderHook(() => useSearchkitQuery('gqlQuery'), { wrapper })
    expect(useLazyQuery).toHaveBeenCalled()
    expect(api.search).not.toBeCalled()
  })
})
