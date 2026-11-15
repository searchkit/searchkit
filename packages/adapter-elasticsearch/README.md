# @searchkit/adapter-elasticsearch

The Elasticsearch adapter for [Searchkit](https://www.searchkit.co). It turns InstantSearch requests into an
Elasticsearch `_msearch` request and the responses back into InstantSearch responses.

`searchkit` and `@searchkit/api` depend on this package and use it by default, so you only need it to pass the
adapter explicitly:

```ts
import API from '@searchkit/api'
import { ElasticsearchAdapter } from '@searchkit/adapter-elasticsearch'

const apiClient = API({
  adapter: ElasticsearchAdapter({ host: 'http://localhost:9200', apiKey: '...' }),
  search_settings: {
    search_attributes: ['title'],
    result_attributes: ['title']
  }
})

// equivalent, and still supported:
API({ connection: { host: 'http://localhost:9200', apiKey: '...' }, search_settings: { ... } })
```

`ElasticsearchAdapter` also accepts a custom transporter (an object with an `msearch` method), like `connection`.

See the [Searchkit documentation](https://www.searchkit.co/docs) for the search settings and request options.
