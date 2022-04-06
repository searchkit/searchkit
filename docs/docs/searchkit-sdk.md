---
id: searchkit-sdk
title: Searchkit SDK
sidebar_label: '@searchkit/sdk'
slug: /reference/searchkit-sdk
---

## Package Installation

`yarn add @searchkit/sdk`

### Simple Usage

Example below is an example of configuring your query, sortOptions, filters and facets and performing the request. Behind the scenes, Searchkit SDK will generate a query DSL based on your configuration and search criteria, perform the query to Elasticsearch and return you a friendly response for you to use.

SDK is universal. Works on the browser as well on node.js. You can treat it like a SDK client to Elasticsearch.

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

## Connecting to Elasticsearch

You can configure & connect to an Elasticsearch instance without any credentials although its strongly suggested that you do if you're using the SDK within the browser. Below are some of the options you can use to secure the connection between you and Elasticsearch.

### Proxy the search call through your API

If you're using Searchkit SDK directly within the browser and require Elasticsearch to be accesible from the browser, opening up a route on your API that proxies the request through your API could be an option. This means that we are not exposing Elasticsearch on the internet and gives you opportunity to add additional filters to the Elasticsearch query.

### Via API Key

Setting up an apiKey for Elasticsearch and configuring the rights to the apiKey to be read only and restricted to the indicies you're searching on. You are able to do this from within Kibana with Elasticsearch security enabled.

```javascript

const searchkitConfig = {
  host: 'http://127.0.0.1:9200/', // elasticsearch instance url
  connectionOptions: {
    apiKey: "<insert apiKey>
  }
  index: 'movies',
}
```

### Via Headers

You can use the headers configuration object to pass any additional credential information required by the request. Can be used for example to pass JWT token with the request.

```javascript

const searchkitConfig = {
  host: 'http://127.0.0.1:9200/', // elasticsearch instance url
  connectionOptions: {
    headers: {
      authorization: "jwtToken",
      "x-custom-header": "test"
    }
  }
  index: 'movies',
}
```

### Directly to Elasticsearch

Still a viable option but you will need to update Elasticsearch CORS settings to allow requests to be performed from your domain.

## Network Transport

For more advanced use cases, you might want to be able to handle the mechanism of performing the network request yourself. By default, SDK uses fetch but we also have an Elasticsearch client transport should you wish to use that.

#### @elastic/client Transport

```javascript
import ESClientTransporter from '@searchkit/sdk/lib/cjs/transporters/ESClientTransporter';

const skConfig = {
  // ... searchkit configuration
};

const transporter = new ESClientTransporter(skConfig);
const response = await Searchkit(skConfig, transporter).execute({
  hits: {
    from: 0,
    size: 10,
  },
});
```

#### Building your own

You can use any network library of your choice by implementing your own transporter.

```javascript
const skConfig = {
  // ... searchkit configuration
};

class MyCustomTransporter {
  constructor(config) {
    this.config = config;
  }

  async performRequest(requestBody) {
    const response = await fetch(
      this.config.host + '/' + this.config.index + '/_search',
      {
        method: 'POST',
        body: JSON.stringify(requestBody),
      },
    );
    const json = await response.json();
    return json;
  }
}

const transporter = new MyCustomTransporter(skConfig);
const response = await Searchkit(skConfig, transporter).execute({
  hits: {
    from: 0,
    size: 10,
  },
});
```

## Hits API

Performs a query to Elasticsearch returning documents within the index. Searchkit will transform the response into a friendly API

```javascript
const skConfig = {
  host: 'http://127.0.0.1:9200/', // elasticsearch instance url
  index: 'movies', // search indices name
  hits: {
    fields: ['title', 'plot', 'poster'],
    highlightFields: ['title'],
  },
};

const response = await Searchkit(config).execute({
  hits: {
    from: 0,
    size: 10,
    includeRawHit: true,
  },
});
```

example of response

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
        "id": "idofDocument"
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
  "sortedBy": undefined,
  "summary": {
    "appliedFilters": [],
    "disabledFilters": [],
    "query": "",
    "sortOptions": [],
    "total": 4162
  }
}
```

#### Options

| Option | Description |
| :-- | :-- |
| from | page start of the request |
| size | number of hits to return |
| includeRawHit | Boolean. When true, will return the raw elasticsearch document in the response under `rawHit` |

## Query API

Performs a query to Elasticsearch returning documents matching the query within the index. Searchkit will transform the response into a friendly API

```javascript
const skConfig = {
  host: 'http://127.0.0.1:9200/',
  index: 'movies',
  hits: {
    fields: ['title', 'plot', 'poster'],
    highlightFields: ['title'],
  },
  query: new MultiMatchQuery({
    fields: ['plot', 'title^4'],
  }),
};

const response = await Searchkit(config)
  .query('heat')
  .execute({
    hits: {
      from: 0,
      size: 10,
    },
  });
```

#### Options

| Option | Description |
| :-- | :-- |
| fields | fields to be queried. See elasticsearch documentation for more information on options |

#### Example response

```json
{
  "hits": {
    "items": [
      {
        "fields": {
          "title": "heat",
          "plot": "plot text",
          "poster": "http://cdn.url/poster"
        },
        "highlight": {
          "title": "<em>heat</em>"
        },
        "id": "idofDocument"
      }
      // ...9 further items
    ],
    "page": {
      "from": 0,
      "pageNumber": 0,
      "size": 10,
      "total": 11,
      "totalPages": 2
    }
  },
  "sortedBy": undefined,
  "summary": {
    "appliedFilters": [],
    "disabledFilters": [],
    "query": "heat",
    "sortOptions": [],
    "total": 11
  }
}
```

### CustomQuery

Allows you to pass a function which will return an elasticsearch query filter. See [Query DSL](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl.html) for what options are available. This is great for when you have a query in mind to use.

#### Usage

```javascript
import {CustomQuery} from '@searchkit/sdk';

const searchkitConfig = {
  query: new CustomQuery({
    queryFn: (query, qm) => {
      return {
        bool: {
          must: [
            {
              wildcard: {
                field: {
                  value: query + '*',
                  boost: 1.0,
                  rewrite: 'constant_score',
                },
              },
            },
          ],
        },
      };
    },
  }),
};
```

#### Options

| Option | Description |
| :-- | :-- |
| queryFn(query, queryManager) | Function. Returns an array of filters. Query argument is the query string. queryManager argument is a class that keeps the query and filters that have been applied to search. For example you may want to adjust the query DSL based on what filters have been selected |

## Filters

When you want to apply filters to your search and don't want them to be displayed as facets. Some examples could include:

- Adding a search box in UI which applies to one field
- Adding a date range component to UI

### Adding a filter to Searchkit Config

Within the Searchkit config, there is a filters array which allows you to configure one or more filters for your search. Below is an example of adding a term filter to search.

```javascript
const config = {
  host: 'http://localhost:9200',
  index: 'movies',
  hits: {
    fields: ['actors', 'writers'],
  },
  filters: [
    new TermFilter({
      identifier: 'type',
      field: 'type',
      label: 'type',
    }),
    new GeoBoundingBoxFilter({
      identifier: 'location',
      field: 'location',
      label: 'Location',
    }),
    new NumericRangeFilter({
      identifier: 'metascore',
      field: 'metascore',
      label: 'Score',
    }),
  ],
};

const request = Searchkit(config);
const response = await request
  .setFilters([
    {identifier: 'metascore', min: 10, max: 90},
    {
      identifier: 'location',
      geoBoundingBox: {
        topLeft: {lat: 50.73, lon: -75.1},
        bottomRight: {lat: 40.01, lon: -55.12},
      },
    },
    {identifier: 'type', value: 'movies'},
  ])
  .execute({
    facets: true,
    hits: {
      size: 10,
      from: 0,
    },
  });
```

#### Options

| Option | Description |
| :-- | :-- |
| field | field to be used for term filter, preferably a field that is raw, not tokenized |
| identifier | Required to be unique. Used to apply filters on field |
| label | UI label for `appliedFilters` node. |
| display | **Optional**. Used on UI to specify what component to handle filter in `SelectedFilters` |

The filters that you will apply will also be returned in the response under `summary.appliedFilters`.

```json
{
  hits: {
    items: [
      // 10 items
    ],
    "page": {
      "from": 0,
      "pageNumber": 0,
      "size": 10,
      "total": 11,
      "totalPages": 2,
    }
  },
  "sortedBy": undefined,
  "summary": {
    "appliedFilters": [
      {
        "bottomRight": {
          "lat": 40.01,
          "lon": -55.12,
        },
        "display": "GeoBoundingBoxFilter",
        "id": "location_{\\"topLeft\\":{\\"lat\\":50.73,\\"lon\\":-75.1},\\"bottomRight\\":{\\"lat\\":40.01,\\"lon\\":-55.12}}",
        "identifier": "location",
        "label": "Location",
        "topLeft": {
          "lat": 50.73,
          "lon": -75.1,
        }
      },
      {
        "display": "TermFilter",
        "id": "type_movies",
        "identifier": "location",
        "label": "Location",
        "value": "movies"
      },
      {
        "display": "NumericRangeFilter",
        "id": "metascore_10_90",
        "identifier": "metascore",
        "label": "Score",
        "value": "10 - 90"
      },

    ],
    "disabledFilters": [],
    "query": "",
    "sortOptions": [],
    "total": 11,
  },
}
```

## Facets

### RefinementSelectFacet

Returns a list of facet options that can be applied to refine the result set.

#### Usage

```javascript
{
  RefinementSelectFacet
} from '@searchkit/sdk'

const searchkitConfig = {
  ...
  facets: [
    new RefinementSelectFacet({ field: 'type.raw', identifier: 'type', label: 'Type' })
  ]
}

const request = Searchkit(config);
const response = await request
  .setFilters([
    {identifier: 'type', value: 'movies'},
  ])
  .execute({
    facets: true,
    hits: {
      size: 10,
      from: 0,
    },
  });
```

#### Multiple Select (AKA Disjuntive Facet)

Behaves like an OR filter. When configured and a filter is applied, facet will continue to return the same facet options as if the filter wasn't chosen. As more filters are applied, result matches will be of hits that have at least one of the filter values.

#### Facet Value Query

Supports facet values querying via the `execute` function facets option. Great for UIs where you have a large list of options and require search

```javascript
const request = Searchkit(config);
const response = await request.execute({
  facets: [{identifier: 'type', query: 'mo'}],
  hits: {
    size: 10,
    from: 0,
  },
});
```

#### Options

| Option | Description |
| :-- | :-- |
| field | Aggregation field to be used, preferably a field that is raw, not tokenized |
| id | Required to be unique. Used to apply filters on field |
| label | UI label for facet. Used by @searchkit/elastic-ui components |
| MultipleSelect | Boolean. Default False. Filters operates as an OR. See multiple Select for more information |
| size | **Optional**. Controls the number of options displayed. Defaults to 5. |
| display | **Optional**. Used on UI to specify what component to handle facet |
| order | **Optional**. The order for the facet value terms. Can be either `value` (Alphabetical asc order) or `count` (doc_count desc order) |

### HierarchicalMenuFacet

#### Usage

```javascript
{
  HierarchicalMenuFacet
} from '@searchkit/sdk'

const searchkitConfig = {
  ...
  facets: [
    new HierarchicalMenuFacet({
      fields: ['categories.level1', 'categories.level2', 'categories.level3'],
      identifier: 'categories',
      label: 'Categories'
    })
  ]
}

const request = Searchkit(searchkitConfig);
const response = await request
  .setFilters([
    {identifier: 'categories', value: 'Clothing', level: 1},
    {identifier: 'categories', value: 'Shoes', level: 2},
  ])
  .execute({
    facets: true,
    hits: {
      size: 10,
      from: 0
    },
  });
```

### RangeFilterFacet

#### Usage

```javascript
{
  RefinementSelectFacet
} from '@searchkit/sdk'

const searchkitConfig = {
  ...
  facets: [
    new RangeFacet({
      field: 'metaScore',
      identifier: 'metascore',
      label: 'Metascore',
      range: {
        min: 0,
        max: 100,
        interval: 5
      }
    })
  ]
}

const request = Searchkit(searchkitConfig);
const response = await request
  .setFilters([
    {identifier: 'metascore', min: 10, max: 90 },
  ])
  .execute({
    facets: true,
    hits: {
      size: 10,
      from: 0,
    },
  });
```

#### Options

| Option | Description |
| :-- | :-- |
| field | Aggregation field to be used, preferably a field that is raw, not tokenized |
| id | Required to be unique. Used to apply filters on field |
| label | UI label for facet. Used by @searchkit/elastic-ui components |
| range | Object of min, max and interval. Brings back entries between min and max. Number of entries depends on interval |
| display | **Optional**. Used on UI to specify what component to handle facet |

### DateRangeFacet

#### Usage

```javascript
{
  DateRangeFacet
} from '@searchkit/sdk'

const searchkitConfig = {
  ...
  facets: [
    new DateRangeFacet({
      identifier: 'released',
      field: 'released',
      label: 'Released'
    })
  ]
}

const request = Searchkit(searchkitConfig);
const response = await request
  .setFilters([
    {identifier: 'released', dateMin: "10/12/2020", dateMax: "10/12/2021" },
  ])
  .execute({
    facets: true,
    hits: {
      size: 10,
      from: 0,
    },
  });
```

#### Options

| Option | Description |
| :-- | :-- |
| field | Aggregation field to be used, preferably a field that is raw, not tokenized |
| id | Required to be unique. Used to apply filters on field |
| label | UI label for facet. Used by @searchkit/elastic-ui components |
| display | **Optional**. Used on UI to specify what component to handle facet |

### MultiQueryOptionsFacet

#### Usage

```javascript
{
  MultiQueryOptionsFacet
} from '@searchkit/sdk'

const searchkitConfig = {
  ...
  facets: [
    // example of Numeric Range
    new MultiQueryOptionsFacet({
      identifier: 'released',
      field: 'released',
      label: 'Released',
      options: [
        { min: 0, max: 10000, label: '0 - 10000' },
        { min: 100001, max: 500000, label: '100001 - 500000' },
        { min: 500001, max: 1000000, label: '500001 - 1000000' },
        { min: 1000001, max: 5000000, label: '1000001 - 5000000' },
        { min: 5000001, max: 10000000, label: '5000001 - 10000000' },
        { min: 10000001, label: '10000001+' }
      ]
    }),
    // example of value
    new MultiQueryOptionsFacet({
      identifier: 'type',
      field: 'type',
      label: 'Type',
      options: [
        { value: "movie", label: 'Movie' },
        { value: "games", label: 'Games' },
        { value: "shows", label: 'Shows' },
      ]
    }),
    // example of value
    new MultiQueryOptionsFacet({
      identifier: 'age',
      field: 'age',
      label: 'Age',
      options: [
        { dateMin: "10/12/2020", dateMax: "10/12/2021", label: 'Recent' },
        { dateMin: "10/12/1920", dateMax: "10/12/2000", label: 'Vintage' }
      ]
    })
  ]
}

const request = Searchkit(searchkitConfig);
const response = await request
  .setFilters([
    {identifier: 'released', value: "5000001 - 10000000" },
    {identifier: 'age', value: "Recent" },
    {identifier: 'type', value: "movie" },
  ])
  .execute({
    facets: true,
    hits: {
      size: 10,
      from: 0,
    },
  });
```

#### Options

| Option | Description |
| :-- | :-- |
| field | Aggregation field to be used, preferably a field that is raw, not tokenized |
| id | Required to be unique. Used to apply filters on field |
| label | UI label for facet. Used by @searchkit/elastic-ui components |
| display | **Optional**. Used on UI to specify what component to handle facet |
| multipleSelect | **Optional**. Default False. Allows you to choose multiple options which expands the search results |

## Facet Visibility Rules

### VisibleWhen

#### Usage

```javascript
{
  VisibleWhen, FacetSelectedRule
} from '@searchkit/sdk'

facets: [
  new RefinementSelectFacet({ identifier: 'type', field: 'type.raw', label: 'Type' }),
  VisibleWhen(
    [
      new RefinementSelectFacet({
        identifier: 'writers',
        field: 'writers.raw',
        label: 'Writers',
        display: 'override',
        multipleSelect: true
      }),
      new RefinementSelectFacet({
        identifier: 'actors',
        field: 'actors.raw',
        label: 'Actors'
      }),
      new RefinementSelectFacet({
        identifier: 'genres',
        field: 'genres.raw',
        label: 'Genres'
      })
    ],
    [ // All Rules must be satisfied for the facets to be visible
      FacetSelectedRule('type', 'Movie') // Visible only when Movie has been selected in type
    ]
  )
]
```

#### Options

| Option | Description |
| :-- | :-- |
| facets | Required. An Array of facet configurations that will be displayed if the rule is satisfied |
| rules | Required. An array of rules |

### Rule: FacetSelectedRule

#### Usage

```javascript
{
  FacetSelectedRule
} from '@searchkit/schema'

    rules: [
      FacetSelectedRule('type', 'Movie')
    ]
```

| Option | Description |
| :-- | :-- |
| identifier | Required. The facet identifier |
| value | Optional. Without it provided, the rule will be satisfied for any applied filters matching the identifier. With value, will be satisfied for an applied filter with both identifier and value |

### Rule: CustomRule

Allows you to build your own rule. You have access to the queryManager and ctx which are passed as arguments.

#### Usage

```javascript
const customRule = (queryManager, ctx: any) => {
  const userRole = ctx.userRole;
  const filters = queryManager.getFiltersById('collection');
  if (userRole === 'Admin' && filters[0].value === 'People') {
    return true;
  }
  return false;
};
```

## Sorting

To specify what sort order you want. By default its by score.

### Usage

```javascript
import Searchkit, {
  MultiMatchQuery,
  RefinementSelectFacet,
  RangeFacet,
  DateRangeFacet,
  TermFilter,
} from '@searchkit/sdk';

const searchkitConfig = {
  host: 'http://127.0.0.1:9200/', // elasticsearch instance url
  index: 'movies', // search indices name
  hits: {
    fields: ['title', 'plot', 'poster'],
  },
  query: new MultiMatchQuery({
    fields: ['plot', 'title^4'],
  }),
  sortOptions: [
    {id: 'relevance', label: 'Relevance', field: '_score'},
    {
      id: 'released',
      label: 'Recent Releases',
      field: {released: 'desc'},
      defaultOption: true,
    },
    {
      id: 'title-released',
      label: 'Recent titles',
      field: [{released: 'desc'}, {title: 'desc'}],
    },
    {
      id: 'multiple_sort',
      label: 'Multiple sort',
      field: [
        {post_date: {order: 'asc'}},
        'user',
        {name: 'desc'},
        {age: 'desc'},
        '_score',
      ],
    },
  ],
};

const request = Searchkit(config);
const response = await request
  .query('heat')
  .setSortBy('released') // here to set the sort, specifying the id
  .execute({
    hits: {
      size: 10,
      from: 0,
    },
  });
```

#### Options

| Option | Description |
| :-- | :-- |
| id | Unique id. Used to specify what to sort by |
| label | label to be displayed in frontend |
| field | Elasticsearch Sorting field. See above for examples of complex sorting field configurations |
| defaultOption | Boolean. If no sorting option is selected, this will be the sort option chosen as default |

Will give back the sorting name and sorting options in the response

```json
{
  "hits": [...],
  "facets": [...],
  "sortedBy": "released",
  "summary": {
    "appliedFilters": [],
    "disabledFilters": [],
    "query": "test",
    "sortOptions": [
      {
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
      {
        "id": "multiple_sort",
        "label": "Multiple Sort",
      },
    ],
    "total": 4162,
  }
}
```

## postProcessRequest

An escape hatch function which allows you to modify the ES request body before it is sent to elasticsearch

Every search request will pass through this function, containing the full body, and expecting a full request body back.

```javascript
const searchkitConfig = {
  host: 'http://localhost:9200',
  index: 'my_index',
  hits: {
    fields: [],
  },
  query: new MultiMatchQuery({fields: []}),
  postProcessRequest: (body) => {
    return {...body, min_score: 10};
  },
};
```
