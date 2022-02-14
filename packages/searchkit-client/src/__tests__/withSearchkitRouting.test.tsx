import { render, screen } from '@testing-library/react'
import React from 'react'
import withSearchkitRouting, {
  routeStateEqual,
  stateToRouteFn,
  routeToStateFn
} from '../withSearchkitRouting'
import { searchStateEqual } from '../searchkit'
import type { SearchState } from '../searchkit'
import history, { Router } from '../history'
import { SearchkitClient, withSearchkit } from '..'

describe('withSearchkitRouting', () => {
  describe('searchStateEqual', () => {
    it('query', () => {
      const searchStateA: SearchState = {
        filters: [{ identifier: 'type', value: 'Movies' }],
        page: { from: 0, size: 10 },
        query: 'test',
        sortBy: 'released'
      }

      const searchStateB: SearchState = {
        filters: [{ identifier: 'type', value: 'Movies' }],
        page: { from: 0, size: 10 },
        query: '',
        sortBy: 'released'
      }

      expect(searchStateEqual(searchStateA, searchStateB)).toBe(false)
      searchStateB.query = 'test'
      expect(searchStateEqual(searchStateA, searchStateB)).toBe(true)
      searchStateB.sortBy = 'bla'
      expect(searchStateEqual(searchStateA, searchStateB)).toBe(false)
      searchStateB.sortBy = 'released'
      expect(searchStateEqual(searchStateA, searchStateB)).toBe(true)
    })

    it('page options', () => {
      const searchStateA: SearchState = {
        filters: [{ identifier: 'type', value: 'Movies' }],
        page: { from: 0, size: 10 },
        query: 'test',
        sortBy: 'released'
      }

      const searchStateB: SearchState = {
        filters: [{ identifier: 'type', value: 'Movies' }],
        page: { from: 0, size: 15 },
        query: 'test',
        sortBy: 'released'
      }

      expect(searchStateEqual(searchStateA, searchStateB)).toBe(false)
      searchStateB.page.size = 10
      expect(searchStateEqual(searchStateA, searchStateB)).toBe(true)
      searchStateB.page.from = 10
      expect(searchStateEqual(searchStateA, searchStateB)).toBe(false)
    })

    it('filters', () => {
      const searchStateA: SearchState = {
        filters: [],
        page: { from: 0, size: 10 },
        query: 'test',
        sortBy: 'released'
      }

      const searchStateB: SearchState = {
        filters: [{ identifier: 'type', value: 'Movies' }],
        page: { from: 0, size: 10 },
        query: 'test',
        sortBy: 'released'
      }

      expect(searchStateEqual(searchStateA, searchStateB)).toBe(false)

      searchStateA.filters = [{ identifier: 'type', value: 'Bla' }]
      expect(searchStateEqual(searchStateA, searchStateB)).toBe(false)

      searchStateA.filters = [{ identifier: 'type', value: 'Movies' }]
      expect(searchStateEqual(searchStateA, searchStateB)).toBe(true)

      searchStateA.filters = [{ identifier: 'type', value: 'Movies' }]
      searchStateB.filters = [{ identifier: 'bla', value: 'Movies' }]
      expect(searchStateEqual(searchStateA, searchStateB)).toBe(false)

      searchStateA.filters = [{ identifier: 'type', value: 'Movies' }]
      searchStateB.filters = [{ identifier: 'bla', value: 'Movies' }]
      expect(searchStateEqual(searchStateA, searchStateB)).toBe(false)

      searchStateA.filters = [
        { identifier: 'type', value: 'Movies' },
        { identifier: 'type2', value: 'Movies' }
      ]
      searchStateB.filters = [
        { identifier: 'type', value: 'Movies' },
        { identifier: 'type3', value: 'Movies' }
      ]
      expect(searchStateEqual(searchStateA, searchStateB)).toBe(false)
    })
  })

  describe('routeStateEqual', () => {
    it('query', () => {
      const routeStateA = {
        query: ''
      }
      const routeStateB = {
        query: ''
      }
      expect(routeStateEqual(routeStateA, routeStateB)).toBe(true)

      routeStateB.query = 'h'
      expect(routeStateEqual(routeStateA, routeStateB)).toBe(false)

      delete routeStateB.query
      expect(routeStateEqual(routeStateA, routeStateB)).toBe(false)
    })
    it('page options', () => {
      const routeStateA = {
        size: 1
      }
      const routeStateB = {
        size: 1
      }
      expect(routeStateEqual(routeStateA, routeStateB)).toBe(true)
      routeStateB.size = 10
      expect(routeStateEqual(routeStateA, routeStateB)).toBe(false)
    })
    it('page options with incorrect size and from type', () => {
      // function should also work with incorrect types
      const routeStateA = {
        size: '1',
        from: '10'
      }
      const routeStateB = {
        size: 1,
        from: 10
      }
      expect(routeStateEqual(routeStateA, routeStateB)).toBe(true)
      routeStateB.size = 10
      expect(routeStateEqual(routeStateA, routeStateB)).toBe(false)
    })
    it('filters', () => {
      const routeStateA = {
        filters: [{ identifier: 'type', value: 'movie' }]
      }
      const routeStateB = {
        filters: [{ identifier: 'type', value: 'movie' }]
      }
      expect(routeStateEqual(routeStateA, routeStateB)).toBe(true)
    })
  })

  describe('Routing functions', () => {
    describe('serialising / deserialising state to url', () => {
      const router = history()
      const searchState: Partial<SearchState> = {
        query: 'test',
        filters: [{ identifier: 'type', value: 'movie' }],
        sortBy: 'released',
        page: {
          from: 0,
          size: 10
        }
      }
      const routeState = stateToRouteFn(searchState)
      const url = router.createURL(routeState)
      expect(url).toMatchInlineSnapshot(
        `"http://localhost/?query=test&sort=released&filters%5B0%5D%5Bidentifier%5D=type&filters%5B0%5D%5Bvalue%5D=movie&size=10"`
      )
      delete window.location
      window.location = new URL(url) as any
      expect(routeToStateFn(routeState)).toMatchObject(searchState)
    })
  })

  describe('url SearchState / RouteState sync hooks', () => {
    it('should not call router write if the route state is the same', () => {
      const api = new SearchkitClient()
      const routerWriteMock = jest.fn().mockImplementation(() => {})
      const routerOnUpdateMock = jest.fn().mockImplementation(() => {})

      const Components = withSearchkit(
        withSearchkitRouting(() => <div />, {
          router: {
            read: () => ({}),
            write: routerWriteMock,
            onUpdate: routerOnUpdateMock,
            dispose: () => {}
          }
        }),
        () => api
      )

      render(<Components />)
      expect(routerWriteMock).toHaveBeenCalledTimes(0)
    })
  })
})
