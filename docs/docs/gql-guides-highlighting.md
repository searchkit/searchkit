---
id: gql-guides-highlighting
title: Highlighting Fields
sidebar_label: Highlighting Fields
slug: /graphql/guides/highlighting-fields
---

To receive ElasticSearch highlights for your matches you need to do the followings:

1. Add `highlightedFields` under `hits` for your Searchkit config. Here you may list the name of fields for which you want to get highlights, or an object where you specify the field name and the highlight configuration according to the [ElasticSearch highlighting](https://www.elastic.co/guide/en/elasticsearch/reference/current/highlighting.html) documentation
2. Add a `highlight` field to your `ResultHit` graphql schema type
3. When configuring ApolloServer specify a custom resolver for `highlight`

The following example generates a JSON encoded string version of the highlight objects received from ElasticSearch. You may specify another shape for `highlight` in your `ResultHit` type and a matching transformation of `hit.highlight` in your resolver.

```js
const searchkitConfig = {
  host: 'http://localhost:9200/', // elasticsearch instance url
  index: 'movies',
  hits: {
    fields: [ 'title', 'plot', 'poster' ],
    highlightedFields: [
      'title',
      {
        field: 'plot',
        config: {
          pre_tags: ['<b>'],
          post_tags: ['</b>']
        }
      }
    ]
  },
  query: new MultiMatchQuery({
    fields: [ 'plot','title^4']
  }),
  facets: [
    ...
  ]
}

const { typeDefs, withSearchkitResolvers, context } = SearchkitSchema({
  config: searchkitConfig,
  typeName: 'ResultSet',
  hitTypeName: 'ResultHit',
  addToQueryType: true
})

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
      highlight: String
    }
  `, ...typeDefs
  ],
  resolvers: withSearchkitResolvers({
    ResultHit: {
      highlight: (hit: any) => JSON.stringify(hit.highlight)
    }
  }),
  introspection: true,
  playground: true,
  context: {
    ...context
  }
})
```
