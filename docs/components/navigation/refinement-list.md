# Refinement list
Lets the user refine the search results. You can specify if you want filters to be ORed or ANDed. For example, if you filter on a and b with OR, results with either the value a or b will match.

## Example

```jsx

import {
  RefinementListFilter,
  SearchkitComponent
} from "searchkit";

class App extends SearchkitComponent<any, any> {

 render(){
    <div>
      <RefinementListFilter id="actors" title="Actors" field="actors.raw" operator="AND"/>
    </div>
  }
}
```

## Props
- `field` *(ESAttribute)*: Non-analysed elastic search field to create aggs for the menu
- `title` *(string)*: Title of the menu. Shown as a header and within selected filters
- `id` *(string)*: id of component. Must be unique. Used as key for url serialisation
- `operator` *('AND'|'OR')*: If you filter on a and b with OR, results with either the value a or b will match. If you select a and b, results will show which have both a and b.

## Demo
[](codepen://searchkit/zrNrzL?height=800&theme=0)
