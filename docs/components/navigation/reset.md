# Reset
This component clears all the refinements that are currently applied (query and filters)

## Example

```jsx

import {
  ResetFilters,
  SearchkitComponent
} from "searchkit";

class App extends SearchkitComponent<any, any> {

  render(){
    <div>
      <ResetFilters/>
    </div>
  }
}
```

## Extending Component

```jsx

import {
  ResetFilters,
  SearchkitComponent
} from "searchkit";

class ExampleResetFilters extends ResetFilters {
  renderResetButton() {
    return (
      <div className={this.bemBlocks.container("reset")}>clear</div>
    )
  }
}

class App extends SearchkitComponent<any, any> {

  render(){
    <div>
      <ResetFilters/>
    </div>
  }
}
```
