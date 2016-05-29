# Hierarchical Refinement
Component which renders a tree like structure. Used for items which have multiple levels of categorization. For example product categories & folders. Difference between Hierarchical menu and Hierarchical refinement is refinement is able to handle more than one hierarchical category per document, menu can only have one.

## Indexing

If a document has the following paths for the field taxonomy:
  /Color/Red/Firebrick
  /Color/Red/Orange Red
  /Color/Green/Sea Green
  /Color/Green/Lime Green

### Mapping definition
Below is the definition needed for a hierarchical field, we are making hierarchical colors in this case.
```js
color:{
  type:"nested",
  properties:{
    level:{type:"integer"},
    ancestors:{type:"string", index:"not_analyzed"},
    value:{type:"string", index:"not_analyzed"},
    order:{type:"integer"}    
  }
}
```

### Indexing the data

The document field for the hierarchical color field would be:

```js

color:[
  {level:1, value:"Color", ancestors:[]},
  {level:2, value:"Red", ancestors:["Color"]},
  {level:3, value:"Firebrick", ancestors:["Color", "Red"]},
  {level:3, value:"Orange Red", ancestors:["Color", "Red"]},
  {level:2, value:"Green", ancestors:["Color"]},
  {level:3, value:"Sea Green", ancestors:["Color", "Green"]},
  {level:3, value:"Lime Green", ancestors:["Color", "Green"]}
]

```

The array must have unique values, no duplicates (Color cannot be repeated for example). Order can be passed in as an integer value. Order value is optional.


## Example

```jsx

import {
  HierarchicalRefinementFilter,
  SearchkitComponent
} from "searchkit";

class App extends SearchkitComponent {

 render(){
    <div>
      <HierarchicalRefinementFilter field="color" title="Colors" id="colors"/>
    </div>
  }
}
```

## Props
- `field` *(ESAttribute)*: ES Field name. See indexing section on the data required for component.
- `title` *(string)*: Title of the menu. Shown as a header and within selected filters
- `id` *(string)*: id of component. Must be unique. Used as key for url serialization
- `startLevel` *(number)*: Optional. Can specify the root level to start from.
- `orderKey` *(string)*: Order key either using default sortable keys `_count` `_term` or using the `order` field e.g. `color.order`
- `orderDirection` *(string)*: `asc` or `desc`
- `translations` *(Object)*: An object of translations you wish to override. For more information on translations see [translate](../../core/Translate.md) page.
- `mod` *(string)*: Optional. A custom BEM container class.
- `countFormatter` *((count:number)=> number|string)* A optional function to format the doc counts


## Demo
[](codepen://searchkit/OMgmwR?height=800&theme=0)
