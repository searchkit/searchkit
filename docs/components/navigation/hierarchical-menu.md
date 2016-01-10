# Hierarchical Menu
Component which renders a tree like structure. Used for items which have multiple levels of categorization. Used for when documents have only one hierarchical category. For documents with more than one categories, see hierarchical Refinement filter. 

## Indexing

Hierarchical Menu needs an array of level fields. Levels is derived from the order of the array. If an item had /Appliances/Air Conditioners/Window Air Conditioners category, the values would be as follows: {categories_lvl1:["Appliances"], categories_lvl2:["Air Conditioners"], categories_lvl3:["Window Air Conditioners"]}  

## Example

```jsx

import {
  HierarchicalMenuFilter,
  SearchkitComponent
} from "searchkit";

class App extends SearchkitComponent<any, any> {

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

## Demo
[](codepen://searchkit/jWyWmw?height=800&theme=0)
