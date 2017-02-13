const {
  SearchkitManager,SearchkitProvider,
  SearchBox, Hits, RefinementListFilter, Pagination,
  CheckboxFilter,
  HierarchicalMenuFilter, HitsStats, SortingSelector, NoHits,
  GroupedSelectedFilters, SelectedFilters, ResetFilters,
  RangeFilter, NumericRefinementListFilter,
  ViewSwitcherHits, ViewSwitcherToggle, Select, Toggle,
  ItemList, CheckboxItemList, ItemHistogramList, Tabs, TagCloud, MenuFilter,
  renderComponent, PageSizeSelector, RangeSliderHistogramInput, Panel, PaginationSelect,

  InputFilter, TagFilter, TagFilterList, TagFilterConfig,

  TermQuery, RangeQuery, BoolMust,

  Layout, LayoutBody, LayoutResults, SideBar, TopBar, ActionBar, ActionBarRow
} = require("../../../../../src")
const host = "http://demo.searchkit.co/api/movies"
import * as ReactDOM from "react-dom";
import * as React from "react";
const searchkit = new SearchkitManager(host)

import * as _ from "lodash"
import {map} from "lodash"
import {isUndefined} from "lodash"

import { TogglePanel } from './TogglePanel'

require("../../../../../theming/theme.scss")
require("./customisations.scss")

const MovieHitsGridItem = (props)=> {
  const {bemBlocks, result} = props
  let url = "http://www.imdb.com/title/" + result._source.imdbId
  const source:any = _.extend({}, result._source, result.highlight)
  return (
    <div className={bemBlocks.item().mix(bemBlocks.container("item"))} data-qa="hit">
      <a href={url} target="_blank">
        <img data-qa="poster" className={bemBlocks.item("poster")} src={result._source.poster} width="170" height="240"/>
        <div data-qa="title" className={bemBlocks.item("title")} dangerouslySetInnerHTML={{__html:source.title}}>
        </div>
      </a>
    </div>
  )
}

const MovieHitsListItem = (props)=> {
  const {bemBlocks, result} = props
  let url = "http://www.imdb.com/title/" + result._source.imdbId
  const source:any = _.extend({}, result._source, result.highlight)
  const { title, poster, writers = [], actors = [], genres = [], plot, released, rated } = source;

  return (
    <div className={bemBlocks.item().mix(bemBlocks.container("item"))} data-qa="hit">
      <div className={bemBlocks.item("poster")}>
        <img data-qa="poster" src={result._source.poster}/>
      </div>
      <div className={bemBlocks.item("details")}>
        <a href={url} target="_blank"><h2 className={bemBlocks.item("title")} dangerouslySetInnerHTML={{__html:source.title}}></h2></a>
        <h3 className={bemBlocks.item("subtitle")}>Released in {source.year}, rated {source.imdbRating}/10</h3>
        <ul className={bemBlocks.item("tags")}>
          <li>Genres: <TagFilterList field="genres.raw" values={genres} /></li>
          <li>Writers: <TagFilterList field="writers.raw" values={writers} /></li>
          <li>Actors: <TagFilterList field="actors.raw" values={actors} /></li>
        </ul>
        <div className={bemBlocks.item("text")} dangerouslySetInnerHTML={{__html:source.plot}}></div>
      </div>
    </div>
  )
}

export class MovieHitsCell extends React.Component<any, {}> {
  render(){
    const { hit, columnKey, columnIdx } = this.props
    if (columnKey === "poster"){
      return (
        <td key={columnIdx + '-' + columnKey} style={{margin: 0, padding: 0, width: 40}}>
          <img data-qa="poster" src={hit._source.poster} style={{width: 40}}/>
        </td>
      )
    } else {
      return <td key={columnIdx + '-' + columnKey}>{hit._source[columnKey]}</td>
    }
  }
}

export class HitsTable extends React.Component<any, {}>{

  constructor(props){
    super(props)
    this.renderHeader = this.renderHeader.bind(this)
    this.renderCell = this.renderCell.bind(this)
  }

  renderHeader(column, idx){
    if ((typeof column) === "string"){
      return <th key={idx + "-" + column}>{column}</th>
    } else {
      const label = isUndefined(column.label) ? column.key : column.label
      return <th key={idx + "-" + column.key} style={column.style}>{label}</th>
    }
  }

  renderCell(hit, column, idx){
    const { cellComponent } = this.props

    const key = ((typeof column) === "string") ? column : column.key
    var element;
    if (cellComponent){
      return renderComponent(cellComponent, {hit, columnKey: key, key, column, columnIdx: idx})
    } else {
      return <td key={idx + '-' + key}>{hit._source[key]}</td>
    }
  }

  render(){
    const { columns, hits } = this.props
    return (
      <div style={{width: '100%', boxSizing: 'border-box', padding: 8}}>
        <table className="sk-table sk-table-striped" style={{width: '100%', boxSizing: 'border-box'}}>
          <thead>
            <tr>{map(columns, this.renderHeader)}</tr>
          </thead>
          <tbody>
            {map(hits, (hit: any) => (
              <tr key={hit._id}>
                {map(columns, (col, idx) => this.renderCell(hit, col, idx))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
}

class MovieHitsTable extends React.Component<any, {}> {

  render(){
    const { hits } = this.props
    return (
      <div style={{width: '100%', boxSizing: 'border-box', padding: 8}}>
        <table className="sk-table sk-table-striped" style={{width: '100%', boxSizing: 'border-box'}}>
          <thead>
            <tr>
              <th></th>
              <th>Title</th>
              <th>Year</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            {map(hits, (hit:any) => (
              <tr key={hit._id}>
                <td style={{margin: 0, padding: 0, width: 40}}>
                  <img data-qa="poster" src={hit._source.poster} style={{width: 40}}/>
                </td>
                <td>{hit._source.title}</td>
                <td>{hit._source.year}</td>
                <td>{hit._source.imdbRating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
}

const listComponents = {
  list: ItemList,
  checkbox: CheckboxItemList,
  histogram: ItemHistogramList,
  select: Select,
  tabs: (props) => <Tabs {...props} showCount={false}/>,
  tags: (props) => <TagCloud {...props} showCount={false} />,
  toggle: (props) => <Toggle {...props} showCount={false}/>
}

class App extends React.Component<any, any> {

  constructor(props){
    super(props)

    this.state = {
      viewMode: "list"
    }
  }

  handleViewModeChange(e){
    this.setState({viewMode: e.target.value})
  }

  render(){
    return (
      <SearchkitProvider searchkit={searchkit}>
        <Layout>

          <TopBar>
            <SearchBox autofocus={true} searchOnChange={false} prefixQueryFields={["actors^1","type^2","languages","title^10"]}/>
          </TopBar>

          <LayoutBody>

            <SideBar>
              <Panel title="Selected Filters" collapsable={true} defaultCollapsed={false}>
                <SelectedFilters/>
              </Panel>
              <CheckboxFilter id="rated-r" title="Rating" label="Rated R" filter={TermQuery("rated.raw", 'R')} />
              <CheckboxFilter id="recent" title="Date" label="Recent" filter={RangeQuery("year", {gt: 2012})} />
              <CheckboxFilter id="old-movies" title="Movile filter" label="Old movies" filter={
                BoolMust([
                  RangeQuery("year", {lt: 1970}),
                  TermQuery("type.raw", "Movie")
                ])} />

              <InputFilter id="author_q" title="Actors filter" placeholder="Search actors" searchOnChange={false} blurAction="search" queryFields={["actors"]}/>
              <InputFilter id="writer_q" title="Writers filter" placeholder="Search writers" searchOnChange={false} blurAction="restore" queryFields={["writers"]}/>
              <MenuFilter field={"type.raw"} size={10} title="Movie Type" id="types" listComponent={listComponents[this.state.viewMode]}
                containerComponent={
                (props) => (
                  <TogglePanel {...props} rightComponent={(
                      <select value={this.state.listMode} onChange={this.handleViewModeChange.bind(this) }>
                        <option value="list">List</option>
                        <option value="checkbox">Checkbox</option>
                        <option value="histogram">Histogram</option>
                        <option value="select">Select</option>
                        <option value="tabs">Tabs</option>
                        <option value="tags">TagCloud</option>
                        <option value="toggle">Toggle</option>
                      </select>
                    )} />
                )
              }/>

              <HierarchicalMenuFilter fields={["type.raw", "genres.raw"]} title="Categories" id="categories"/>
              <RangeFilter min={0} max={100} field="metaScore" id="metascore" title="Metascore" showHistogram={true}/>
              <RangeFilter min={0} max={10} field="imdbRating" id="imdbRating" title="IMDB Rating" showHistogram={true} rangeComponent={RangeSliderHistogramInput}/>
              <TagFilterConfig id="genres" title="Genres" field="genres.raw" />
              <RefinementListFilter id="actors" title="Actors" field="actors.raw" size={10}/>
              <RefinementListFilter translations={{"facets.view_more":"View more writers"}} id="writers" title="Writers" field="writers.raw" operator="OR" size={10}/>
              <RefinementListFilter id="countries" title="Countries" field="countries.raw" operator="OR" size={10}/>
              <NumericRefinementListFilter countFormatter={(count)=>"#"+count} listComponent={Select} id="runtimeMinutes" title="Length" field="runtimeMinutes" options={[
                {title:"All"},
                {title:"up to 20", from:0, to:20},
                {title:"21 to 60", from:21, to:60},
                {title:"60 or more", from:61, to:1000}
              ]}/>
            </SideBar>

            <LayoutResults>

              <ActionBar>

                <ActionBarRow>
                  <HitsStats translations={{
                    "hitstats.results_found":"{hitCount} results found"
                  }}/>
                  <ViewSwitcherToggle/>
                  {/*<ViewSwitcherToggle listComponent={Select}/>*/}
                  <PageSizeSelector options={[4,12,25]} listComponent={Toggle }/>
                  <SortingSelector options={[
                    {label:"Relevance", field:"_score", order:"desc"},
                    {label:"Latest Releases", field:"released", order:"desc"},
                    {label:"Earliest Releases", field:"released", order:"asc"}
                  ]}/>
                  {/*<SortingSelector options={[
                    {label:"Relevance", field:"_score", order:"desc"},
                    {label:"Latest Releases", field:"released", order:"desc"},
                    {label:"Earliest Releases", field:"released", order:"asc"}
                  ]} listComponent={Toggle}/>*/}
                </ActionBarRow>

                <ActionBarRow>
                  <GroupedSelectedFilters/>
                  <ResetFilters/>
                </ActionBarRow>

              </ActionBar>

              <ViewSwitcherHits
                  hitsPerPage={12} highlightFields={["title","plot"]}
                  sourceFilter={["plot", "title", "poster", "imdbId", "imdbRating", "year", "genres", "writers", "actors"]}
                  hitComponents = {[
                    {key:"grid", title:"Grid", itemComponent:MovieHitsGridItem},
                    {key:"list", title:"List", itemComponent:MovieHitsListItem},
                    {key:"movie-table", title:"Movies", listComponent:MovieHitsTable, defaultOption:true},
                    {key:"table", title:"Table", listComponent:<HitsTable
                      cellComponent={MovieHitsCell}
                      columns={[
                        {key: 'poster', label: '', style:{ width: 40}},
                        'title',
                        'year',
                        {key: 'imdbRating', label: 'rating'}
                      ]} />}
                  ]}
                  scrollTo="body"
              />
              <NoHits suggestionsField={"title"}/>
              <Pagination showNumbers={true}/>
              <PaginationSelect/>
            </LayoutResults>
          </LayoutBody>
        </Layout>
      </SearchkitProvider>
    )
  }
}

ReactDOM.render(<App/>, document.getElementById("root"))
