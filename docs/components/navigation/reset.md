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

## Props
- `translations` *(Object)*: An object of translations you wish to override. For more information on translations see [translate](../../core/Translate.md) page.

## Translations
- `reset.clear_all` - Clear All Filters

## Example overridding the translation

```jsx

import {
  ResetFilters,
  SearchkitComponent
} from "searchkit";

class App extends SearchkitComponent<any, any> {

  render(){
    <div>
      <ResetFilters translations={{"reset.clear_all":"Reset all filters"}}/>
    </div>
  }
}
```
