# NoHits Component
`NoHits` component is displayed when the current query yields no results from Elasticsearch. `NoHits` may offer actions to help the user tweak their search to return results.

## Tweaking Query Actions
If the current query and filters applied returns no results, `NoHits` component will try to provide steps to adjust the search.

### Elasticsearch Suggestions API
If `suggestionsField` prop is specified, it will use `elasticsearch`'s suggestions api and show an action to search using the suggestion if found.

### Query Without Filters
`NoHits` will provide an action to remove the filters if the query without filters will yield results.    

## Example Usage

```jsx

import * as _ from "lodash";

import {
  Hits,
  NoHits,
  SearchkitProvider,
  SearchkitManager
} from "searchkit"

const searchkit = new SearchkitManager(<somehost>)
const App = ()=> (
  <SearchkitProvider searchkit={searchkit}>
    <div>
      <Hits hitsPerPage={10}/>
      <NoHits translations={{
        "NoHits.NoResultsFound":"No movies found were found for {query}",
        "NoHits.DidYouMean":"Search for {suggestion}",
        "NoHits.SearchWithoutFilters":"Search for {query} without filters"
      }} suggestionsField="title"/>
    </div>
  </SearchkitProvider>
)

```

>**Note** here we use NoHits as a sibling to `Hits`

## Props
- `suggestionsField` *(ESField)*: The field used to create suggestions from which closely match the current query and will bring better results.
- `translations` *(Object)*: An object of translations you wish to override. For more information on translations see [translate](../../core/Translate.md) page.
- `mod` *(string)*: Optional. A custom BEM container class.


## Translations
>*Note* NoHits will interpolate the query or suggestion into your translation

- `NoHits.NoResultsFound`: No results found for {query}.,
- `NoHits.DidYouMean`:Search for {suggestion},
- `NoHits.SearchWithoutFilters`:Search for {query} without filters
- `NoHits.NoResultsFoundDidYouMean`:No results found for {query}. Did you mean {suggestion}?
