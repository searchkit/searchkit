# Translate

All components run a translate function on any text displayed. This includes:

- filter options (for when options are ids and required to be rendered in text)
- previous / next navigation
- show more / show less / show all action text
- search placeholder

and many more in components.

## Interpolations
Some translations contain interpolations, E.g. `NoHits.NoResultsFound` which has a default translation of `No results found for {query}.` which means the component will provide the query value.

## How to override global defaults
```js

const searchkit = new SearchkitManager("locahost:9200")

searchkit.translateFunction = (key) => {
  let translations = {
    "pagination.previous":"Previous page",
    "pagination.next":"Next page",
    "id1":"Color",
    "id2": "Red"
  }
  return translations[key]
}
```

## Override component defaults

You can pass any component an object of translations you wish to override. Example below:

```jsx
<SearchBox translations={{"searchbox.placeholder":"search movies"}} autofocus={true} searchOnChange={true} queryFields={["actors^1","type^2","languages","title^5", "genres^2"]}/>
```

## List of some of the translation overrides with their defaults

### ResetFilters
- `reset.clear_all` - Clear All Filters

### RefinementListFilter
- `facets.view_more` - View more
- `facets.view_less` - View less
- `facets.view_all` - View all

### NoHits
- `NoHits.NoResultsFound` - No results found for {query}.
- `NoHits.DidYouMean` - Search for {suggestion}.
- `NoHits.SearchWithoutFilters` - Search for {query} without filters
- `NoHits.NoResultsFoundDidYouMean`:No results found for {query}. Did you mean {suggestion}?

### HitStats
- `hitstats.results_found` - {hitCount} results found in {timeTaken}ms

### Pagination
- `pagination.previous` - Previous
- `pagination.next` - Next

### Searchbox
- `searchbox.placeholder` - "Search"
