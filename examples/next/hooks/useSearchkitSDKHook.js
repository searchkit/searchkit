import Searchkit from '@searchkit/sdk'
import { useSearchkitVariables } from '@searchkit/client';
import { useState } from 'react';
import { useEffect } from 'react';

const useSearchkitSDK = (config) => {
  const variables = useSearchkitVariables()
  const [results, setResponse] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    async function fetchData(variables) {
      setLoading(true)
      const request = Searchkit(config).query(variables.query).setFilters(variables.filters).setSortBy(variables.sortBy)

      const response = await request.execute({
        facets: true,
        hits: {
          size: variables?.page?.size,
          from: variables?.page?.from
        }
      })
      setLoading(false)
      setResponse(response)
    }

    variables && fetchData(variables)
  }, [variables])

  return { results, loading }
}

export default useSearchkitSDK