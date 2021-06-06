import { render, screen } from '@testing-library/react'
import React from 'react'
import { withSearchkit, withSearchkitRouting, SearchkitClient } from '../index'
import { FilterLink, PaginationLink } from '../components'

describe('components', () => {
  it('FilterLink component', async () => {
    const api = new SearchkitClient()
    api.updateBaseSearchState({
      query: 'test',
      filters: [{ identifier: 'type', value: 'shows' }],
      sortBy: 'released'
    })

    const Components = withSearchkit(
      withSearchkitRouting(
        () => <FilterLink filter={{ identifier: 'type', value: 'movie' }}>link</FilterLink>,
        {
          parseURL: () =>
            // override default url -> routeState with existing state
            ({
              query: 'test',
              filters: [{ identifier: 'type', value: 'shows' }],
              sort: 'released'
            })
        }
      ),
      () => api
    )

    const x = render(<Components />)

    expect(screen.getByText('link').getAttribute('href')).toMatchInlineSnapshot(
      `"?query=test&sort=released&filters%5B0%5D%5Bidentifier%5D=type&filters%5B0%5D%5Bvalue%5D=movie&filters%5B1%5D%5Bidentifier%5D=type&filters%5B1%5D%5Bvalue%5D=shows&size=10"`
    )
    screen.getByText('link').click()
    expect(api.searchState).toMatchInlineSnapshot(`
      Object {
        "filters": Array [
          Object {
            "identifier": "type",
            "value": "movie",
          },
          Object {
            "identifier": "type",
            "value": "shows",
          },
        ],
        "page": Object {
          "from": 0,
          "size": 10,
        },
        "query": "test",
        "sortBy": "released",
      }
    `)
  })

  it('FilterLink component - without routing', async () => {
    const api = new SearchkitClient()
    api.updateBaseSearchState({
      query: 'test',
      filters: [{ identifier: 'type', value: 'shows' }],
      sortBy: 'released'
    })

    const Components = withSearchkit(
      () => <FilterLink filter={{ identifier: 'type', value: 'movie' }}>link</FilterLink>,
      () => api
    )

    render(<Components />)

    expect(screen.getByText('link').getAttribute('href')).toBeNull()
    screen.getByText('link').click()
    expect(api.searchState).toMatchInlineSnapshot(`
      Object {
        "filters": Array [
          Object {
            "identifier": "type",
            "value": "movie",
          },
          Object {
            "identifier": "type",
            "value": "shows",
          },
        ],
        "page": Object {
          "from": 0,
          "size": 10,
        },
        "query": "test",
        "sortBy": "released",
      }
    `)
  })

  it('PaginationLink component - without routing', async () => {
    const api = new SearchkitClient()
    api.updateBaseSearchState({
      page: {
        from: 0,
        size: 20
      }
    })

    const Components = withSearchkit(
      () => <PaginationLink page={3}>link</PaginationLink>,
      () => api
    )

    render(<Components />)

    expect(screen.getByText('link').getAttribute('href')).toBeNull()
    screen.getByText('link').click()
    expect(api.searchState).toMatchInlineSnapshot(`
      Object {
        "filters": Array [],
        "page": Object {
          "from": 40,
          "size": 20,
        },
        "query": "",
        "sortBy": "",
      }
    `)
  })

  it('Pagination component - with routing', async () => {
    const api = new SearchkitClient()
    api.updateBaseSearchState({
      query: 'test',
      page: {
        from: 20,
        size: 10
      }
    })

    const Components = withSearchkit(
      withSearchkitRouting(() => <PaginationLink page={3}>link</PaginationLink>, {
        parseURL: () =>
          // override default url -> routeState with existing state
          ({
            query: 'test',
            page: {
              from: 20,
              size: 10
            }
          })
      }),
      () => api
    )

    const x = render(<Components />)

    expect(screen.getByText('link').getAttribute('href')).toMatchInlineSnapshot(
      `"?query=test&size=10&from=20"`
    )
    screen.getByText('link').click()
    expect(api.searchState).toMatchInlineSnapshot(`
      Object {
        "filters": Array [],
        "page": Object {
          "from": 20,
          "size": 10,
        },
        "query": "test",
        "sortBy": "",
      }
    `)
  })
})
