# Project Setup
Our recommended project setup is using webpack and typescript. We also support using searchkit with ES6 / Webpack and using normal library script file. Installing via NPM is recommended.

## Using Module
We recommend using webpack for module dependency management of Searchkit's src, css and static assets. requires scss, file loaders to properly resolve searchkit dependencies. See [searchkit boilerplate](https://github.com/searchkit/component-boilerplate).

### Installing via NPM
Searchkit is available on [npm](https://npmjs.com/package/searchkit). Searchkit is written with typescript therefore typescript definition files are available.

```sh
  npm install searchkit --save
```

### Importing with webpack / ES6

```js

import {
	SearchBox,
	RefinementListFilter,
	Hits,
	HitsStats,
	SearchkitComponent,
	SelectedFilters,
	MenuFilter,
	HierarchicalMenuFilter,
	Pagination,
	ResetFilters
} from "searchkit";

```

## Using library script
Searchkit library script is available from bower or from [jsdelivr CDN](https://www.jsdelivr.com/package/npm/searchkit?path=release).

### CDN Script include

```html
	<link href="//cdn.jsdelivr.net/npm/searchkit@2.3.0-9/release/theme.css" rel="stylesheet"/>
	<script src="//cdn.jsdelivr.net/npm/react@16.0.0/umd/react.production.min.js"></script>
	<script src="//cdn.jsdelivr.net/npm/react-dom@16.0.0/umd/react-dom.production.min.js"></script>
	<script src="//cdn.jsdelivr.net/npm/searchkit@2.3.0-9/release/bundle.js"></script>
```

