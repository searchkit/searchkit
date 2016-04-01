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
        {label:"Earliest Releases", field:"released", order:"asc", key:"earliest"},
        {label:"Highly Rated", key:"rating", fields: [
          {field:"rating", options: {order:"desc"}},
          {field:"prices", options: {order:"asc", "mode" : "avg"}}
        ]}
      ]}/>
    </div>
  }
}
```

## Advanced Sorting
If you need to specify multiple sorting fields or have special options for sort field like `mode`, you can use the more advanced `fields` key (shown in example for "Highly Rated" option). This accepts an array of sort fields and allows sorting properties to be sent in the `options` object. *Requires the `key` option to be specified.*

## Props
- `options` *([{label:string, field?:<ESAttribute>, order?:(desc|asc), defaultOption?:boolean, fields?:Object}], key?:string)*: Options displayed for the user to order results with. You can use `fields` if you need to specify special options to sort, see `advanced sorting` section.
- `listComponent` *(ReactComponent)* customise how the component is rendered
  - Compatible with `Select`, `Tabs`, `Toggle`, `ItemList`, `CheckboxItemList`
  - Defaults to `Select`


## Default selected
The component will look for the `defaultOption` field on an option and use that as the default selected. If no `defaultOption` is provided, the component will choose the *first* option as the default.
