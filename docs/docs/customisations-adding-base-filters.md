---
id: customisations-add-base-filters
title: Adding base filters
sidebar_label: Adding base filters
slug: /customisations/add-base-filters
---

You want to apply search filters based on who or where the request is coming from. With `getBaseFilters`, you can return an array of filters to apply to the elasticsearch request.

The arguments are the same as the resolvers, where you can access the request context, parent object and args. for more information on resolvers, see [resolvers documentation](https://www.apollographql.com/docs/apollo-server/data/resolvers/)

In this example we show how you could apply a user's role to the search which comes from the user's JWT auth token. For more information on how to do JWT authentication in apollo, see [apollo authorization documentation](https://www.apollographql.com/docs/apollo-server/security/authentication/)

```javascript
  const { typeDefs, withSearchkitResolvers, context } = SearchkitSchema({
  config: searchkitConfig,
  typeName: 'ResultSet',
  hitTypeName: 'ResultHit',
  getBaseFilters: (parent, parameters, ctx, info) => {
    return [
      { term: { "account": parent.accountId }},
      { term: { "role": ctx.user.role }}
    ]
  }
})
```