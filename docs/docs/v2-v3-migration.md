---
id: v2-v3-migration
title: V2 to V3 Migration
sidebar_label: V2 Migration
slug: /core/guides/v2-v3-migration
---

Guide to help ease migrating your app from v2 to v3 of searchkit. For the UI, we provide out the box react components which works with searchkit's SDK to provide a great out the box search experience.

Here is an example of Searchkit being used in Create React App template

[code sandbox example](https://codesandbox.io/s/searchkit-create-react-app-xj25o0)

### Configuration

Then V3 configuration and where some of the configuration will be.

```javascript
const searchkitConfig = {
  // see host passed in as argument to SearchkitManager
  host: 'http://localhost:9200',
  index: 'movies',
  hits: {
    fields: ['title', 'actors', 'writers', 'plot', 'poster'],
  },
  query: new MultiMatchQuery({
    // see v2 SearchBox queryFields prop
    fields: ['actors', 'writers', 'title^4', 'plot'],
  }),
  facets: [
    // known as RefinementListFilter component
    // for OR operator, use multipleSelect boolean
    new RefinementSelectFacet({
      identifier: 'type',
      field: 'type.raw',
      label: 'Type',
      multipleSelect: false,
      display: 'ListFacet', // component display. Currently support a ListFacet or ComboBoxFacet
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
        interval: 5,
      },
    }),
  ],
};
```
