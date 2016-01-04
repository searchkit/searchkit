## What is Searchkit?
Searchkit is a suite of UI components built in react. The aim is rapidly create beautiful search applications using declarative components, and without being an ElasticSearch expert.

<img src="./docs/assets/codepreview.png"/>

<img src="https://circleci.com/gh/searchkit/searchkit.png"/>
[![npm version](https://badge.fury.io/js/searchkit.svg)](https://badge.fury.io/js/searchkit)

See full [Documentation](https://ssetem.gitbooks.io/searchkit/content/) or [Getting Started](https://ssetem.gitbooks.io/searchkit/content/docs/setup/index.html)

## Quick Intro
[Live demo](http://demo.searchkit.co)

```jsx

const host = "https://kili-eu-west-1.searchly.com/movies/"
const sk = new SearchkitManager(host, {
  multipleSearchers:false,
  basicAuth:"read:teetndhjnrspbzxxyfxmf5fb24suqxuj"
})

class App extends React.Component {

  <SearchkitProvider searchkit={sk}>
    <div>
      <div className="example-search-site__query">
        <SearchBox
         autofocus={true}
         searchOnChange={true}
         prefixQueryFields={["actors^1","type^2","languages","title^10"]}/>
      </div>
      <div className="example-search-site__applied-filters">
        <SelectedFilters/>
        <ResetFilters/>
        <HitsStats/>
      </div>
      <div className="example-search-site__filters">
        <HierarchicalMenuFilter
          fields={["type.raw", "genres.raw"]}
          title="Categories"
          id="categories"/>
        <RefinementListFilter
          id="actors"
          title="Actors"
          field="actors.raw"
          operator="AND"
          size={10}/>
      </div>
      <div className="example-search-site__results">
        <Hits hitsPerPage={10}/>
      </div>
    </div>
  </SearchkitProvider>
}

ReactDOM.render((
  <App/>
),  document.getElementById('root'))

```
