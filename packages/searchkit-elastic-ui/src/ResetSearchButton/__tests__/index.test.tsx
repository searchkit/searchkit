import React from 'react'
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

import renderer from 'react-test-renderer'
import { ResetSearchButton } from '../index'

describe('ResetSearchButton', () => {
  it('renders', () => {
    const x = renderer.create(<ResetSearchButton loading={false} />)
    expect(x.toJSON()).toMatchSnapshot()
  })

  // it('Provide search term to api via setQuery', async () => {
  //   render(<SearchBar loading={false} />)
  //   expect(screen.getByLabelText('Search')).toBeVisible()
  //   fireEvent.change(screen.getByLabelText('Search'), { target: { value: 'test' } })
  //   await waitFor(() => {
  //     expect(screen.getByRole('button', { name: 'Clear input' })).toBeVisible()
  //   })
  //   fireEvent.keyUp(screen.getByLabelText('Search'), {
  //     key: 'Enter',
  //     code: 13,
  //     charCode: 13
  //   })
  //   const mockApi: SearchkitClient = SearchkitClient as any
  //   expect(mockApi.getQuery()).toBe('test')
  //   expect(mockApi.onSearch).toHaveBeenCalledWith({
  //     filters: [],
  //     page: { from: 0, size: 10 },
  //     query: 'test'
  //   })
  // })
})
