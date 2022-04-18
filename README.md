## Search, made easy
Searchkit is an open source toolkit which helps you build a great search experience with Elasticsearch.

See [why use Searchkit](https://searchkit.co/docs/core/overview/why-use-searchkit)

Searchkit to simplify using Elasticsearch for Search:
  - Powerful Browser / Node.js SDK client for Elasticsearch
  - Out-of-the-box React Search State & components
  - Optional Integrations with GraphQL, Node.js REST APIs
  - A great Search experience without needing to be an expert in Elasticsearch


#### Highlights
- [Getting Started Video](https://www.youtube.com/watch?v=4vHibwubrQA)
- [Website](https://searchkit.co/) 
- [View Demo](https://demo.searchkit.co)
- [Documentation](https://searchkit.co/docs)
- [Discord / Live Discussion](https://discord.gg/CRuWmSQZQx)

#### Code Sandbox Examples
* Searchkit SDK & Node Express [Code](https://codesandbox.io/s/searchkit-node-express-js-example-c7bk7e) | [Demo](https://c7bk7e.sse.codesandbox.io/)
* Searchkit SDK & Elastic UI [Code](https://codesandbox.io/s/searchkit-cra-xj25o0) | [Demo](https://xj25o0.csb.app/)
* Searchkit GraphQL & Elastic UI [Code](https://codesandbox.io/s/searchkit-graphql-example-if14fj) | [Demo](https://if14fj.sse.codesandbox.io/) | [GraphQL Playground](https://if14fj.sse.codesandbox.io/api/graphql)

![api-setup-2](./docs/static/img/m/search.jpeg)

### Quick Intro to SDK
From a configuration

```javascript

import Searchkit, { MultiMatchQuery, RefinementSelectFacet, RangeFacet, DateRangeFacet, TermFilter } from '@searchkit/sdk'

const searchkitConfig = {
  host: 'http://127.0.0.1:9200/', // elasticsearch instance url
  index: 'movies', // search indices name
  hits: {
    fields: [ 'title', 'plot', 'poster' ]
  },
  query: new MultiMatchQuery({
    fields: [ 'plot','title^4'],
    highlightFields: ["title"]
  }),
  sortOptions: [
    { id: 'relevance', label: 'Relevance', field: '_score' },
    { id: 'released', label: 'Recent Releases', field: { released: 'desc' } }
  ],
  filters: [
    new TermFilter({
      identifier: "writer",
      field: "writers",
      label: "Writers"
    })
  ],
  facets: [
    new RefinementSelectFacet({
      identifier: 'type',
      field: 'type.raw',
      label: 'Type'
      multipleSelect: true
    }),
    new RangeFacet({
      identifier: 'metascore',
      field: 'metaScore',
      label: 'Metascore',
      range: {
        min: 0,
        max: 100,
        interval: 5
      }
    }),
    new DateRangeFacet({
      identifier: 'released',
      field: 'released',
      label: 'Released'
    })
  ]
}

const request = Searchkit(config)
const response = await request
  .query("heat")
  .setFilters([
    { identifier: "metascore", min: 10, max: 90 },
    { identifier: 'writers', value: 'writer1' },
    { identifier: 'released', dateMin: '2021-01-01T10:10:10.000Z', dateMax: '2022-01-01T10:10:10.000Z' }
  ])
  .setSortBy("released")
  .execute({
    facets: true,
    hits: {
      size: 10,
      from: 0
    }
  })

```

Will provide a response like this

```json

{
  "hits": {
    "items": [
      {
        "fields": {
          "title": "title",
          "plot": "plot text",
          "poster": "http://cdn.url/poster"
        },
        "highlight": {},
        "id": "1"
      }
      // ...9 further items
    ],
    "page": {
      "from": 0,
      "pageNumber": 0,
      "size": 10,
      "total": 4162,
      "totalPages": 417
    }
  },
"facets": [
    {
      "display": "ListFacet",
      "entries": [
        {
          "count": 83,
          "label": "J.J. Abrams",
        },
        {
          "count": 74,
          "label": "Jeffrey Lieber",
        },
        {
          "count": 73,
          "label": "Damon Lindelof",
        },
        {
          "count": 53,
          "label": "James Manos Jr.",
        },
        {
          "count": 53,
          "label": "Jeff Lindsay",
        },
      ],
      "identifier": "writers",
      "label": "Writers",
      "type": "RefinementSelectFacet",
    },
    {
      "display": "ListFacet",
      "entries": [
        {
          "count": 73,
          "label": "Naveen Andrews",
        },
        {
          "count": 56,
          "label": "Jennifer Carpenter",
        },
        {
          "count": 56,
          "label": "Michael C. Hall",
        },
        {
          "count": 53,
          "label": "Emilie de Ravin",
        },
        {
          "count": 42,
          "label": "Jared Padalecki",
        },
      ],
      "identifier": "actors",
      "label": "Actors",
      "type": "RefinementSelectFacet",
    },
  ],
  "sortedBy": "released",
  "summary": {
    "appliedFilters": [
      {
        "display": "ListFacet",
        "id": "writers_writer1",
        "identifier": "writers",
        "label": "Writers",
        "type": "ValueSelectedFilter",
        "value": "writer1",
      },
      {
        "display": "ListFacet",
        "id": "actors_actors",
        "identifier": "actors",
        "label": "Actors",
        "type": "ValueSelectedFilter",
        "value": "actors",
      },
      {
        "display": "RangeFacet",
        "id": "actors_actors",
        "identifier": "metascore",
        "label": "Metascore",
        "type": "ValueSelectedFilter",
        "min": "10",
        "max": "90"
      },
    ],
    "disabledFilters": [],
    "query": "heat",
    "sortOptions": [{
        "id": "relevance",
        "label": "Relevance",
      },
      {
        "id": "released",
        "label": "Recent Releases",
      },
      {
        "id": "title-released",
        "label": "Recent Titles",
      },
    ],
    "total": 4162
  }
}
```

#### React Integration
We provide a thin [React client](https://searchkit.co/docs/core/reference/searchkit-client) which integrates with Searchkit's SDK or Searchkit GraphQL API. It maintains search state (pagination, filtering and querying) and provides SearchState via a hook.

#### React Components

```javascript
import {
  FacetsList,
  SearchBar,
  Pagination,
  ResetSearchButton,
  SelectedFilters
} from '@searchkit/elastic-ui'

import { useSearchkitSDK } from '@searchkit/sdk/lib/esm/react-hooks'
import { useSearchkitVariables } from '@searchkit/client'

const Page = () => {
  const variables = useSearchkitVariables()
  const { data, loading } = useSearchkitSDK(config, variables)
  const Facets = FacetsList([])
  return (
    <EuiPage>
      <EuiPageSideBar>
        <SearchBar loading={loading} />
        <EuiHorizontalRule margin="m" />
        <Facets data={data?.results} loading={loading} />
      </EuiPageSideBar>
      <EuiPageBody component="div">
        <EuiPageHeader>
          <EuiPageHeaderSection>
            <EuiTitle size="l">
              <SelectedFilters data={data?.results} loading={loading} />
            </EuiTitle>
          </EuiPageHeaderSection>
          <EuiPageHeaderSection>
            <ResetSearchButton loading={loading} />
          </EuiPageHeaderSection>
        </EuiPageHeader>
        <EuiPageContent>
          <EuiPageContentHeader>
            <EuiPageContentHeaderSection>
              <EuiTitle size="s">
                <h2>{data?.results.summary.total} Results</h2>
              </EuiTitle>
            </EuiPageContentHeaderSection>
          </EuiPageContentHeader>
          <EuiPageContentBody>
            <HitsList data={data} />
            <EuiFlexGroup justifyContent="spaceAround">
              <Pagination data={data?.results} />
            </EuiFlexGroup>
          </EuiPageContentBody>
        </EuiPageContent>
      </EuiPageBody>
    </EuiPage>
  )
}
```

See [quickstart guide](https://searchkit.co/docs/core/overview/quick-start-guide)

### NPM Packages
* @searchkit/sdk [Documentation](https://searchkit.co/docs/core/reference/searchkit-sdk)
* @searchkit/schema [Documentation](https://searchkit.co/docs/graphql/overview)
* @searchkit/client [Documentation]((https://searchkit.co/docs/core/reference/searchkit-client)
* @searchkit/elastic-ui [Documentation](https://searchkit.co/docs/core/reference/searchkit-elastic-ui)


### Sponsors
[*QBOX*](https://www.qbox.io?ref=searchkit) Elasticsearch hosting. They have kindly provided us an elasticsearch instance for our demo site.

### FAQ
#### Can I upgrade from Searchkit v2?
Searchkit has undergone a total rewrite so whilst it should be straightforward to move onto, any code written for searchkit legacy wouldn't work on Searchkit v3.


#### Do I need to expose my Elasticsearch instance to the browser?
No! You dont expose your elasticsearch cluster to the browser, you can use the Search GraphQL API that sits in between elasticsearch and the browser.

#### Do I need to run a Node.js Server?
No! You can use the searchkit/sdk within the browser too.
