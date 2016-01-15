# NoHits Component
The `NoHits` will render a message when no results have been returned from `ElasticSearch`
and `Searchkit` has passed its initial loading phase

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
      <NoHits translations={{"nohits.no_results":"No results found..."}}/>
    </div>
  </SearchkitProvider>
)

```

>**Note** here we use NoHits as a sibling to `Hits`

## Props
- `translations` *(Object)*: An object of translations you wish to override. For more information on translations see [translate](../../core/translate.md) page.

## Translations
- `nohits.no_results` - no results found
