# Reset
This component clears all the refinements that are currently applied (query and filters)

## Example

```jsx

import {
  ResetFilters,
  SearchkitComponent
} from "searchkit";

class App extends SearchkitComponent {

  render(){
    <div>
      <ResetFilters/>
    </div>
  }
}
```

## Optional Override display
If you want to tweak the markup for reset filters, you can use the `component` prop and pass in a React Component to be used to render the reset button.

```jsx

import {
  ResetFilters,
  SearchkitComponent
} from "searchkit";

class ResetFiltersDisplay extends React.Component {
	render(){
		const {bemBlock, hasFilters, translate, resetFilters} = this.props
		return (
			<div onClick={resetFilters} className={bemBlock().state({disabled:!hasFilters})}>
				<div className={bemBlock("reset")}>{translate("reset.clear_all")}</div>
			</div>
		)
	}
}

class App extends SearchkitComponent {

  render(){
    <div>
      <ResetFilters component={ResetFiltersDisplay} />
    </div>
  }
}

```

## Props
- `translations` *(Object)*: An object of translations you wish to override. For more information on translations see [translate](../../core/Translate.md) page.
- `component` *(ReactComponent)*: Optional. Option to override the default display of reset filters

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
