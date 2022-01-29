import React, { useEffect } from 'react'
import isEqual from 'fast-deep-equal'
import qs from 'qs'
import history, { Router, RouteState, defaultParseURL, defaultCreateURL } from './history'
import {
  useSearchkitVariables,
  useSearchkit,
  searchStateEqual,
  SearchkitRoutingOptionsContext
} from './searchkit'
import type { SearchState } from './searchkit'

const sanitiseRouteState = (routeState) => {
  const intKeys = ['size', 'from']
  for (const key of intKeys) {
    if (routeState[key] !== undefined && typeof routeState[key] === 'string') {
      routeState[key] = parseInt(routeState[key])
    }
  }
  return routeState
}

export const routeStateEqual = (a, b) => isEqual(sanitiseRouteState(a), sanitiseRouteState(b))

export const stateToRouteFn = (searchState) => {
  const routeState = {
    query: searchState.query,
    sort: searchState.sortBy,
    filters: searchState.filters,
    size: parseInt(searchState.page?.size),
    from: parseInt(searchState.page?.from)
  }
  return Object.keys(routeState).reduce((sum, key) => {
    if (
      (Array.isArray(routeState[key]) && routeState[key].length > 0) ||
      (!Array.isArray(routeState[key]) && !!routeState[key])
    ) {
      sum[key] = routeState[key]
    }
    return sum
  }, {})
}

export const routeToStateFn = (routeState) => ({
  query: routeState.query || '',
  sortBy: routeState.sort || '',
  filters: routeState.filters || [],
  page: {
    size: Number(routeState.size) || 10,
    from: Number(routeState.from) || 0
  }
})

export default function withSearchkitRouting(
  Page,
  {
    stateToRoute = stateToRouteFn,
    routeToState = routeToStateFn,
    createURL = defaultCreateURL,
    parseURL = defaultParseURL,
    router = null
  } = {}
) {
  let routingInstance = router

  const getRouting = (): Router => {
    if (routingInstance) return routingInstance
    if (typeof window === 'undefined') {
      return null
    }
    routingInstance = history({ createURL, parseURL })

    return routingInstance
  }

  const routingOptions = {
    stateToRoute,
    routeToState,
    createURL: (config) => createURL({ ...config, qsModule: qs }),
    parseURL: (config) => parseURL({ ...config, qsModule: qs })
  }

  const withSearchkitRouting = (props) => {
    const searchkitVariables = useSearchkitVariables()
    const api = useSearchkit()

    useEffect(() => {
      const router = getRouting()
      if (router) {
        const routeState: RouteState = stateToRoute(searchkitVariables)
        const currentRouteState = {
          size: api.baseSearchState.page?.size,
          ...router.read()
        }
        if (!routeStateEqual(currentRouteState, routeState)) {
          router.write(routeState, true)
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
      api.search()

      return function cleanup() {
        router.dispose()
      }
    }, [])

    return (
      <SearchkitRoutingOptionsContext.Provider value={routingOptions}>
        <Page {...props} />
      </SearchkitRoutingOptionsContext.Provider>
    )
  }

  withSearchkitRouting.getInitialProps = async (pageCtx) => {
    let props
    const ctx = 'Component' in pageCtx ? pageCtx.ctx : pageCtx
    const searchkitClient = pageCtx.searchkitClient

    if (Page.getInitialProps) {
      props = await Page.getInitialProps(ctx)
    }

    const mockLocation = {
      hostname: ctx.req?.headers.host,
      href: ctx.asPath,
      pathname: ctx.pathname,
      search: ctx.asPath.substring(ctx.pathname.length)
    } as Location

    const searchState: SearchState = routeToState(
      routingOptions.parseURL({ location: mockLocation })
    )
    searchkitClient.updateBaseSearchState(searchState)

    return {
      ...props,
      searchState
    }
  }

  return withSearchkitRouting
}
