# Menu
Provides a way to navigate through results for a single attribute. Only one value can be selected at a time.

## Example

```jsx

import {
  Pagination,
  Hits,
  SearchkitComponent
} from "searchkit";

class App extends SearchkitComponent {

  render(){
    <div>
      <MenuFilter
        field="languages.raw"
        title="Languages"
        id="languages"/>
    </div>
  }
}
```

## Overriding Filter Option Component
If you want to tweak the markup for a menu option, you can use the `itemComponent` prop and pass in a new react component to be used to render each option.

```jsx

import {
  Pagination,
  Hits,
  SearchkitComponent
} from "searchkit";

const MenuOption = (props) => (
  <div className={props.bemBlocks.item().state({selected:props.selected}).mix(this.bemBlocks.container("item"))} onClick={props.toggleFilter}>
    <div className={props.bemBlocks.item("label")}>{props.label}</div>
    <div className={props.bemBlocks.item("count")}>{props.docCount}</div>
  </div>
)

class App extends SearchkitComponent {

  render(){
    <div>
      <MenuFilter
        field="languages.raw"
        title="Languages"
        id="languages" itemComponent={MenuOption}/>
    </div>
  }
}
```

## Props
- `field` *(ESAttribute)*: Non-analysed elastic search field to create aggs for the menu
- `title` *(string)*: Title of the menu. Shown as a header and within selected filters
- `id` *(string)*: id of component. Must be unique. Used as key for url serialisation
- `itemComponent` *(ReactComponent)*: Optional. React component which overrides the default filter option component. See `Overriding Filter Option Component` section.
- `mod` *(string)*: Optional. A custom BEM container class.
- `orderKey` *(string)*: Order key either using an intrinsic sortable key `_count` `_term`
- `orderDirection` *(string)*: `asc` or `desc`


## Demo
[](codepen://searchkit/YwNwVm?height=800&theme=0)
