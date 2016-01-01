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
        prefixQueryFields={["languages","title^10"]}
        queryFields={["title^5"]}/>
    </div>
  }
}
```

## Props
- `searchOnChange` *(Boolean)*: Optional. Updates search results as you type. Will be false by default.
- `prefixQueryFields` *([string])*: Optional. An array of fields which uses the prefix field search
- `queryFields` *(Array<string>)*: Optional. An array of elasticsearch fields to search within. Can specify boosting on particular fields. Will search `_all` by default.
- `mod` *(string)*: Optional. A custom BEM container class.

## Demo
[](codepen://ssetem/RrKPJL?height=800&theme=0)
