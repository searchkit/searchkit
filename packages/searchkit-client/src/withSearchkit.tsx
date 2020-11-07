import React from 'react'
import { SearchkitProvider, SearchkitClient } from './searchkit'

const defaultSearchkitClient = () => new SearchkitClient()

export default (Page, createSearchkitClient = defaultSearchkitClient) => {
  const client = createSearchkitClient()
  return () => (
    <SearchkitProvider client={client}>
      <Page />
    </SearchkitProvider>
  )
}
