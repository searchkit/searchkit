import { useSearchkit } from '@searchkit/client'
import { EuiPagination } from '@elastic/eui'
import React from 'react'

export const Pagination = ({ data }) => {
  const api = useSearchkit()

  return (
    <EuiPagination
      aria-label="Pagination"
      pageCount={data?.hits.page.totalPages}
      activePage={data?.hits.page.pageNumber}
      onPageClick={(activePage) => {
        api.setPage({ size: data.hits.page.size, from: activePage * data.hits.page.size })
        api.search()
      }}
    />
  )
}
