import React from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'

jest.mock('@searchkit/client', () => {
  const originalModule = jest.requireActual('@searchkit/client')
  const api = new originalModule.SearchkitClient()
  return {
    __esModule: true,
    ...originalModule,
    useSearchkit: jest.fn().mockReturnValue(api),
    SearchkitClient: api
  }
})

import { SearchkitClient } from '@searchkit/client'
import renderer from 'react-test-renderer'
import { SearchBar } from '../index'

describe('SearchBar', () => {
  it('renders', () => {
    const x = renderer.create(<SearchBar loading={false} />)
    expect(x.toJSON()).toMatchSnapshot()
  })

  it('Provide search term to api via setQuery', async () => {
    const mockApi: SearchkitClient = SearchkitClient as any
    const searchCall = jest.fn()
    mockApi.setCallbackFn(searchCall)
    render(<SearchBar loading={false} />)
    expect(screen.getByLabelText('Search')).toBeVisible()
    fireEvent.change(screen.getByLabelText('Search'), { target: { value: 'test' } })
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Clear input' })).toBeVisible()
    })
    fireEvent.keyUp(screen.getByLabelText('Search'), {
      key: 'Enter',
      code: 13,
      charCode: 13
    })
    expect(mockApi.getQuery()).toBe('test')
    expect(searchCall).toHaveBeenCalledWith({
      filters: [],
      page: { from: 0, size: 10 },
      query: 'test',
      sortBy: null
    })
  })

  it('api has a query in state', async () => {
    const mockApi: SearchkitClient = SearchkitClient as any
    const searchCall = jest.fn()
    mockApi.setCallbackFn(searchCall)
    mockApi.setQuery('heat')
    render(<SearchBar loading={false} />)
    expect(screen.getByLabelText('Search')).toBeVisible()
    expect(screen.getByLabelText('Search')).toHaveDisplayValue('heat')
  })
})
