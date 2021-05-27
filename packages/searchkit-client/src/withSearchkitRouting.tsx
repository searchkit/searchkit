import React, { useEffect } from 'react'
import { isArray } from 'lodash'
import history, { Router, RouteState } from './history'
import { useSearchkitVariables, useSearchkit, searchStateEqual } from './searchkit'
import type { SearchState } from './searchkit'

export const routeStateEqual = (a, b) =>
  Object.entries(a).toString() === Object.entries(b).toString()

export const stateToRouteFn = (searchState) => {
  const routeState = {
    query: searchState.query,
    sort: searchState.sortBy,
    filters: searchState.filters,
    size: Number(searchState.page?.size),
    from: Number(searchState.page?.from)
  }
  return Object.keys(routeState).reduce((sum, key) => {
    if (
      (isArray(routeState[key]) && routeState[key].length > 0) ||
      (!isArray(routeState[key]) && !!routeState[key])
    ) {
      sum[key] = routeState[key]
    }
    return sum
  }, {})
}

export const routeToStateFn = (routeState) => ({
  query: routeState.query || '',
  sortBy: routeState.sort,
  filters: routeState.filters || [],
  page: {
    size: Number(routeState.size) || 10,
    from: Number(routeState.from) || 0
  }
})

export default function withSearchkitRouting(
  Page,
  { stateToRoute = stateToRouteFn, routeToState = routeToStateFn } = {}
) {
  let routingInstance = undefined

  const getRouting = (): Router => {
    if (routingInstance) return routingInstance
    if (typeof window === 'undefined') {
      return null
    }
    routingInstance = history()

    return routingInstance
  }

  const withSearchkitRouting = () => {
    const searchkitVariables = useSearchkitVariables()
    const api = useSearchkit()

    useEffect(() => {
      const router = getRouting()
      if (router) {
        const routeState: RouteState = stateToRoute(searchkitVariables)
        const currentRouteState = router.read()
        if (!routeStateEqual(currentRouteState, routeState)) {
          router.write(routeState)
        }
      }
    }, [searchkitVariables])

    useEffect(() => {
      const router = getRouting()
      const routeToSearchFn = (routeState) => {
        const searchState: SearchState = routeToState(routeState)
        if (!searchStateEqual(searchState, api.searchState)) {
          api.setSearchState(searchState)
          api.search()
        }
      }
      if (router) {
        router.onUpdate(routeToSearchFn)
      }
      const routeState = router.read()
      const searchState: SearchState = routeToState(routeState)
      api.setSearchState(searchState)

      return function cleanup() {
        router.dispose()
      }
    }, [])

    return <Page />
  }

  withSearchkitRouting.getInitialProps = async (ctx) => {
    let props
    if (Page.getInitialProps) {
      props = await Page.getInitialProps(ctx)
    }
    const searchState: SearchState = routeToState(ctx.query)
    ctx.searchkitClient.updateBaseSearchState(searchState)

    return {
      ...props,
      searchState: searchState
    }
  }

  return withSearchkitRouting
}
