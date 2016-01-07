const {
  SearchkitManager,SearchkitProvider,
  SearchBox, Hits, RefinementListFilter,
  HierarchicalMenuFilter, HitsStats,
  SelectedFilters, ResetFilters
} = Searchkit

class MovieHits extends Hits {
  renderResult(result:any) {
    return (
      <div data-qa="hit" className={this.bemBlocks.item().mix(this.bemBlocks.container("item"))} key={result._id}>
        <div className={this.bemBlocks.item("title")}>{result._source.title}</div>
      </div>
    )
  }
}

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
        <MovieHits hitsPerPage={10} mod="example-hits"/>
      </div>
    </div>
  </SearchkitProvider>
)
console.log("hi")
ReactDOM.render(<App/>, document.getElementById("app"))
