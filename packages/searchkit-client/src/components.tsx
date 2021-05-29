import React from 'react'
import { createSearchState, useSearchkit, useSearchkitRoutingOptions, useSearchkitVariables } from './searchkit'

interface FilterLinkProps {
  filter: any
  resetPagination?: boolean
  children: React.ReactChildren
}

interface PaginationLinkProps {
  page: number
  children: React.ReactChildren
}

function isModifiedEvent(event: React.MouseEvent): boolean {
  const { target } = event.currentTarget as HTMLAnchorElement
  return (
    (target && target !== '_self') ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey || // triggers resource download
    (event.nativeEvent && event.nativeEvent.which === 2)
  )
}

export function FilterLink({ filter, resetPagination = true, children }: FilterLinkProps) {
  const api = useSearchkit()
  const variables = useSearchkitVariables()
  const routingOptions = useSearchkitRoutingOptions()
  let href

  if (routingOptions) {
    const scs = createSearchState(variables)
    scs.toggleFilter(filter)
    if (resetPagination) scs.resetPage()
    const nextRouteState = routingOptions.stateToRoute(scs.searchState)
    href = routingOptions.createURL({ routeState: nextRouteState })
  }

  const clickHandler = (e) => {
    const { nodeName } = e.currentTarget

    if (nodeName === 'A' && isModifiedEvent(e)) {
      // ignore click for browser’s default behavior
      return
    }

    e.preventDefault()

    api.toggleFilter(filter)
    if (resetPagination) api.resetPage()
    api.search()
  }

  return (
    <a href={href} onClick={clickHandler}>{children}</a>
  )

}

export function PaginationLink({ page, children }: PaginationLinkProps) {
  const api = useSearchkit()
  const variables = useSearchkitVariables()
  const routingOptions = useSearchkitRoutingOptions()
  const from = variables.page.size * (page - 1)
  let href

  if (routingOptions) {
    const scs = createSearchState(variables)
    scs.setPage({
      from,
      size: variables.page.size
    })
    const nextRouteState = routingOptions.stateToRoute(scs.searchState)
    href = routingOptions.createURL({ routeState: nextRouteState })
  }

  const clickHandler = (e) => {
    const { nodeName } = e.currentTarget

    if (nodeName === 'A' && isModifiedEvent(e)) {
      // ignore click for browser’s default behavior
      return
    }

    e.preventDefault()

    api.setPage({
      from,
      size: variables.page.size
    })
    api.search()
  }

  return (
    <a href={href} onClick={clickHandler}>{children}</a>
  )

  }
