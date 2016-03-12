# Selected Filters
This component shows all the filters that have been applied to the current search.

<img src="./assets/selected-filters.png"/>

## Example

```jsx

import {
  SelectedFilters,
  SearchkitComponent
} from "searchkit";

class App extends SearchkitComponent {

  render(){
    <div>
      <SelectedFilters/>
    </div>
  }
}
```

## Overriding Selected Filter Component
If you want to tweak the markup for a selected filter item, you can use the `itemComponent` prop and pass in a React Component to be used instead to render each selected filter item.

```jsx

import {
  SelectedFilters,
  SearchkitComponent
} from "searchkit";

const SelectedFilter = (props) => (
  <div className={props.bemBlocks.option()
    .mix(props.bemBlocks.container("item"))
    .mix(`selected-filter--${props.filterId}`)()}>
    <div className={props.bemBlocks.option("name")}>{props.labelKey)}: {props.labelValue}</div>
    <div className={props.bemBlocks.option("remove-action")} onClick={props.removeFilter}>x</div>
  </div>
)

class App extends SearchkitComponent {

  render(){
    <div>
      <SelectedFilters itemComponent={SelectedFilter} />
    </div>
  }
}

```

## Props
- `mod` *(string)*: Optional. A custom BEM container class.
- `itemComponent` *(ReactComponent)*: Optional. Used to override the default display of a selected filter. See `Overriding Selected Filter Component` section.
