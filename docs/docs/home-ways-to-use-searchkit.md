---
id: home-how-to-use-searchkit
title: Why use Searchkit?
sidebar_label: Why use Searchkit?
slug: /core/overview/why-use-searchkit
keywords:
  [
    React,
    Elasticsearch,
    Express.JS,
    Typescript,
    GraphQL,
    GraphQL React Elasticsearch,
  ]
description: Why would you use Searchkit
---

Searchkit is an open source toolkit offering modules to simplify building search experiences with Elasticsearch. You do not need to use all the features of Searchkit, only the parts you need. Searchkit is composed of 4 packages:

### @searchkit/sdk

A typescript based Elasticsearch SDK built for Search Experiences. Can run on both node.js or within the browser.

#### Why should I use it?

Provides an inituative API geared towards building Search experiences. You dont need to learn how to use Elasticsearch aggregations, query relevance and filtering, you simply configure your Search experience should be with our out-the-box facets, query & filter handlers and you get back a developer friendly response for you to render your UI.

### @searchkit/client

A typescript React Search State Management library.

#### Why should I use it?

Simplifies managing Search state across your components. Manages the Search state on the URL, preserving browser history + bookmarkable links. Provides you search state variables via react hook (query, chosen sort, page, filters).

### @searchkit/elastic-ui

React Search UI components based on EUI. Uses the @searchkit/client State API.

#### Why should I use it?

Quickly build a Search interface. Can also use it as example code to build your own equivalent Search UI components.

### @searchkit/schema

A GraphQL schema integration which uses @searchkit/sdk under the hood.

#### Why should I use it?

Quickly implement a GraphQL Search API with Apollo.

## How could I use Searchkit in my application?

### I have a node API

You can use `@searchkit/sdk` to integrate with your existing API. You can implement a route which takes in a search criteria payload (Example: `@searchkit/client` Search State variables) and perform a request with the SDK. You also have the option to enrich the Searchkit response from other sources within your API route.

If you're using React on the client side, you can use `@searchkit/client` to manage the Search state between your UI components and provide the search criteria variables to your API route.

See [Node.js Code Sandbox Example](https://codesandbox.io/s/searchkit-node-express-js-example-c7bk7e) for a simple usage example.

### I have an API but do not use Node.js

You can use `@searchkit/sdk` on the browser to perform Elasticsearch queries and add a new route on your API to proxy the request through your API. On your API route, you can implement additional logic such as:

- adding additional filters to the query
- lift the hit's ids from the Elasticsearch response and perform queries from other data sources to enrich the response
- Hide the Elasticsearch instance from the public internet

If you're using React on the client side, you can use `@searchkit/client` to manage the Search state between your UI components and provide the search criteria variables to `@searchkit/sdk`.

See [Browser based CodeSandbox Example](https://codesandbox.io/s/searchkit-cra-xj25o0) for a simple usage example.

### I do not have an API

You could use `@searchkit/sdk` or `@searchkit/schema` to build a REST / GraphQL API with node.js on serverless. If thats not an option, you could call Elasticsearch directly from the browser. If you choose this option, setup and use an apiKey which restricts access and privilages to Elasticsearch.

See [Browser based CodeSandbox Example](https://codesandbox.io/s/searchkit-cra-xj25o0) for a simple usage example.
