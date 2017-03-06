# Hierarchical Menu
Component which renders a tree like structure. Used for items which have multiple levels of categorization. Used for when documents have only one hierarchical category. For documents with more than one categories, see hierarchical Refinement filter.

![Example](./assets/hierarchical-menu.png)

## Indexing

Hierarchical Menu needs an array of level fields. Levels is derived from the order of the array. If an item was in /Appliances/Air Conditioners/Window Air Conditioners category, the setup would be as follows:


### Mapping example
```js
{
  "products":{
    "category":{
      "properties":{
       //includes all ids for flat level querying
       "all":{"type":"string", "index":"not_analyzed"},

       //tags bucketed by their level in the tree
       "lvl1":{"type":"string", "index":"not_analyzed"},
       "lvl2":{"type":"string", "index":"not_analyzed"},
       "lvl3":{"type":"string", "index":"not_analyzed"},
       //...
       "lvl10":{"type":"string", "index":"not_analyzed"}
    }
  }
}
```

#### Indexing example
```js
{
  category.lvl1:"Appliances",
  category.lvl2:"Air Conditioners",
  category.lvl3:"Window Air Conditioners"
}
```

## Example

```jsx

import {
  HierarchicalMenuFilter,
  SearchkitComponent
} from "searchkit";

class App extends SearchkitComponent {

 render(){
    <div>
      <HierarchicalMenuFilter fields={["categories_lvl1", "categories_lvl2", "categories_lvl3"]} title="Categories" id="categories"/>
    </div>
  }
}
```

## Props
- `fields` *([ESAttribute])*: An array of non-analysed elastic search fields to create aggs.
- `title` *(string)*: Title of the menu. Shown as a header and within selected filters
- `id` *(string)*: id of component. Must be unique. Used as key for url serialisation
- `translations` *(Object)*: An object of translations you wish to override. For more information on translations see [translate](../../core/Translate.md) page.
- `mod` *(string)*: Optional. A custom BEM container class.
- `orderKey` *(string)*: Order key either using an intrinsic sortable key `_count` `_term`
- `orderDirection` *(string)*: `asc` or `desc`
- `countFormatter` *((count:number)=> number|string)* A optional function to format the doc counts
- `size` *(number)*: size of options shown

## Demo
[](codepen://searchkit/jWyWmw?height=800&theme=0)
