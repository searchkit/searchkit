# Using Express
`Searchkit` ships with an express plugin to proxy api calls to ElasticSearch
> **Note** The use of a proxy is optional, you can configure the `Searchkit` client to connect directly to an `ElasticSearch` server

## Installation

```sh
npm install searchkit-express --save
```

```js
SearchkitExpress = require("searchkit-express")
```

```js
var app = express()
//...

SearchkitExpress({
  host:process.env.ELASTIC_URL || "http://localhost:9200",  
  index:'movies',
  queryProcessor:function(query, req, res){
    //do neccessery permissions, prefilters to query object
    //then return it
    return query
  }
 }, app)
 ```

 This will add the following endpoints to your root url which will route to the `movies` index on your elasticsearch instance
 * `POST /_search`


### Custom router
If you wish to prefix the url or control the middleware for these particular routes `SearchkitExpress` allows manual creation of an `express.Router`

```js
var app = express()

//...

var searchkitRouter = SearchkitExpress.createRouter({
  host:process.env.ELASTIC_URL || "http://localhost:9200",  
  index:'movies',
  queryProcessor:function(query, req, res){
    console.log(query)    
    return query
  }
 })
app.use("/movie-search", searchkitRouter)
```
This will result in the following api endpoints

 * `POST /movie-search/_search`
