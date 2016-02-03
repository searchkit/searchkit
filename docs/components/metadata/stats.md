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
## Props
- `translations` *(Object)*: An object of translations you wish to override. For more information on translations see [translate](../../core/Translate.md) page.
- `mod` *(string)*: Optional. A custom BEM container class.

## Demo
[](codepen://searchkit/WrJYMW?height=400&theme=0)

## Props
- `translations` *(Object)*: An object of translations you wish to override. For more information on translations see [translate](../../core/Translate.md) page.

## Translations
- `hitstats.results_found` - "{numberResults} results found in {timeTaken}"
