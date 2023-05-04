
## Setup

**Requirements**
Behavioral Analytics plugin requires Elasticsearch 8.8.0 or higher.

Follow the getting started guide to setup Behavioral Analytics.  

Add the plugin to your project:

```bash
yarn add @searchkit/elastic-behavioral-analytics-plugin
```

### Example with Instantsearch.js

```js

import { AnalyticsMiddleware } from '@searchkit/elastic-behavioral-analytics-plugin'

const search = instantsearch({
  indexName: 'imdb_movies',
  searchClient: searchClient
})

search.addWidgets([
  // ... widgets ...
])

search.use(
  AnalyticsMiddleware({
    tracker: {
      endpoint: 'http://localhost:9200',
      collectionName: 'website',
      apiKey: 'apikey'
    },
    attributes: {
      searchClick: {
        titleField: 'title',
        urlField: 'poster'
      }
    }
  })
)
```

### Example with Instantsearch React Hooks

Similar to [Algolia insights](https://www.algolia.com/doc/api-reference/widgets/insights/react-hooks/#examples) is used.

```js
import { AnalyticsMiddleware } from '@searchkit/elastic-behavioral-analytics-plugin'
import { useInstantSearch } from 'react-instantsearch-hooks-web';
import { useLayoutEffect } from 'react';
import Client from '@searchkit/instantsearch-client'; 

function InsightsMiddleware() {
  const { use } = useInstantSearch();

  useLayoutEffect(() => {
    const middleware = AnalyticsMiddleware({
      tracker: {
        endpoint: 'http://localhost:9200',
        collectionName: 'website',
        apiKey: 'apikey'
      },
      attributes: {
        searchClick: {
          titleField: 'title',
          urlField: 'poster'
        }
      }
    })

    return use(middleware);
  }, [use]);

  return null;
}

const searchClient = Client({
  url: '/api/product-search'
});

function App() {
  return (
    <InstantSearch indexName="instant_search" searchClient={searchClient}>
      {/* ... */}
      <InsightsMiddleware />
    </InstantSearch>
  );
}
```
