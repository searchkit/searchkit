import React from 'react'
import { render, fireEvent, waitFor, screen, act } from '@testing-library/react'

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

jest.mock('@apollo/client', () => {
  const originalModule = jest.requireActual('@apollo/client')
  const queryMockFn = jest.fn().mockReturnValue({
    data: {
      results: {
        facet: {
          entries: [
            { id: 'turkey', label: 'turkey', count: 10 },
            { id: 'Tunisa', label: 'Tunisa', count: 50 }
          ]
        }
      }
    }
  })
  return {
    __esModule: true,
    ...originalModule,
    useApolloClient: jest.fn().mockImplementation(() => ({
      query: queryMockFn
    })),
    queryMockFn
  }
})

import { SearchkitClient } from '@searchkit/client'
import { useApolloClient } from '@apollo/client'
import { ComboBoxFacet } from '../index'

describe('ComboBox Facet', () => {
  it('Interaction', async () => {
    const data = {
      identifier: 'countries',
      label: 'Countries',
      entries: [
        { id: 'countries_usa', label: 'usa', count: 20 },
        { id: 'countries_turkey', label: 'turkey', count: 10 },
        { id: 'countries_UK', label: 'UK', count: 50 },
        { id: 'countries_Canada', label: 'Canada', count: 30 },
        { id: 'countries_Vietnam', label: 'Vietnam', count: 2 }
      ]
    }

    const queryMockFn = jest.fn().mockReturnValue({
      data: {
        results: {
          facet: {
            entries: [
              { id: 'countries_turkey', label: 'turkey', count: 10 },
              { id: 'countries_Tunisa', label: 'Tunisa', count: 50 }
            ]
          }
        }
      }
    })

    const mockApi: SearchkitClient = SearchkitClient as any
    const searchCall = jest.fn()
    mockApi.setCallbackFn(searchCall)
    render(<ComboBoxFacet facet={data} />)
    expect(screen.getByText('Search Countries')).toBeVisible()
    act(() => {
      fireEvent.change(screen.getByRole('textbox'), { target: { value: 't' } })
    })
    await waitFor(() => {
      expect(screen.getByRole('option', { name: 'turkey' })).toBeVisible()
    })
    // act(() => {
    // 	fireEvent.click(screen.getByRole('option', { name: 'turkey' }))
    // })
  })
})
