# Sorting Selector
This component lets you reorder your results. Each option requires a sortable Elasticsearch field and the order of which you want to sort by.


<img src="./assets/sorting.png"/>

`Select` and `Toggle` example side by side.

## Example

```jsx
import {
  SortingSelector,
  SearchkitComponent
} from "searchkit";

class App extends SearchkitComponent {

  render(){
    <div>
      <SortingSelector options={[
        {label:"Relevance", field:"_score", order:"desc", defaultOption:true},
        {label:"Latest Releases", field:"released", order:"desc"},
        {label:"Earliest Releases", field:"released", order:"asc", key:"earliest"}
      ]}/>
    </div>
  }
}
```

## Props
- `options` *([{label:string, field?:<ESAttribute>, order?:(desc|asc), defaultOption?:boolean}], key?:string)*: Options displayed for the user to order results with.
- `listComponent` *(ReactComponent)* customise how the component is rendered
  - Compatible with `Toggle`, `Select`, defaults to `Select`


## Default selected
The component will look for the `defaultOption` field on an option and use that as the default selected. If no `defaultOption` is provided, the component will choose the *first* option as the default.
