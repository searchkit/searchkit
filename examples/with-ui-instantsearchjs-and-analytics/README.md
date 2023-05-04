### with-express-javascript-cjs

Example of using Searchkit with Express.js to proxy frontend search requests to Elasticsearch.

### Setup

1. Install dependencies

```
npm install
```

2. Update the Searchkit configuration in `index.js` with the `connection` and `search_settings` for your search experience.

3. Start server. This will start the server on port 3001.

```
npm start
```

4. Update the `url` in `@searchkit/instantsearch-client` configuration to point to the server

```
const searchClient = SearchkitInstantSearchClient({
  url: "http://localhost:3001/api/search"
})
```
