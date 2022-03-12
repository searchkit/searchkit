import { useEffect, useState } from 'react'
import Searchkit, { SearchkitConfig } from '../'
import { SearchkitResponse } from '../transformers'

export const useSearchkitSDK = (
  config: SearchkitConfig,
  variables
): { results: SearchkitResponse; loading: boolean } => {
  const [results, setResponse] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData(variables) {
      setLoading(true)
      const request = Searchkit(config)
        .query(variables.query)
        .setFilters(variables.filters)
        .setSortBy(variables.sortBy)

      const response = await request.execute({
        facets: true,
        hits: {
          size: variables.page.size,
          from: variables.page.from
        }
      })
      setLoading(false)
      setResponse(response)
    }

    variables && fetchData(variables)
  }, [variables])

  return { results, loading }
}
