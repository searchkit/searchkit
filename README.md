## Search, made easy
Searchkit is an open source toolkit which helps you build a great search experience with Elasticsearch.

![api-setup-2](./docs/static/img/m/search.jpeg)

Searchkit is a Graph QL / React UI Component framework to:
  - Quickly build a GraphQL API focused on search UI
  - Out-of-the-box React components
  - A great Search experience without needing to be an expert in Elasticsearch, React and Node 

[Website](https://searchkit.co/) | [View Demo](https://demo.searchkit.co) | [Documentation](https://searchkit.co/docs)

[Read our blog post about Searchkit V3](https://blog.searchkit.co/searchkit-v3-enter-graphql-330e1aa5752d)

### Quick Intro
From a configuration

```js
const searchkitConfig = {
  host: 'http://demo.searchkit.co/api/',
  index: 'movies',
  hits: {
    fields: [ 'title', 'plot', 'poster' ]
  },
  query: new MultiMatchQuery({ 
    fields: [ 'plot','title^4'] 
  }),
  facets: [
    new RefinementSelectFacet({ 
      identifier: 'type',
      field: 'type.raw',
      label: 'Type'
    }),
    new RefinementSelectFacet({
      identifier: 'writers',
      field: 'writers.raw',
      label: 'Writers',
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
```

Will provide a GraphQL API where you can perform queries like:

#### Simple Hits
[Try it out](https://demo.searchkit.co/api/graphql)

```graphql
{
  results(query: "heat") {
    hits {
      items {
        id
        fields {
          title
        }
      }
    }
  }
}
```

#### Facets
[Try it out](https://demo.searchkit.co/api/graphql)

```graphql
{
  results(query: "heat") {
    facets {
      identifier
      label
      type
      display
      entries {
        id
        label
        count
      }
    }
    hits {
      items {
        id
        fields {
          title
        }
      }
    }
  }
}
```

#### Filtering
[Try it out](https://demo.searchkit.co/api/graphql)
```graphql
{
  results(filters: [{identifier: "type", value: "Movie"}, {identifier: "metascore", min: 30}]) {
    facets {
      identifier
      label
      type
      display
      entries {
        id
        label
        count
      }
    }
    hits {
      items {
        id
        fields {
          title
        }
      }
    }
  }
}
```

See [Schema Query Guide](https://searchkit.co/docs/guides/graphql-schema-queries-cheatsheet) for more examples.

#### React Integration
We provide a thin [React client](https://searchkit.co/docs/reference/searchkit-client) which integrates with Searchkit's API, Apollo Client. It maintains search state (pagination, filtering and querying) and calls Apollo client to fetch.

#### React Components

```javascript
import {
  FacetsList,
  SearchBar,
  Pagination,
  ResetSearchButton,
  SelectedFilters
} from '@searchkit/elastic-ui'

const Page = () => {
  const { data, loading } = useSearchkitQuery(query)
  const [viewType, setViewType] = useState('list')
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
            <EuiPageContentHeaderSection>
              <EuiButtonGroup
                options={[
                  {
                    id: `grid`,
                    label: 'Grid'
                  },
                  {
                    id: `list`,
                    label: 'List'
                  }
                ]}
                idSelected={viewType}
                onChange={(id) => setViewType(id)}
              />
            </EuiPageContentHeaderSection>
          </EuiPageContentHeader>
          <EuiPageContentBody>
            {viewType === 'grid' ? <HitsGrid data={data} /> : <HitsList data={data} />}
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

See [quickstart guide](https://searchkit.co/docs/quick-start/ui/eui)

### Example Projects
* Next App with Searchkit & Elastic UI [Code](https://github.com/searchkit/searchkit/tree/next/examples/next) | [Demo](https://demo.searchkit.co)

### NPM Packages
* @searchkit/apollo-resolvers [Documentation](https://searchkit.co/docs/reference/searchkit-apollo-resolvers)
* @searchkit/client [Documentation](https://searchkit.co/docs/reference/searchkit-client)
* @searchkit/elastic-ui [Documentation](https://searchkit.co/docs/reference/searchkit-elastic-ui)

### Sponsors
[*QBOX*](https://www.qbox.io?ref=searchkit) Elasticsearch hosting. They have kindly provided us an elasticsearch instance for our demo site.

### FAQ
#### Can I upgrade from Searchkit v2?
Searchkit has undergone a total rewrite so whilst it should be straightforward to move onto, any code written for searchkit legacy wouldn't work on Searchkit v3.

#### Do I need to expose my Elasticsearch instance to the browser?
No! You dont expose your elasticsearch cluster to the browser, Search API sits in between elasticsearch and the browser.

#### I'm building a Native App / use angular. Do I need to use the Searchkit UI components?
No! Searchkit API provides a dev friendly search API. Searchkit simplifies using elasticsearch for search so that you can build your own UI components very easily. If your apps dont use react or you are building a native mobile app, you can just use the searchkit API. [See our blog article for more information](https://blog.searchkit.co/searchkit-why-graphql-aa886603b698)
