---
id: v2-v3-migration
title: V2 to V3 Migration
sidebar_label: V2 Migration
slug: /guides/v2-v3-migration
---

Guide to help ease migrating your app from v2 to v3 of searchkit. The biggest change is that we have introduced a middle layer between elasticsearch and the browser. This middle layer requires node to be running Apollo Server with Searchkit's apollo-resolvers installed. 

For the UI, we provide out the box react components which works with the API tier to provide a great out the box search experience. 

### API
[Code example](https://github.com/searchkit/searchkit/blob/next/examples/next/pages/api/graphql.js)

With NextJS, its straightforward to setup this middle layer. See [API Setup](https://searchkit.co/docs/quick-start/api-setup) and follow the steps. 

If you dont use next but use node express to serve the the frontend app, you can add apollo to by following [this guide](https://www.apollographql.com/docs/apollo-server/v1/servers/express/)  

Then V3 configuration and where some of the configuration will be. Some components do not exist yet (NumericRefinementListFilter, HierarchicalMenuFilter for example do not exist)

```javascript
const searchkitConfig = {
  // see host passed in as argument to SearchkitManager
  host: 'http://localhost:9200',
  index: 'movies',
  hits: {
    fields: ['title', 'actors', 'writers', 'plot', 'poster']
  },
  query: new MultiMatchQuery({
    // see v2 SearchBox queryFields prop
    fields: ['actors', 'writers', 'title^4', 'plot'] 
  }),
  facets: [
    // known as RefinementListFilter component
    // for OR operator, use multipleSelect boolean
    new RefinementSelectFacet({ 
      identifier: 'type', 
      field: 'type.raw', 
      label: 'Type', 
      multipleSelect: false,
      display: "ListFacet" // component display. Currently support a ListFacet or ComboBoxFacet
    }),

    // known as RangeFilter. Similar options as to props
    // showHistogram is currently always enabled, design slightly different
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
```
### Frontend
[Code Example](https://github.com/searchkit/searchkit/blob/next/examples/next/components/index.jsx)

Then update the frontend app with the new react components. @searchkit/elastic-ui components. Follow the guide on [UI Setup](https://searchkit.co/docs/quick-start/ui/setup)
