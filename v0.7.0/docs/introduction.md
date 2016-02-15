## What is Searchkit?
Searchkit is a suite of UI components built in react. The aim is rapidly create beautiful search applications using declarative components, and without being an ElasticSearch expert.

<img src="./docs/assets/codepreview.png"/>

See [Getting Started](/docs/setup/README.md)

## Quick Intro

```jsx

const searchkit = new SearchkitManager("http://demo.searchkit.co/api/movies/")

const App = ()=> (
  <SearchkitProvider searchkit={searchkit}>
    <div>
      <div className="example-search-site__query">
        <SearchBox autofocus={true} mod="example-search-box" searchOnChange={true} prefixQueryFields={["actors^1","type^2","languages","title^10"]}/>
      </div>
      <div className="example-search-site__applied-filters">
        <SelectedFilters mod="example-applied-filters"/>
        <ResetFilters mod="example-reset-filters"/>
        <HitsStats/>
      </div>
      <div className="example-search-site__filters">
        <HierarchicalMenuFilter fields={["type.raw", "genres.raw"]} title="Categories" id="categories"/>
        <RefinementListFilter id="actors" title="Actors" field="actors.raw" operator="AND" size={10}/>
      </div>
      <div className="example-search-site__results">
        <Hits hitsPerPage={10} mod="example-hits" itemComponent={MovieHitsItem} sourceFilter={["title", "poster", "imdbId"]}/>
      </div>
    </div>
  </SearchkitProvider>
)

ReactDOM.render(<App/>, document.getElementById('root'))

```

[Live demo](http://demo.searchkit.co)
