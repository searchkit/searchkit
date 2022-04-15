---
id: gql-graphql-overview
title: Overview
sidebar_label: Overview
slug: /graphql/overview
keywords: [Search UI, Elasticsearch Search UI, React Search Components]
description: Searchkit is an open source search toolkit built with Elasticsearch, GraphQL and React.
---

### GraphQL Integration

```js
const searchkitConfig = {
  host: 'http://localhost:9200/', // elasticsearch instance url
  index: 'movies',
  hits: {
    fields: ['title', 'plot', 'poster'],
  },
  query: new MultiMatchQuery({
    fields: ['plot', 'title^4'],
  }),
  facets: [
    new RefinementSelectFacet({
      identifier: 'type',
      field: 'type.raw',
      label: 'Type',
    }),
    new RefinementSelectFacet({
      identifier: 'writers',
      field: 'writers.raw',
      label: 'Writers',
      multipleSelect: true,
    }),
    new RangeFacet({
      identifier: 'metascore',
      field: 'metaScore',
      label: 'Metascore',
      range: {
        min: 0,
        max: 100,
        interval: 5,
      },
    }),
    new DateRangeFacet({
      identifier: 'released',
      field: 'released',
      label: 'Released',
    }),
  ],
};

const {typeDefs, withSearchkitResolvers, context} = SearchkitSchema({
  config: searchkitConfig,
  typeName: 'ResultSet',
  hitTypeName: 'ResultHit',
  addToQueryType: true,
});

const server = new ApolloServer({
  typeDefs: [
    gql`
      type Query {
        root: String
      }

      type HitFields {
        title: String
      }

      type ResultHit implements SKHit {
        id: ID!
        fields: HitFields
      }
    `,
    ...typeDefs,
  ],
  resolvers: withSearchkitResolvers({}),
  introspection: true,
  playground: true,
  context: {
    ...context,
  },
});
```
