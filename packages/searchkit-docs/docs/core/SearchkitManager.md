# SearchkitManager
`SearchkitManager` is the top level class which manages a Searchkit application

## Example Usage
```js
import {
  SearchkitManager
} from "searchkit"

const host = "/"
// const host = "http//localhost:9200/movies"

const searchkit = new SearchkitManager(host, {
  httpHeaders:{},
  basicAuth:"key:val"
})
```

## Options

* **host** - A mandatory host will either be a path to a direct instance of elasticsearch with cors enabled, or can be relative to the domain the application is served on, which usually is a thin proxy to an elasticsearch server. A node implementation can be found here [SearchkitExpress](../server/searchkit_express.md)

* **httpHeaders** - A key value object containing headers to sent along with each http request

* **basicAuth** - A string containing "key:val" for authenticating on each request, useful if using cloud providers such as [searchly.com](http://searchly.com)

* **withCredentials** - A boolean to pass to Axios to indicate whether or not cross-site Access-Control requests should be made using credentials

* **searchOnLoad** - A boolean to search on load, defaults to `true`

* **useHistory** - A boolean to enable url history support, defaults to `true`

* **createHistory** - A function which returns an instance of a history obj, defaults to `createBrowserHistory from history@4.6.1`

* **getLocation** - A function which returns the current location which has to implement the LocationInterface {pathname:String,search:String}, defaults to `()=> window.location`

* **searchUrlPath** - A the search endpoint name, defaults to `/_search`. Used if your server proxy endpoint needs a different url convention.

* **timeout** - A number value to override the default 5000ms response timeout. Optional.

* **defaultSize** - Default size for elastic results, defaults to `20`

## Default Queries

Sometimes we need to apply a default query which affects the entire search and is not serialized to the browser url.

`SearchkitManager` allows ability to add these

```js
  import {
    SearchkitManager,
    TermQuery,
    FilteredQuery,
    BoolShould
  } from "searchkit"
  
  const searchkit = new SearchkitManager("/")
  searchkit.addDefaultQuery((query)=> {
    return query.addQuery(FilteredQuery({
      filter:BoolShould([
        TermQuery("colour", "red"),
        TermQuery("colour", "orange")
      ])
    }))
  })
```

## reloadSearch
If you want to reload the search even with query and state hasn't changed
```typescript
  searchkit.reloadSearch()
```

## Query Processor
Searchkit offers ability to mutate the query just before its sent to ElasticSearch, this is so we can always support new apis for ElasticSearch and any custom logic you wish to add that is low level in searchkit normally.

```typescript
searchkit.setQueryProcessor((plainQueryObject)=>{
  plainQueryObject.source = false
  return plainQueryObject
})
```
>*Note* We only support 1 queryProcessor function currently, so multiple `setQueryProcessor` calls will override each other.


## resultsListener
If you want to be notified when results changed
```typescript
let removalFn = searchkit.addResultsListener((results)=>{
  //do something with results
})

//removalFn() if you want to stop listening
```

## shouldPerformSearch
If you want to control whether Searchkit performs a search, you can provide a custom check function
The `shouldPerformSearch` function is called with an instance of `ImmutableQuery`
```typescript
  //only search when there is a query string
  this.searchkit.shouldPerformSearch = (query)=> {
    return !!query.getQueryString()
  }
```