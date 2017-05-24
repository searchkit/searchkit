
# Getting started
To use searchkit, we need to instantiate a `SearchkitManager` with a elastic like host url.
We then wrap a searchkit app and render to the page.

```js
import * as React from "react";
import * as ReactDOM from "react-dom";

import {
  SearchkitManager, SearchkitProvider
} from "searchkit";

const searchkit = new SearchkitManager("http://localhost:9200/movies");

ReactDOM.render((
	<SearchkitProvider searchkit={searchkit}>
		<div>
			<SearchBox/>
			<Hits/>
		</div>
	</SearchkitProvider>
),  document.getElementById('root'))
```
