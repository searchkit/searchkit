import React from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'

jest.mock('@searchkit/client', () => {
  const originalModule = jest.requireActual('@searchkit/client')

  const createSearchkitClient = () => {
    const state = Object.assign(
      {},
      {
        query: '',
        filters: [],
        sortBy: '',
        page: {
          size: 10,
          from: 0
        }
      }
    )
    const setState = (arg) => {
      Object.assign(state, arg(state))
    }
    const api = new originalModule.SearchkitClient()
    api.setSearchState = setState
    api.searchState = state

    return api
  }

  const api = createSearchkitClient()

  return {
    __esModule: true,
    ...originalModule,
    useSearchkit: jest.fn().mockReturnValue(api),
    SearchkitClient: api
  }
})

import { SearchkitClient } from '@searchkit/client'
import { SortingSelector } from '../index'

describe('sorting selector', () => {
  it('Interaction', async () => {
    const data = {
      hits: {
        sortedBy: 'relevance'
      },
      summary: {
        sortOptions: [
          { id: 'relevance', label: 'Relevance' },
          { id: 'released', label: 'Released' }
        ]
      }
    }

    const mockApi: SearchkitClient = SearchkitClient as any
    const searchCall = jest.fn()
    mockApi.setCallbackFn(searchCall)
    render(<SortingSelector data={data} loading={false} />)
    expect(screen.getByText('Relevance')).toBeVisible()
    fireEvent.click(screen.getByText('Relevance'))
    expect(screen.getByRole('option', { name: 'Released' })).toBeVisible()
    fireEvent.click(screen.getByRole('option', { name: 'Released' }))
    expect(searchCall).toHaveBeenCalledWith({
      filters: [],
      page: { from: 0, size: 10 },
      query: '',
      sortBy: 'released'
    })
  })
})
