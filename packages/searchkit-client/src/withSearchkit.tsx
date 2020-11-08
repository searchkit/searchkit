import React from 'react'
import { SearchkitProvider, SearchkitClient } from './searchkit'

const defaultSearchkitClient = () => new SearchkitClient()
let _client = null

export default (Page, createSearchkitClient = defaultSearchkitClient) => {
  const getClient = () => {
    if (typeof window === 'undefined') {
      return createSearchkitClient()
    }
    if (!_client) {
      _client = createSearchkitClient()
    }
    return _client
  }

  return () => (
    <SearchkitProvider client={getClient()}>
      <Page />
    </SearchkitProvider>
  )
}
