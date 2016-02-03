# Numeric Refinement List
Allows the user to refine results based on a numerical elasticsearch attribute. You specify an array of options for the user to select from. Will only allow the user to select one.

## Example

```jsx

import {
  NumericRefinementListFilter,
  SearchkitComponent
} from "searchkit";

class App extends SearchkitComponent {

  render(){
    <div>
      <NumericRefinementListFilter id="metascore" title="Meta score" field="metaScore" options={[
        {title:"All"},
        {title:"up to 20", from:0, to:21},
        {title:"21 to 40", from:21, to:41},
        {title:"41 to 60", from:41, to:61},
        {title:"61 to 80", from:61, to:81},
        {title:"81 to 100", from:81, to:101}
      ]}/>
    </div>
  }
}
```
## Props
- `field` *(ESAttribute)*: Non-analysed elastic search field to create aggs for the menu
- `options` *([{title:string, from?:number, to?:number}])*: Options displayed for the user to refine results with.
- `title` *(string)*: Title of the menu. Shown as a header and within selected filters
- `id` *(string)*: id of component. Must be unique. Used as key for url serialisation
- `mod` *(string)*: Optional. A custom BEM container class.

## Demo
[](codepen://searchkit/bEgERB?height=800&theme=0)
