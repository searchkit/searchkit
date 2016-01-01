# Menu
Provides a way to navigate through results for a single attribute. Only one value can be selected at a time.

## Example

```jsx

import {
  Pagination,
  Hits,
  SearchkitComponent
} from "searchkit";

class App extends SearchkitComponent<any, any> {

  render(){
    <div>
      <MenuFilter
        field="languages.raw"
        title="Languages" id="languages"/>
    </div>
  }
}
```
## Props
- `field` *(ESAttribute)*: Non-analysed elastic search field to create aggs for the menu
- `title` *(string)*: Title of the menu. Shown as a header and within selected filters
- `id` *(string)*: id of component. Must be unique. Used as key for url serialisation
