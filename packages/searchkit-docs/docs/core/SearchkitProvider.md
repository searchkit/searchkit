# SearchkitProvider
A `react` component to provide a [SearchkitManager](SearchkitManager.md) instance to all descendant react components

## Usage
```js
import {
  SearchkitManager,
  SearchkitProvider
} from "searchkit"

const searchkit = new SearchkitManager("/")
const App = ()=> (
  <SearchkitProvider searchkit={searchkit}>
    //... app with searchkit components
  </SearchkitProvider>
)

ReactDOM.render(<App/>, document.getElementById("app"))

```

>**Note** `SearchkitProvider` will add the `SearchkitManager` to the context and is automatically read by components extending [SearchkitComponent](SearchkitComponent.md)
