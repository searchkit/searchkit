'use client'
import {
  InstantSearch,
  SearchBox,
  Hits,
  Highlight,
  RefinementList,
  Pagination,
  Stats,
  Snippet,
  CurrentRefinements,
  HierarchicalMenu,
  Configure,
  DynamicWidgets,
  RangeInput,
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
        <h2>
          <Highlight attribute="name" hit={props.hit} />
        </h2>
        <Snippet attribute="description" hit={props.hit} />
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

const QueryRulesBanner = () => {
  const { items } = useQueryRules({})
  if (items.length === 0) {
    return null
  }

  return (
    <div className="query-rules">
      {items.map((item) => (
        <div key={item.objectID} className="query-rules__item">
          <a href={item.url}>
            <b className="query-rules__item-title">{item.title}</b>
            <span className="query-rules__item-description">{item.body}</span>
          </a>
        </div>
      ))}
    </div>
  )
}

export default function Web() {
  return (
    <div className="">
      <InstantSearch indexName="products" searchClient={searchClient} routing>
        <Configure hitsPerPage={15} />
        <div className="container">
          <div className="search-panel">
            <div className="search-panel__filters">
              <DynamicWidgets facets={['*']}>
                <Panel header="brand">
                  <RefinementList attribute="brand" searchable />
                </Panel>
                <Panel header="categories">
                  <HierarchicalMenu
                    attributes={['categories.lvl0', 'categories.lvl1', 'categories.lvl2']}
                  />
                </Panel>
                <Panel header="price">
                  <RangeInput attribute="price" />
                </Panel>
              </DynamicWidgets>
            </div>
            <div className="search-panel__results">
              <div className="searchbox">
                <SearchBox />
              </div>

              <Stats />
              <CurrentRefinements />
              <QueryRulesBanner />

              <Hits hitComponent={HitView} />
              <Pagination />
            </div>
          </div>
        </div>
      </InstantSearch>
    </div>
  )
}
