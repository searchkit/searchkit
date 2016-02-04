# ImmutableQuery
An immutable query builder which is passed around particular `Accessors` before being sent to `ElasticSearch`. This is used internally by Searchkit components

## Example usage
```js
import {
  ImmutableQuery,
  SimpleQueryString
} from "searchkit"

let query = new ImmutableQuery()
let newQuery = query.setSize(10).addQuery(
  SimpleQueryString("search term")
)

//query + newQuery are seperate
```


## API

* **`.addQuery(queryObject)`**
```js
//simple query
new ImmutableQuery().addQuery(SimpleQueryString("Hello"))
```
```js
//simple query + prefix queries on title(boosted) + description
new ImmutableQuery().addQuery(BoolMust([
    SimpleQueryString("Termina"),
    MatchPhrasePrefix("Termina", "movieTitle^5")
    MatchPhrasePrefix("Termina", "movieDescription")
])
```
* **`.addFilter(key, boolObject)`**
```js
//filter on either color of red or yellow
new ImmutableQuery().addFilter("color", BoolShould([
    Term("color", "red"),
    Term("color", "yellow")
]))
```
* **`.addAnonymousFilter(key, boolObject)`**
```js
//filter on either color of red or yellow
new ImmutableQuery().addAnonymousFilter(BoolShould([
    Term("color", "red"),
    Term("color", "yellow")
]))
```
* **`.setSize(size)`**
```js
new ImmutableQuery().setSize(10)
```

* **`.setFrom(from)`**
```js
new ImmutableQuery().setSize(100)
```


* **`.setSort(sortOb)`**
```js
new ImmutableQuery().setSize([  
  {"price" : {"order" : "asc"}}  
])
```

* **`.setSource(sourceFilter)`**
```js
new ImmutableQuery().setSource(["title", "thumbnail"])    
```
