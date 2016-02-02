# Initial loader Component
Initial loader is displayed when Searchkit hasn't yet received an elasticsearch response.

## Example Usage

```jsx

import * as _ from "lodash";

import {
  Hits,
  InitialLoader,
  HitItemProps
} from "searchkit";

const InitialLoaderComponent = (props) => (
  <div className={this.bemBlocks.item().mix(this.bemBlocks.container("item"))}>
    loading please wait...
  </div>
)

class App extends SearchkitComponent {

  render(){
    <div>
      <Hits hitsPerPage={50} highlightFields={["title"]}/>
      <InitialLoader component={InitialLoaderComponent}/>
    </div>
  }
}
```

## Props
- `mod` *(string)*: Optional. A custom BEM container class.
- `itemComponent` *(ReactComponent)*: Functional component used to render the contents of `InitialLoader`.
