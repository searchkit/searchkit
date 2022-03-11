---
id: setup-basic-setup
title: Quick Setup
sidebar_label: Quick Setup
slug: /quick-start/basic-setup
keywords: [Elasticsearch, Elasticsearch indexing]
description: Setup Searchkit
---

## Setup an Elasticsarch Instance

The easiest way is to signup to [Elastic cloud](https://www.elastic.co/cloud/) and setup a new Elasticsearch instance. Alternatively you can setup an instance via [Docker](https://www.elastic.co/guide/en/elasticsearch/reference/current/docker.html)

## Indexing your data

See [Indexing Guide](https://searchkit.co/docs/guides/elasticsearch-setup-indexing) to setup Elasticsearch and index the data corpus to be searched by searchkit.

## Setup Base Project

In this tutorial, we are going to use [Create React App](https://reactjs.org/docs/create-a-new-react-app.html). Follow the following steps to create a boilerplate app.

```
npx create-react-app my-app
cd my-app
npm start
```

## Step 1: Searchkit Configuration

### Add Searchkit Provider

Once your boilerplate app has been setup, open the index.js file and add the Searchkit Provider.

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {SearchkitClient, SearchkitProvider} from '@searchkit/client';

const skClient = new SearchkitClient();

ReactDOM.render(
  <React.StrictMode>
    <SearchkitProvider client={skClient}>
      <App />
    </SearchkitProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
```

### Add the Searchkit Hook

Create a new file called `useSearchkitSDK.js` and copy and paste this hook example code.

```javascript
import Searchkit from '@searchkit/sdk';
import {useSearchkitVariables} from '@searchkit/client';
import {useState, useEffect} from 'react';

const useSearchkitSDK = (config) => {
  const variables = useSearchkitVariables();
  const [results, setResponse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const request = Searchkit(config)
        .query(variables.query)
        .setFilters(variables.filters)
        .setSortBy(variables.sortBy);

      const response = await request.execute({
        facets: true,
        hits: {
          size: variables.page.size,
          from: variables.page.from,
        },
      });
      setLoading(false);
      setResponse(response);
    }

    fetchData();
  }, [variables]);

  return {results, loading};
};

export default useSearchkitSDK;
```

### Add Searchkit Code

Within the App.js file, add the configuration code for Searchkit. Should look similar to below. See [@searchkit/sdk](https://searchkit.co/docs/reference/searchkit-sdk) on how to configure Searchkit.

```javascript
import {
  DateRangeFacet,
  MultiMatchQuery,
  RangeFacet,
  RefinementSelectFacet,
} from '@searchkit/sdk';
import useSearchkitSDK from './useSearchkitSDK';

const config = {
  host: '<elasticsearch-host-url>',
  connectionOptions: {
    apiKey: '<api-key>', // optional - depends how you wish to connect to elasticsearch.
  },
  index: 'imdb_movies',
  hits: {
    fields: ['title'],
  },
  query: new MultiMatchQuery({
    fields: [
      'title',
      'genres',
      'directors',
      'writers',
      'actors',
      'countries',
      'plot',
    ],
  }),
  facets: [
    new RefinementSelectFacet({
      field: 'type',
      identifier: 'type',
      label: 'Type',
      multipleSelect: true,
    }),
  ],
};

function App() {
  const {results, loading} = useSearchkitSDK(config);
  return <div>results {results?.summary?.total}</div>;
}
```

### Milestone

Verify that results count are displayed. If not, you might have an issue with connection between Elasticsearch and your browser. By opening the network tab within developer tools, you will be able to see the Searchkit request performs to Elasticsearch.

Common problems include:

- CORS errors (solution is to enable CORS headers to Elasticsearch or proxy your Elasticsearch request through your API)
- Authentication Errors (check you have setup your apiKey correctly)

## Step 2: Add Searchkit Components

Next step is to put the search components in to make it interactive.

### Add the EUI components to the page

Add the below imports

```javascript
import {
  FacetsList,
  SearchBar,
  ResetSearchButton,
  SelectedFilters,
  Pagination,
} from '@searchkit/elastic-ui';

import {
  EuiPage,
  EuiFlexGrid,
  EuiPageBody,
  EuiPageContent,
  EuiPageContentBody,
  EuiPageContentHeader,
  EuiPageContentHeaderSection,
  EuiPageHeader,
  EuiPageHeaderSection,
  EuiPageSideBar,
  EuiTitle,
  EuiHorizontalRule,
  EuiText,
  EuiFlexGroup,
  EuiFlexItem,
} from '@elastic/eui';

import '@elastic/eui/dist/eui_theme_light.css';
```

Add the component which will render your results

```javascript
const HitsList = ({data}) => (
  <EuiFlexGrid>
    {data?.hits.items.map((hit) => (
      <EuiFlexItem key={hit.id}>
        <EuiFlexGroup gutterSize="xl">
          <EuiFlexItem>
            <EuiFlexGroup>
              <EuiFlexItem grow={false}>
                <img
                  src={hit.fields.poster}
                  alt="Nature"
                  style={{height: '150px'}}
                />
              </EuiFlexItem>
              <EuiFlexItem grow={4}>
                <EuiTitle size="xs">
                  <h6>{hit.fields.title}</h6>
                </EuiTitle>
                <EuiText grow={false}>
                  <p>{hit.fields.plot}</p>
                </EuiText>
              </EuiFlexItem>
              <EuiFlexItem grow={2}>
                <EuiText grow={false}>
                  <ul>
                    <li>
                      <b>ACTORS: </b>
                      {hit.fields.actors.join(', ')}
                    </li>

                    <li>
                      <b>WRITERS: </b>
                      {hit.fields.writers.join(', ')}
                    </li>
                  </ul>
                </EuiText>
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiFlexItem>
    ))}
  </EuiFlexGrid>
);
```

Replace the code within App function to use the EUI & Searchkit components.

```javascript
function App() {
  const Facets = FacetsList([]);
  const {results, loading} = useSearchkitSDK(config);
  return (
    <EuiPage>
      <EuiPageSideBar>
        <SearchBar loading={loading} />
        <EuiHorizontalRule margin="m" />
        <Facets data={results} loading={loading} />
      </EuiPageSideBar>
      <EuiPageBody component="div">
        <EuiPageHeader>
          <EuiPageHeaderSection>
            <EuiTitle size="l">
              <SelectedFilters data={results} loading={loading} />
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
                <h2>{results?.summary.total} Results</h2>
              </EuiTitle>
            </EuiPageContentHeaderSection>
          </EuiPageContentHeader>
          <EuiPageContentBody>
            <HitsList data={results} />
            <EuiFlexGroup justifyContent="spaceAround">
              <Pagination data={results} />
            </EuiFlexGroup>
          </EuiPageContentBody>
        </EuiPageContent>
      </EuiPageBody>
    </EuiPage>
  );
}
```

### Milestone

You should now see your results!

## Step 3: Url Persistance

Update your index.js file to use the routing HOC

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {withSearchkit, withSearchkitRouting} from '@searchkit/client';

const SearchkitApp = withSearchkit(withSearchkitRouting(App));

ReactDOM.render(
  <React.StrictMode>
    <SearchkitApp />
  </React.StrictMode>,
  document.getElementById('root'),
);
```
