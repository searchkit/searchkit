# Refinement list
Lets the user refine the search results. You can specify if you want filters to be ORed or ANDed. For example, if you filter on a and b with OR, results with either the value a or b will match.

## Example

```jsx

import {
  RefinementListFilter,
  SearchkitComponent
} from "searchkit";

class App extends SearchkitComponent {

 render(){
    <div>
      <RefinementListFilter id="actors" title="Actors" field="actors.raw" operator="AND"/>
    </div>
  }
}
```

## Overriding Filter Option Component
If you want to tweak the markup for a refinement option, you can use the `itemComponent` prop and pass in a new react component to be used to render each option.

```jsx

import {
  Pagination,
  Hits,
  SearchkitComponent
} from "searchkit";

const RefinementOption = (props) => (
  <div className={props.bemBlocks.item().state({selected:props.selected}).mix(this.bemBlocks.container("item"))} onClick={props.toggleFilter}>
    <div className={props.bemBlocks.item("label")}>{props.label}</div>
    <div className={props.bemBlocks.item("count")}>{props.docCount}</div>
  </div>
)

class App extends SearchkitComponent {

  render(){
    <div>
      <RefinementListFilter
        field="languages.raw"
        title="Languages"
        id="languages" itemComponent={RefinementOption}/>
    </div>
  }
}
```

## Props
- `field` *(ESAttribute)*: Non-analysed elastic search field to create aggs for the menu
- `title` *(string)*: Title of the menu. Shown as a header and within selected filters
- `id` *(string)*: id of component. Must be unique. Used as key for url serialisation
- `size` *(number)*: Amount of facets to bring back, this will influence the view more functionality.
- `operator` *('AND'|'OR')*: If you filter on a and b with OR, results with either the value a or b will match. If you select a and b, results will show which have both a and b.
- `translations` *(Object)*: An object of translations you wish to override. For more information on translations see [translate](../../core/Translate.md) page.
- `itemComponent` *(ReactComponent)*: Optional. React component which overrides the default filter option component. See `Overriding Filter Option Component` section.
- `mod` *(string)*: Optional. A custom BEM container class.
- `orderKey` *(string)*: Order key either using an intrinsic sortable key `_count` `_term`
- `orderDirection` *(string)*: `asc` or `desc`


## Translations
- `facets.view_more` - View more
- `facets.view_less` - View less
- `facets.view_all` - View all


## Demo
[](codepen://searchkit/zrNrzL?height=800&theme=0)
