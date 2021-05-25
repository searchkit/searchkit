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
    useSearchkitQueryValue: jest.fn().mockReturnValue(['', () => {}]),
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
})
