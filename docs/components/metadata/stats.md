# Stats
This component lets you display how many results matched the query and other metrics on the results such as how fast the search was.

## Example

```jsx
import {
  HitsStats,
  SearchkitComponent
} from "searchkit";

class App extends SearchkitComponent {

  render(){
    <div>
        <HitsStats/>
    </div>
  }
}
```

## Overriding
If you want to customise the display of HitsStats, you can override the display by passing in a ReactComponent into `component` prop.

```jsx
import {
  HitsStats,
  SearchkitComponent
} from "searchkit";

const customHitStats = (props) => {
	const {resultsFoundLabel, bemBlocks, hitsCount, timeTaken} = props
	return (
		<div className={bemBlocks.container()} data-qa="hits-stats">
			<div className={bemBlocks.container("info")} data-qa="info">
				I found {hitsCount} in {timeTaken}ms!
			</div>
	  </div>
	)
}

class App extends SearchkitComponent {

  render(){
    <div>
        <HitsStats component={customHitStats}/>
    </div>
  }
}
```

## Props
- `translations` *(Object)*: An object of translations you wish to override. For more information on translations see [translate](../../core/Translate.md) page.
- `component` *(ReactComponent)*: A React component to override the default display component. Used when you want to change the markup of HitStats
- `mod` *(string)*: Optional. A custom BEM container class.
- `countFormatter` *((count:number)=> number|string)* A optional function to format the doc counts


## Demo
[](codepen://searchkit/PZWZbP?height=400&theme=0)

## Props
- `translations` *(Object)*: An object of translations you wish to override. For more information on translations see [translate](../../core/Translate.md) page.

## Translations
- `hitstats.results_found` - "{numberResults} results found in {timeTaken}"
