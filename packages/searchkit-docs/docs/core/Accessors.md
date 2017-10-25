# Accessors
**Accessors** are used to manage state and produce a fragment of an ElasticSearch query. This seperates all the query + state logic away from Searchkit Components. Accessors also hold a key which is used to serialize/deserialize to the browser url. **Searchkit** manages this complexity in the background for you.

## Example usage
```js
let accessor = new PaginationAccessor("p")
accessor.state = accessor.state.setValue(5)
//...when searching
// url serializes to ?p=5
// from field gets added to Elastic Query
```

## List of some of Searchkit's existing accessors
* [FacetAccessor](https://github.com/searchkit/searchkit/blob/master/src/core/accessors/FacetAccessor.ts)
* [HierarchicalFacetAccessor](https://github.com/searchkit/searchkit/blob/master/src/core/accessors/HierarchicalFacetAccessor.ts)
* [NumericOptionsAccessor](https://github.com/searchkit/searchkit/blob/master/src/core/accessors/NumericOptionsAccessor.ts)
* [PageSizeAccessor](https://github.com/searchkit/searchkit/blob/master/src/core/accessors/PageSizeAccessor.ts)
* [PaginationAccessor](https://github.com/searchkit/searchkit/blob/master/src/core/accessors/PaginationAccessor.ts)
* [QueryAccessor](https://github.com/searchkit/searchkit/blob/master/src/core/accessors/QueryAccessor.ts)
* [SortingAccessor](https://github.com/searchkit/searchkit/blob/master/src/core/accessors/SortingAccessor.ts)
