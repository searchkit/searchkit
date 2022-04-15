---
id: gql-customisations-permissions
title: Authentication & Authorisation
sidebar_label: Authentication & Authorisation
slug: /graphql/customisations/authentication-and-authorisation
keywords:
  [
    Elasticsearch GraphQL API,
    Searchkit Permissions,
    Searchkit Authorizations,
    Searchkit Filtering,
  ]
description: Authorization and authentication for Searchkit
---

You want to apply search filters based on who or where the request is coming from. With `getBaseFilters`, you can return an array of filters to apply to the elasticsearch request.

The arguments are the same as the resolvers, where you can access the request context, parent object and args. for more information on resolvers, see [resolvers documentation](https://www.apollographql.com/docs/apollo-server/data/resolvers/)

In this example we show how you could apply a user's role to the search which comes from the user's JWT auth token. For more information on how to do JWT authentication in apollo, see [apollo authorization documentation](https://www.apollographql.com/docs/apollo-server/security/authentication/)

```javascript
const {typeDefs, withSearchkitResolvers, context} = SearchkitSchema({
  config: searchkitConfig,
  typeName: 'ResultSet',
  hitTypeName: 'ResultHit',
  getBaseFilters: (parent, parameters, ctx, info) => {
    const user = ctx.user;
    return [{term: {account: user.accountId}}, {term: {role: user.role}}];
  },
});

const {ApolloServer} = require('apollo-server');

const server = new ApolloServer({
  typeDefs,
  resolvers: withSearchkitResolvers({}),
  context: async ({req}) => {
    // Note: This example uses the `req` argument to access headers,
    // but the arguments received by `context` vary by integration.
    // This means they vary for Express, Koa, Lambda, etc.
    //
    // To find out the correct arguments for a specific integration,
    // see https://www.apollographql.com/docs/apollo-server/api/apollo-server/#middleware-specific-context-fields

    // Get the user token from the headers.
    const token = req.headers.authorization || '';

    // Try to retrieve a user with the token
    const user = await getUser(token);

    // Add the user to the context + searchkit context
    return {
      user,
      ...context,
    };
  },
});
```
