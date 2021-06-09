import React from 'react'
import { SearchkitProvider, SearchkitClient } from './searchkit'

const defaultSearchkitClient = () => new SearchkitClient()

export default (Page, createSearchkitClient = defaultSearchkitClient) => {
  let _client = null

  const getClient = (): SearchkitClient => {
    if (!_client) {
      _client = createSearchkitClient()
    }
    return _client
  }

  const withSearchkit = (props) => {
    const client = getClient()
    if (props.searchState) {
      const searchState = props.searchState
      client.updateBaseSearchState(searchState)
    }
    return (
      <SearchkitProvider client={getClient()}>
        <Page {...props} />
      </SearchkitProvider>
    )
  }

  withSearchkit.getInitialProps = (ctx) => {
    ctx.searchkitClient = getClient()
    if (Page.getInitialProps) {
      return Page.getInitialProps(ctx)
    }
    return {}
  }

  return withSearchkit
}
