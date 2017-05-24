# Connecting to Elasticsearch instance
There are many ways to connect searchkit to an elasticsearch instance. We officially support ES 2.0+ but also works on 1.7.2 +. If connecting directly to elasticsearch (not using the searchkit-express), multipleSearchers cannot be true.

## Using a cloud hosted elasticsearch instance
Searchkit can use a cloud based elasticsearch instance. If using in production, make sure the url is read only.

### Hosting providers

- [qbox.io](https://qbox.io)
- [Elastic Cloud](https://www.elastic.co/cloud)
- [search.ly](http://searchly.com)
- [Amazon Elasticsearch Service](https://aws.amazon.com/elasticsearch-service/)
- [Logsene](https://www.sematext.com/logsene/index.html)

### Configuration

```js
const sk = new SearchkitManager("https://kili-eu-west-1.searchly.com/movies/", {
  basicAuth:"read:teetndhjnrspbzxxyfxmf5fb24suqxuj"
})

<SearchkitProvider searchkit={sk}>
...
</SearchkitProvider>
```

## Using Local ES Server
Connecting Searchkit to your local elasticsearch instance. If you are are getting a cors related error, you will need to add the following to you `config/elasticsearch.yml' file.

```yaml
http.cors.enabled : true  
http.cors.allow-origin : "*"
http.cors.allow-methods : OPTIONS, HEAD, GET, POST, PUT, DELETE
http.cors.allow-headers : X-Requested-With,X-Auth-Token,Content-Type, Content-Length
```

### Configuration
```js
const searchkit = new SearchkitManager("http://localhost:9200/")


<SearchkitProvider searchkit={searchkit}>
...
</SearchkitProvider>
```

## Proxy elasticsearch connection
We built a plugin for node express called [searchkit-express](http://www.github.com/searchkit/searchkit-express). This proxies the search request to elasticsearch via the server. This allows to validate requests on the server and with options to apply additional filters before it reaches the elasticsearch instance. See [searchkit-express setup](../server/searchkit_express.md) for more information.

### Configuration
```js
const searchkit = new SearchkitManager("/")

<SearchkitProvider searchkit={searchkit}>
...
</SearchkitProvider>
```
