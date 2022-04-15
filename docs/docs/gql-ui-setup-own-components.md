---
id: ui-setup-own-components
title: With your Components
sidebar_label: With your Components
slug: /graphql/quick-start/ui/your-components
---

This guide will step you through how to use the searchkit client API to build your own UI components, for those who want to integrate searchkit into their own UI.

Also see [Create React App](https://codesandbox.io/s/searchkit-create-react-app-xj25o0) if you're not using NextJS.

### Search Input Component

Below example of how a simple search query component can be built using the searchkit client API. When search is invoked, the API will perform a new query.

```javascript
import React from 'react';
import {useSearchkitQueryValue} from '@searchkit/client';

const SearchInput = () => {
  const api = useSearchkit();
  const [value, setValue] = useSearchkitQueryValue();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        api.setQuery(value);
        api.search();
      }}>
      <input
        type="text"
        value={value}
        onChange={(e) => {
          const inputValue = e.target.value;
          setValue(inputValue);
        }}
      />
    </form>
  );
};
```

### Facet Component

Facets are configured on the server API. The configuration controls their order, their size and label. This makes the client side extremely simple.

First we implement code to render each facet and their facet options and then we implement toggling facets which call the searchkit client API

```javascript
import React, {useState} from 'react';
import {useSearchkit} from '@searchkit/client';

const RefinementFacet = ({facet}) => {
  const api = useSearchkit();
  return (
    <div key={facet.identifier}>
      <span>{facet.label}</span>
      <ol>
        {facet.entries.map((entry) => {
          const isSelected = api.isFilterSelected({
            identifier: facet.identifier,
            value: entry.label,
          });
          return (
            <li
              className={isSelected ? 'selected' : ''}
              key={entry.label}
              onClick={() => {
                api.toggleFilter({
                  identifier: facet.identifier,
                  value: entry.label,
                });
                api.search();
              }}>
              {entry.label} - {entry.count}
            </li>
          );
        })}
      </ol>
    </div>
  );
};

const FacetsList = ({data, loading}) => {
  return (
    <div>
      {data.facets.map((facet) => {
        return <RefinementFacet facet={facet} loading={loading} />;
      })}
    </div>
  );
};
```

### Adding components to the page

```javascript
import {gql} from '@apollo/client';
import {useSearchkit, useSearchkitVariables} from '@searchkit/client';
import withApollo from '../lib/withApollo';
import {useState} from 'react';
import {SearchInput, Facets} from './components';

const QUERY = gql`
  query resultSet(
    $query: String
    $filters: [SKFiltersSet]
    $page: SKPageInput
    $sortBy: String
  ) {
    results(query: $query, filters: $filters) {
      hits(page: $page, sortBy: $sortBy) {
        items {
          ... on ResultHit {
            id
            fields {
              title
            }
          }
        }
      }
      facets {
        identifier
        type
        label
        display
        entries {
          label
          count
        }
      }
    }
  }
`;

const Index = () => {
  const variables = useSearchkitVariables();
  const {
    previousData,
    data = previousData,
    loading,
  } = useQuery(QUERY, {
    variables,
  });

  if (loading || !data) {
    return <h1>loading...</h1>;
  }
  return (
    <div>
      <SearchInput />
      <div className="facets">
        <Facets data={data.results} loading={loading} />
      </div>
      <div className="results">
        {data.results.hits.items.map((item) => {
          return (
            <div>
              id: {item.id}, title: {item.fields.title}
            </div>
          );
        })}
      </div>
    </div>
  );
};
```
