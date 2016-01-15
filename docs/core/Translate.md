# Translate

All components run a translate function on any text displayed. This includes:

- filter options (for when options are ids and required to be rendered in text)
- previous / next navigation
- show more / show less / show all action text
- search placeholder

and many more in components.

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

## List of all translation overrides with their defaults

### ResetFilters
- `reset.clear_all` - Clear All Filters

### RefinementListFilter
- `facets.view_more` - View more
- `facets.view_less` - View less
- `facets.view_all` - View all

### NoHits
- `nohits.no_results` - no results found

### HitStats
- `hitstats.results_found` - "results found"

### Pagination
- `pagination.previous` - Previous
- `pagination.next` - Next

### Searchbox
- `searchbox.placeholder` - "Search"
