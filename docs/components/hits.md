# Hits
Hits component displays results from ElasticSearch. To customise each result, you need to override the

##### Example

```js

import {
  Hits,
  SearchkitComponent
} from "searchkit";

class MovieHits extends Hits {
  renderResult(result:any) {
    return (
      <div className="hit" key={result._id}>
        <img className="hit__poster" src={result._source.poster}/>
        <div className="hit__title">{result._source.title}</div>
      </div>
    )
  }
}

class App extends SearchkitComponent<any, any> {

  render(){
    <div>
      <MovieHits hitsPerPage={50}/>
    </div>
  }
}
```

##### Props
- `hitsPerPage` *(Number)*: Number of results displayed per page
