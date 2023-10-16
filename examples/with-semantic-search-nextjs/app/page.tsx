'use client'
import {
  InstantSearch,
  SearchBox,
  Hits,
  RefinementList,
  Pagination,
  Stats,
  CurrentRefinements,
  Configure,
  DynamicWidgets,
  useQueryRules
} from 'react-instantsearch'
import Client from '@searchkit/instantsearch-client'

const searchClient = Client({
  url: '/api/search'
})

const HitView = (props: any) => {
  return (
    <div>
      <div className="hit__details">
        <h2>{props.hit.title}</h2>
        {props.hit.Plot}
      </div>
    </div>
  )
}

const Panel = ({ header, children }: any) => (
  <div className="panel">
    <h5>{header}</h5>
    {children}
  </div>
)

export default function Web() {
  return (
    <div className="">
      <InstantSearch indexName="imdb-movies-semantic-search" searchClient={searchClient} routing>
        <Configure hitsPerPage={15} />
        <div className="container">
          <div className="search-panel">
            <div className="search-panel__filters">
              <DynamicWidgets facets={['*']}>
                <Panel header="genre">
                  <RefinementList attribute="genre" searchable />
                </Panel>
              </DynamicWidgets>
            </div>
            <div className="search-panel__results">
              <div className="searchbox">
                <SearchBox />
              </div>

              <Stats />
              <CurrentRefinements />

              <Hits hitComponent={HitView} />
              <Pagination />
            </div>
          </div>
        </div>
      </InstantSearch>
    </div>
  )
}
