# Stats
This component lets you display how many results matched the query and other metrics on the results such as how fast the search was.

## Example

```jsx
import {
  HitsStats,
  SearchkitComponent
} from "searchkit";

class App extends SearchkitComponent<any, any> {

  render(){
    <div>
        <HitsStats/>
    </div>
  }
}
```
## Props
- `translations` *(Object)*: An object of translations you wish to override. For more information on translations see [translate](../../core/translate.md) page.
- `mod` *(string)*: Optional. A custom BEM container class.

## Demo
[](codepen://searchkit/PZWZbP?height=400&theme=0)

## Extending Component

```jsx

import {
  HitsStats,
  SearchkitComponent
} from "searchkit";

class ExampleHitStats extends HitsStats {
  renderText() {
    return (<div className="{this.bemBlocks.container("info")}">override text</div>)
  }
}

class App extends SearchkitComponent<any, any> {
  render(){
    <div>
        <ExampleHitStats/>
    </div>
  }
}
```

You can override the default display for HitsStats by overriding the renderText method. You have access to the following methods to retrieve metadata on the search:
- `getHitCount` returns the number of hits.
- `getTime` returns the time taken for the query.
- `getResults` returns the results object.
