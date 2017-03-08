#Query DSL builders
`Searchkit` ships with many query builders to be used internally and externally to searchkit. This is to remove boilerplate and errors when constructing complicated elastic queries.

## Term based queries
#### `TermQuery(field, value)`
```js
import {TermQuery} from "searchkit"
TermQuery("color", "red")
```

#### `TermsQuery(field, values)`
```js
import {TermsQuery} from "searchkit"
TermsQuery("color", ["red", "orange"])
```
#### `RangeQuery(field, options)`

Available options: lt, lte, gt, gte, boost, format, time_zone

Numeric Range:

```js
import {RangeQuery} from "searchkit"
RangeQuery("rating",  {gte: 1, lt: 11 })
/* {
  range:{
    rating: { gte:1, lt:11 }
  }
} */
```

Date Range:

```js
import {RangeQuery} from "searchkit"
RangeQuery("date_received", { gte: "2005||/y" })
/* {
  range: {
    date_received: { gte: "2005||/y" }
  }
} */
```

## Compound queries
#### `BoolMust(filter)`
```js
import {BoolMust, TermQuery} from "searchkit"
//array
BoolMust([
  Term("color", "orange"),
  Term("brand", "boss")
])
//single filter
BoolMust(Term("color", "red"))
```
#### `BoolMustNot(filter)`
See BoolMust
#### `BoolShould(filter)`
See BoolMust

#### `FilteredQuery(filteredOb)`
```js
import {FilteredQuery, MatchQuery, TermQuery} from "searchkit"
Filtered({
  query:MatchQuery("title", "Star Wars"),
  filter:TermQuery("genre", "Action")
})
```
## Full text based queries

#### `MatchQuery(field, query, options)`
```js
import {MatchQuery} from "searchkit"
MatchQuery("color", "red yellow", {
    operator:'AND'
    //...other match query options
})
```
#### `MatchPhrasePrefix(query, str)`
```js
import {MatchPhrasePrefix} from "searchkit"
MatchPhrasePrefix('title', 'spide')
//with optional boost
MatchPhrasePrefix('title^10', 'spide')
```
#### `MultiMatchQuery(query, options)`
```js
import {MultiMatchQuery} from "searchkit"
MultiMatchQuery("red", {
    fields:["color", "song_title"],
    operator:"OR"
  //.. other multi match query options
})
```
#### `SimpleQueryString(query, options)`
```js
import {SimpleQueryString} from "searchkit"
SimpleQueryString("red AND blue", {
    fields:["color", "song_title"],
    operator:"OR"
  //.. other simple query options
})
```
