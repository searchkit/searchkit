# <a href="https://searchkit.co/">Searchkit</a> <span>v0.1.4</span>

## Introduction
Searchkit is a suite of UI components built in react. Each component is a react class which you can extend to fit your requirements.

## Setup

### Boilerplate project
Easiest way to get started on a new project is to checkout the example demo site

### From NPM
At the moment we support webpack build system and you can use **searchkit** from NPM. Searchkit is written in typescript so we provide typescript definition files.  

#### Example
```sh
npm install searchkit --save
```

```javascript
import {
	SearchkitManager,
	SearchkitProvider,
	SearchBox,
	Hits,
	HitsStats,
	RefinementListFilter,
	HierarchicalMenuFilter
} from "searchkit";
```
* * *

### Initialization
To use searchkit, we need to instantiate a `SearchkitManager` with a elastic like host url.
We then wrap a searchkit app and render to the page. We will define `<App/>` which contains
react jsx of the various searchkit components a bit later.
```js
import * as React from "react";
import * as ReactDOM from "react-dom";

import {
  SearchkitManager, SearchkitProvider
} from "searchkit";

const searchkit = new SearchkitManager("http://localhost:9200/movies");

ReactDOM.render((
	<SearchkitProvider searchkit={searchkit}>
		<App/>
	</SearchkitProvider>
),  document.getElementById('root'))

```

#### Which searchkit host to provide?
Searchkit connect to an elasticsearch like endpoint `/_search`
this can be either a proxy or for quick development a direct local elastic instance

```js
//direct local elastic search instance
new SearchkitManager("http://localhost:9200/movies");
//or a read only elasticsearch url
new SearchkitManager("<public read only elastic url>");
```

#### If your using elastic locally
If you are are getting a cors related error, you will need to add the following to you
`config/elasticsearch.yml' file
```yaml
http.cors.enabled : true  
http.cors.allow-origin : "*"
http.cors.allow-methods : OPTIONS, HEAD, GET, POST, PUT, DELETE
http.cors.allow-headers : X-Requested-With,X-Auth-Token,Content-Type, Content-Length
```

#### Elastic search Proxy
Often we will not want to connect to a direct instance of elastic, but a proxy
which secures the elasticsearch server and hides index + permissions filtering information from the frontend

A proxy is expected to proxy the `/_search` and `/_msearch` urls depending on which search mode is used.
```js
//a proxy on the same server as the served app
new SearchkitManager("/");
```

#### Express Proxy
Searchkit will ship with a simple elastic proxy if you are using express.js on node.
TODO: installation, config, permissions filter etc
```js
ElasticExpressProxy({
  host:process.env.ELASTIC_URL || "http://localhost:9200",
  log: 'debug',
  index:'movies'
}, app
```

#### Other serverside technologies
TODO:

#### Url synchronization

### Adding Searchkit Components


## Components

### Basics

#### SearchBox
The search box component is where your users type their search queries.

##### Example

```jsx

import {
  SearchBox,
  SearchkitComponent
} from "searchkit";

class App extends SearchkitComponent<any, any> {
  render(){
    <div>
      <SearchBox
        searchOnChange={true}
        prefixQueryFields={["languages","title^10"]}
        queryFields={["title^5"]}/>
    </div>
  }
}
```

##### Props
- `searchOnChange` *(Boolean)*: Optional. Updates search results as you type. Will be false by default.
- `prefixQueryFields` *([string])*: Optional. An array of fields which uses the prefix field search
- `queryFields` *(Array<string>)*: Optional. An array of elasticsearch fields to search within. Can specify boosting on particular fields. Will search `_all` by default.
- `mod` *(string)*: Optional. A custom BEM container class.  

#### Hits
Hits component displays results from ElasticSearch. To customise each result, you need to override the

##### Example

```jsx

import {
  Hits,
  SearchkitComponent
} from "searchkit";

class MovieHits extends Hits {
  renderResult(result:any) {
    return (
      <div className="hit" key={result._id}>
        <img className="hit__poster" src={result._source.poster}/>
        <div className="hit__title">{result._source.title}</div>
      </div>
    )
  }
}

class App extends SearchkitComponent<any, any> {

  render(){
    <div>
      <MovieHits hitsPerPage={50}/>
    </div>
  }
}
```

##### Props
- `hitsPerPage` *(Number)*: Number of results displayed per page

### Navigation

#### Pagination
The pagination component provides ability to go to next and previous page.

##### Example

```jsx

import {
  Pagination,
  SearchkitComponent
} from "searchkit";

class App extends SearchkitComponent<any, any> {

  render(){
    <div>
      <Pagination/>
    </div>
  }
}
```

#### Menu
Provides a way to navigate through results for a single attribute. Only one value can be selected at a time.

##### Example

```jsx

import {
  Pagination,
  Hits,
  SearchkitComponent
} from "searchkit";

class App extends SearchkitComponent<any, any> {

  render(){
    <div>
      <MenuFilter
        field="languages.raw"
        title="Languages" id="languages"/>
    </div>
  }
}
```
##### Props
- `field` *(ESAttribute)*: Non-analysed elastic search field to create aggs for the menu
- `title` *(string)*: Title of the menu. Shown as a header and within selected filters
- `id` *(string)*: id of component. Must be unique. Used as key for url serialisation

#### Hierarchical Menu
Component which renders a tree like structure. Used for items which have multiple levels of categorization. For example product categories & folders.

##### Example

```jsx

import {
  HierarchicalMenuFilter,
  SearchkitComponent
} from "searchkit";

class App extends SearchkitComponent<any, any> {

 render(){
    <div>
      <HierarchicalMenuFilter fields={["categories_lvl1", "categories_lvl2", "categories_lvl3"]} title="Categories" id="categories"/>
    </div>
  }
}
```

##### Props
- `fields` *([ESAttribute])*: An array of non-analysed elastic search fields to create aggs. Levels is derived from the order of the array. If an item had /Appliances/Air Conditioners/Window Air Conditioners category, the values would be as follows: {categories_lvl1:["Appliances"], categories_lvl2:["Air Conditioners"], categories_lvl3:["Window Air Conditioners"]}  
- `title` *(string)*: Title of the menu. Shown as a header and within selected filters
- `id` *(string)*: id of component. Must be unique. Used as key for url serialisation


#### Refinement list
Lets the user refine the search results. You can specify if you want filters to be ORed or ANDed. For example, if you filter on a and b with OR, results with either the value a or b will match.

##### Example

```jsx

import {
  RefinementListFilter,
  SearchkitComponent
} from "searchkit";

class App extends SearchkitComponent<any, any> {

 render(){
    <div>
      <RefinementListFilter id="actors" title="Actors" field="actors.raw" operator="AND"/>
    </div>
  }
}
```

##### Props
- `field` *(ESAttribute)*: Non-analysed elastic search field to create aggs for the menu
- `title` *(string)*: Title of the menu. Shown as a header and within selected filters
- `id` *(string)*: id of component. Must be unique. Used as key for url serialisation
- `operator` *('AND'|'OR')*: If you filter on a and b with OR, results with either the value a or b will match. If you select a and b, results will show which have both a and b.

#### Numeric Refinement List
Allows the user to refine results based on a numerical elasticsearch attribute. You specify an array of options for the user to select from. Will only allow the user to select one.

##### Example

```jsx

import {
  RefinementListFilter,
  SearchkitComponent
} from "searchkit";

class App extends SearchkitComponent<any, any> {

  render(){
    <div>
      <NumericRefinementListFilter id="metascore" title="Meta score" field="metaScore" options={[
        {title:"All"},
        {title:"up to 20", from:0, to:21},
        {title:"21 to 40", from:21, to:41},
        {title:"41 to 60", from:41, to:61},
        {title:"61 to 80", from:61, to:81},
        {title:"81 to 100", from:81, to:101}
      ]}/>
    </div>
  }
}
```
##### Props
- `field` *(ESAttribute)*: Non-analysed elastic search field to create aggs for the menu
- `options` *([{title:string, from?:number, to?:number}])*: Options displayed for the user to refine results with.
- `title` *(string)*: Title of the menu. Shown as a header and within selected filters
- `id` *(string)*: id of component. Must be unique. Used as key for url serialisation

#### Reset
This component clears all the refinements that are currently applied (query and filters)

##### Example

```jsx

import {
  ResetFilters,
  SearchkitComponent
} from "searchkit";

class App extends SearchkitComponent<any, any> {

  render(){
    <div>
      <ResetFilters/>
    </div>
  }
}
```

### Sort

#### SortingSelector
This component lets you reorder your results. Each option requires a sortable Elasticsearch field and the order of which you want to sort by.

##### Example

```jsx
import {
  SortingSelector,
  SearchkitComponent
} from "searchkit";

class App extends SearchkitComponent<any, any> {

  render(){
    <div>
      <SortingSelector options={[
        {label:"Relevance", field:"_score", order:"desc"},
        {label:"Latest Releases", field:"released", order:"desc"},
        {label:"Earliest Releases", field:"released", order:"asc"}
      ]}/>
    </div>
  }
}
```

##### Props
  - `options` *([{label:string, field?:<ESAttribute>, order?:(desc|asc)}])*: Options displayed for the user to order results with.

### Metadata

#### Stats
This component lets you display how many results matched the query and other metrics on the results such as how fast the search was.

##### Example

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

## Extending Components
