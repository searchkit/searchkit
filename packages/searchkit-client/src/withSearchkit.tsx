import React from 'react'
import { SearchkitProvider, Searchkit } from './searchkit'

const defaultSearchkitClient = () => new Searchkit()

export default (Page, createSearchkitClient = defaultSearchkitClient) => {
  const client = createSearchkitClient()
  return () => (
    <SearchkitProvider client={client}>
      <Page />
    </SearchkitProvider>
  )
}
