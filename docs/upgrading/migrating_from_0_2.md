# Migrating from Searchkit 0.2.0


### Removed config + classes

#### multipleSearchers removed
```js
import {SearchkitManager} from "searchkit"
new SearchkitManager("/", {multipleSearchers:false}
//becomes
new SearchkitManager("/")
```

#### Searcher + SearcherProvider removed
```js
import {
  Searcher,
  SearcherProvider,
  SearchkitManager,
  SearchkitProvider
} from "searchkit"

//becomes
import {
  SearchkitManager,
  SearchkitProvider
} from "searchkit"

```

### Hits component no longer renders blank state
We have moved the no results found text + ui into a new [NoHits Component](../components/basics/nohits.md)
```jsx
//0.2
<Hits hitsPerPage={10}/>

//0.3.x
<Hits hitsPerPage={10}/>
<NoHits/>
```
