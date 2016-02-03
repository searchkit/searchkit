# SearchBox Component
The search box component is where your users type their search queries.

## Example

```jsx

import {
  SearchBox,
  SearchkitComponent
} from "searchkit";

class App extends SearchkitComponent {
  render(){
    <div>
      <SearchBox
        searchOnChange={true}
        queryOptions={{analyzer:"standard"}}
        queryFields={["title^5", "languages", "text"]}/>
    </div>
  }
}
```

## Props
- `searchOnChange` *(Boolean)*: Optional. Updates search results as you type. Will be false by default.
- `queryFields` *(Array<string>)*: Optional. An array of elasticsearch fields to search within. Can specify boosting on particular fields. Will search `_all` by default.
- `prefixQueryFields` *(Array<string>)*: Optional. An array of elasticsearch fields to search within. Can specify boosting on particular fields. Will search `_all` by default. Will only be used if searchOnChange is true.
- `queryOptions` *(Object)*: Optional. An object of options for [Query String](https://www.elastic.co/guide/en/elasticsearch/reference/2.0/query-dsl-query-string-query.html).
- `mod` *(string)*: Optional. A custom BEM container class.
- `translations` *(Object)*: An object of translations you wish to override. For more information on translations see [translate](../../core/Translate.md) page.
- `searchThrottleTime` *(number)*: Default is 200ms. Is used when `searchOnChange` prop is `true`. A search to elasticsearch will only be invoked once every `searchThrottleTime` ms.   

## Translations
- `searchbox.placeholder` - "Search"

## Demo
[](codepen://searchkit/zrNrGW?height=800&theme=0)
