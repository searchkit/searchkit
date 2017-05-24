# Using Components
Once you have the project setup, elasticsearch correctly indexed with data, we can start by adding components to the page to interact with the elasticsearch instance. For this series of examples we are using typescript with webpack.

## Adding basic components
To use searchkit, we need to instantiate a `SearchkitManager` with a elastic like host url as shown in [connecting elasticsearch](elasticsearch.md).

We then add Searchbox and hits components to the page. This should render the standard searchbox and hits to the page.

```jsx
import * as React from "react";
import * as ReactDOM from "react-dom";

import {
  SearchkitManager, SearchkitProvider, SearchBox, Hits
} from "searchkit";

const searchkit = new SearchkitManager("/");

ReactDOM.render((
	<SearchkitProvider searchkit={searchkit}>
		<div>
			<SearchBox/>
			<Hits/>
		</div>
	</SearchkitProvider>
),  document.getElementById('root'))
```

## Adding a filter based component
Each filter will require a unique id. This is used for url serialisation.

```jsx
import * as React from "react";
import * as ReactDOM from "react-dom";

import {
  SearchkitManager, SearchkitProvider, SearchBox, Hits, RefinementListFilter
} from "searchkit";

const searchkit = new SearchkitManager("/");

ReactDOM.render((
	<SearchkitProvider searchkit={searchkit}>
    <div>
      <SearchBox/>
      <RefinementListFilter id="actors" field="actors.raw"/>
      <Hits/>
    </div>
	</SearchkitProvider>
),  document.getElementById('root'))
```

## Wrapping search in React component
You may want to incapsulate the searchApp within a React component. You can be using the SearchkitComponent class.

```jsx
import * as React from "react";
import * as ReactDOM from "react-dom";

import {
  SearchkitManager, SearchkitProvider, SearchkitComponent
} from "searchkit";

const searchkit = new SearchkitManager("/");

class SearchApp extends SearchkitComponent {
  render() {
    return (
      <div>
        <SearchBox/>
        <Hits/>
      </div>
    )
  }
}

ReactDOM.render((
	<SearchkitProvider searchkit={searchkit}>
		<div>
			<SearchApp/>
		</div>
	</SearchkitProvider>
),  document.getElementById('root'))
```
