# NoHits Component
`NoHits` component is displayed when the current query yields no results from Elasticsearch. `NoHits` may offer actions to help the user tweak their search to return results. `NoHits` will display an error when Elastic search responds with an error. You can override the display of NoHits by passing in a React Component in `component` or `errorComponent` props. See Overriding section for more details.

![Example](./assets/no-hits.png)


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
      <Hits hitsPerPage={10} sourceFilter={["title"]}/>
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

## Overriding display for NoHits
If you need to override the display of No Hits, you can pass in a React component into either `component` or `errorComponent` to override the default display.

```jsx
import * as _ from "lodash";

import {
  Hits,
  NoHits,
  SearchkitProvider,
  SearchkitManager
} from "searchkit"

const searchkit = new SearchkitManager(<somehost>)

const NoHitsDisplay = (props) => {
  const {bemBlocks, query, suggestion, noResultsLabel} = this.props
  return (
    <div data-qa="no-hits" className={bemBlocks.container()}>
      <div className={bemBlocks.container("info")}>
        no results for {query}!
      </div>
    </div>
  );
}

const NoHitsErrorDisplay = (props) => {
  const {errorLabel, bemBlocks, resetSearchFn, tryAgainLabel} = props

  return (
    <div data-qa="no-hits" className={bemBlocks.container()}>
      <div className={bemBlocks.container("info")}>
        An error has occurred!
      </div>
    </div>
  )
}

const App = ()=> (
  <SearchkitProvider searchkit={searchkit}>
    <div>
      <Hits hitsPerPage={10} sourceFilter={["title"]}/>
      <NoHits
      component={NoHitsDisplay}
      errorComponent={NoHitsErrorDisplay}
      translations={{
        "NoHits.NoResultsFound":"No movies found were found for {query}",
        "NoHits.DidYouMean":"Search for {suggestion}",
        "NoHits.SearchWithoutFilters":"Search for {query} without filters"
      }} suggestionsField="title"/>
    </div>
  </SearchkitProvider>
)
```

## Props
- `suggestionsField` *(ESField)*: The field used to create suggestions from which closely match the current query and will bring better results.
- `translations` *(Object)*: An object of translations you wish to override. For more information on translations see [translate](../../core/Translate.md) page.
- `component` *(ReactComponent)*: Optional. A React component which will be used to render the no hits state.
- `errorComponent` *(ReactComponent)*: Optional. A React component which will be used to render the error state.
- `mod` *(string)*: Optional. A custom BEM container class.


## Translations
>*Note* NoHits will interpolate the query or suggestion into your translation

- `NoHits.NoResultsFound`: No results found for {query}.,
- `NoHits.DidYouMean`:Search for {suggestion},
- `NoHits.SearchWithoutFilters`:Search for {query} without filters
- `NoHits.NoResultsFoundDidYouMean`:No results found for {query}. Did you mean {suggestion}?
