import { renderHook, act } from '@testing-library/react-hooks'
import React from 'react'
import { useQuery } from '@apollo/client'
import {
  SearchkitClient,
  SearchkitContext,
  SearchkitProvider,
  useSearchkit,
  useSearchkitQuery
} from '../searchkit'

jest.mock('@apollo/client', () => ({
  useQuery: jest.fn()
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
    expect(api.getFiltersById('anId')).toEqual([])
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
    api.addFilter({ id: 'type', value: 'Movie' })
    expect(api.getFilters()).toEqual([{ id: 'type', value: 'Movie' }])
    expect(api.getFiltersById('type')).toEqual([{ id: 'type', value: 'Movie' }])
    expect(api.getFiltersById('missing')).toEqual([])
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
    api.addFilter({ id: 'type', value: 'Movies' })
    api.addFilter({ id: 'type', value: 'Games' })
    expect(api.getFilters()).toEqual([
      { id: 'type', value: 'Games' },
      { id: 'type', value: 'Movies' }
    ])
    api.toggleFilter({ id: 'type', value: 'Movies' })
    expect(api.getFilters()).toEqual([{ id: 'type', value: 'Games' }])
    api.toggleFilter({ id: 'type', value: 'Movies' })
    expect(api.getFilters()).toEqual([
      { id: 'type', value: 'Movies' },
      { id: 'type', value: 'Games' }
    ])
  })

  it('should remove multiple filters by id', () => {
    const api = new SearchkitClient()
    api.addFilter({ id: 'type', value: 'Movies' })
    api.addFilter({ id: 'type', value: 'Games' })
    api.removeFiltersById('type')
    expect(api.getFilters()).toEqual([])
  })

  it('should determine whether a filter has been applied or not', () => {
    const api = new SearchkitClient()
    api.addFilter({ id: 'type', value: 'Movies' })
    api.addFilter({ id: 'type', value: 'Games' })
    expect(api.isFilterSelected({ id: 'type', value: 'Movies' })).toBeTruthy()
    expect(api.isFilterSelected({ id: 'type', value: 'no match' })).toBeFalsy()
  })

  it('should pass state within callback', () => {
    const callback = jest.fn()
    const api = new SearchkitClient()
    api.setCallbackFn(callback)
    api.setQuery('test')
    api.addFilter({ id: 'type', value: 'Movies' })
    api.setPage({ from: 10, size: 20 })
    api.setSortBy('released')
    api.search()
    expect(callback).toBeCalledWith({
      filters: [{ id: 'type', value: 'Movies' }],
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
    const api = new SearchkitClient()
    api.setQuery('test')
    api.addFilter({ id: 'type', value: 'Movies' })
    api.setSortBy('released')
    const wrapper = ({ children }) => <SearchkitProvider client={api}>{children}</SearchkitProvider>

    renderHook(() => useSearchkitQuery('gqlQuery'), { wrapper })
    act(() => {
      api.search()
    })
    expect(useQuery).toHaveBeenCalledWith('gqlQuery', {
      fetchPolicy: 'network-only',
      variables: {
        filters: [{ id: 'type', value: 'Movies' }],
        page: { from: 0, size: 10 },
        query: 'test',
        sortBy: 'released'
      }
    })
  })
})
