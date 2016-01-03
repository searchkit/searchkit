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
  multipleSearchers:false, // defaults to false
  httpHeaders:{},
  basicAuth:"key:val"
})
```

## Options

* **host** - A mandatory host will either be a path to a direct instance of elasticsearch with cors enabled, or can be relative to the domain the application is served on, which usually is a thin proxy to an elasticsearch server. A node implementation can be found here [SearchkitExpress](../server/searchkit_express.md)

* **multipleSearchers** - Enables an advanced feature where components can control whether to send a seperate query. Useful for dashboard, chart UI's where manipulating a single component doesn't reload all.

* **httpHeaders** - A key value object containing headers to sent along with each http request

* **basicAuth** - A string containing "key:val" for authenticating on each request, useful if using cloud providers such as [searchly.com](http://searchly.com)
