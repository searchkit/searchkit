# Great search experiences, made easy.
Searchkit is an open source library which helps you build a great search experience with **Elasticsearch**.

Works with React, Vue, Angular, and more.

[Website](https://beta.searchkit.co/) | [Demos](https://beta.searchkit.co/demos) | [Documentation](https://beta.searchkit.co/docs/getting-started) | [Discord](https://discord.gg/CRuWmSQZQx)

**Searchkit to simplify using Elasticsearch for Search:**
  - Support for **Edge Function Platforms** like Cloudflare and Vercel Edge functions
  - Integrates with Instantsearch UI components for React, Vue, Angular, and more
  - A great Search experience without needing to be an expert in Elasticsearch
  - GraphQL Support (coming soon!)

## How it works
Searchkit uses Elasticsearch and provides an API that allows you to build a search experience with Algolia Instantsearch.

![overview](apps/web/public/searchkit-overview.png)


#### Code Sandbox Examples
* react-Instantsearch + Next.JS + Searchkit [LINK](https://codesandbox.io/s/beta-react-instantsearch-next-js-searchkit-dxz0v3)
* Instantsearch.js + Searchkit [LINK](https://codesandbox.io/s/beta-instantsearch-js-searchkit-b2oo1u)

### How you can use it

Once you have indexed your data in Elasticsearch, you can use Searchkit and instantsearch to query your data and display it in your app.

#### Install the package
Installing both the API and instantsearch-client is easy. You can install them with npm or yarn.

  ```bash
  npm install @searchkit/api @searchkit/instantsearch-client
  ```

#### Setup an API

This creates an API which transforms the instantsearch requests sent from the browser into Elasticsearch queries and transforms the responses into instantsearch results.

```ts
import API from "@searchkit/api";
import { NextApiRequest, NextApiResponse } from "next";

const api = API({
  connection: {
    host: "<elasticsearch-host>",
    apiKey: "<api-key>", // optional
  },
  search_settings: {
    highlight_attributes: ["title", "actors"],
    search_attributes: ["title", "actors"],
    result_attributes: ["title", "actors"],
    facet_attributes: ["type", "rated"],
  },
});

// example API handler for Next.js
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const results = await api.handleRequest(req.body);
  res.send(results);
}
```

#### Setup the Frontend

Using InstantSearch and the instantsearch-client is as simple as adding this JavaScript code to your page:

```tsx
import React from "react";
import ReactDOM from "react-dom";
import Client from "@searchkit/instantsearch-client";
import { InstantSearch, SearchBox, Hits } from "react-instantsearch-dom";

const searchClient = Client({
  url: "/api/search", // API url
});

const App = () => (
  <InstantSearch indexName="bestbuy" searchClient={searchClient}>
    <SearchBox />
    <Hits />
  </InstantSearch>
);

export default App;
```

### NPM Packages
* @searchkit/api [Documentation](https://beta.searchkit.co/docs/api-documentation/api)
* @searchkit/instantsearch-client [Documentation](https://beta.searchkit.co/docs/api-documentation/instantsearch-client)

### FAQ

#### Do I need to expose my Elasticsearch instance to the browser?
No! You dont expose your elasticsearch cluster to the browser, you use either Searchkit Cloud or host the API yourself that sits in between elasticsearch and the browser.

#### Do I need to run a Node.js Server?
No! You can use Searchkit Cloud to manage the infrastructure. Or you can host the API yourself on Cloudflare or Vercel.
