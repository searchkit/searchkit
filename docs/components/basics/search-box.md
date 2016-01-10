# SearchBox Component
The search box component is where your users type their search queries.

## Example

```jsx

import {
  SearchBox,
  SearchkitComponent
} from "searchkit";

class App extends SearchkitComponent<any, any> {
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
- `queryOptions` *(Object)*: Optional. An object of options for [Query String](https://www.elastic.co/guide/en/elasticsearch/reference/2.0/query-dsl-query-string-query.html).
- `mod` *(string)*: Optional. A custom BEM container class.

## Demo
[](codepen://searchkit/zrNrGW?height=800&theme=0)
