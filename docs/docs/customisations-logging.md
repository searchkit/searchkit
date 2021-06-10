---
id: customisations-api-logging
title: Server Logging
sidebar_label: Server Logging
slug: /customisations/server-logging
---

When you want to provide logging so you can monitor demand from a operations perspective or from an analytics prespective, you can build your own graphql plugin which allows you to implement methods that are called in the lifecycle of a request. Here you can monitor on errors, request timings and the query.

For more information about Apollo plugins, see the [Apollo Plugins documentation](https://www.apollographql.com/docs/apollo-server/integrations/plugins/)

```javascript
const { print } = require('graphql');

const myLoggingPlugin = {
  serverWillStart() {
    console.log('Server started!');
  },
  requestDidStart(requestContext) {
    console.log('Request started!');

    return {
      executionDidStart(executionRequestContext) {
        return {
          willResolveField({source, args, context, info}) {
            console.log('Variables', args)
          }
        }
      },
      parsingDidStart(requestContext) {
        console.log('Parsing started!');
      },

      validationDidStart(requestContext) {
        console.log('Validation started!');
      }

    }
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [myLoggingPlugin]
});
```

# Error Logging
Errors can happen for some of the following reasons:
- Elasticsearch Query isn't correct
- Failed to connect to the Elasticsearch Instance
- User is not authorized to view content (see authorization and authentication)

When that happens, GraphQL server will return back errors object in the response, containing information on why it failed and for you to provide UI feedback to the client that this has occurred. When node_env is in Development or Test mode, it will also return the stacktrace in the response but not in production mode. The Error object also contains the raw query in the Error object for you to debug. Apollo GraphQL server provides utility `formatErrors` which allows you to transform the errors before they are sent to the client.

You can also listen for errors via the plugin via [DidEncounterErrors method](https://www.apollographql.com/docs/apollo-server/integrations/plugins/#didencountererrors)

For more information about error logging see [masking and logging errors on Apollo Server](https://www.apollographql.com/docs/apollo-server/data/errors/#masking-and-logging-errors)