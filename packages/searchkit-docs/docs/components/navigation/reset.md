# Reset
This component clears all the selected filters and search query that are currently applied.

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

## Overriding Display Component
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
- `component` *(ReactComponent)*: Optional. Used to override the default display of reset filters. See `Overriding Display Component` section.
- `mod` *(string)*: Optional. A custom BEM container class.
- `options` *(object)*: An object containing `{query:true|false, filter:true|false, pagination:true|false}` which controls which parts of the search are reset and influence the disabled state. Defaults to `{query:true, filter:true, pagination:true}`

## Translations
- `reset.clear_all` - Clear All Filters

## Example overriding the translation

```jsx

import {
  ResetFilters,
  SearchkitComponent
} from "searchkit";

class App extends SearchkitComponent {

  render(){
    <div>
      <ResetFilters translations={{"reset.clear_all":"Reset all filters"}}/>
    </div>
  }
}
```
