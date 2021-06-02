---
id: guides-geo-search
title: Geo Location Search Filtering
sidebar_label: Geo Location Search Filtering
slug: /guides/filtering-with-geo-location-search
---

Searchkit supports the ability to Geosearch hits with elasticsearch. [View Demo](https://demo.searchkit.co/us-parks) of this functionality 

## Index
Start by indexing locations using the geo_point type. Here is an example of indexing the geo_point data available here. https://github.com/searchkit/searchkit/blob/next/examples/indexer/parks/config.ts#L48-L56

## Setting up the API
First import the GeoBoudingBoxFilter from @searchkit/schema

```javascipt
import {
  GeoBoundingBoxFilter
} from '@searchkit/schema'
```

then configure the GeoFilter filter within the filters configuration within the Searchkit API Configuration.

```javascript

const usParksConfig = {
  host: process.env.ES_HOST || 'http://localhost:9200',
  index: 'us_parks',
  hits: {
    fields: [
      'title',
      'location'
    ]
  },
  query: new MultiMatchQuery({ fields: ['title'] }),
  filters: [
    new GeoBoundingBoxFilter({
      field: 'location',
      label: "Location",
      identifier: "location"
    })
  ],
  facets: [
    new RefinementSelectFacet({
      field: 'states',
      identifier: 'states',
      label: "States",
      multipleSelect: true
    })
  ]
}
```

## Querying the API

Then you will be able to filter the results by a geo location

```graphql
{
  result(filters: [
    {
      identifier: "location",
      geoBoundingBox: {
        topLeft: {
          lat: 70.73,
          lon: -95.1
        }
        bottomRight: {
          lat: 10.01,
          lon: -65.12
        }
      }
    }
  ]) {
    hits {
      items {
        id
        ... on ParkResultHit {
          fields {
						title
            location
          }
        }
      }
    }
  }
}
```

Searchkit doesn't provide UI components around geo-searching capabilities but pretty straight forward to implement it. We have an example of geo-search components using searchkit here




