# Initial loader Component
Initial loader is displayed when Searchkit hasn't yet received an elasticsearch response.

## Example Usage

```jsx

import {
  Hits,
  InitialLoader,
  HitItemProps
} from "searchkit";

const InitialLoaderComponent = (props) => (
  <div className={props.bemBlocks.item().mix(props.bemBlocks.container("item"))}>
    loading please wait...
  </div>
)

class App extends SearchkitComponent {

  render(){
    <div>
      <Hits hitsPerPage={50} highlightFields={["title"]} sourceFilter={["title"]}/>
      <InitialLoader component={InitialLoaderComponent}/>
    </div>
  }
}
```

## Props
- `mod` *(string)*: Optional. A custom BEM container class.
- `component` *(ReactComponent)*: React component used to render the contents of `InitialLoader`.
