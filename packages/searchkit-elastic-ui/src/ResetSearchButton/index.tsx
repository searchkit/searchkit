import { useSearchkit } from '@searchkit/client'
import { EuiButtonEmpty } from '@elastic/eui'
import React from 'react'

export const ResetSearchButton = ({ loading }) => {
  const api = useSearchkit()

  return (
    <EuiButtonEmpty
      disabled={!api.canResetSearch()}
      isLoading={loading}
      onClick={() => {
        api.setQuery('')
        api.search()
      }}
    >
      Reset Search
    </EuiButtonEmpty>
  )
}
