import { InstantSearch, SearchBox, Hits, Highlight, DynamicWidgets, RefinementList, ToggleRefinement, Panel, Pagination, Stats, connectSearchBox, NumericMenu, RangeInput, CurrentRefinements, QueryRuleCustomData, HierarchicalMenu, RangeSlider, Configure, QueryRuleContext } from 'react-instantsearch-dom';
import Client from '@searchkit/instantsearch-client'

const searchClient = Client({
  url: '/api/product-search',
});

const hitView = (props: any) => {
  return (
    <div>
      <img src={props.hit.imageURL} className="hit-image" />
      <h2><Highlight hit={props.hit} attribute="name" /></h2>
      <br />
    </div>
  )
}

export default function Web() {
    return (
      <div className="ais-InstantSearch">
  
      <InstantSearch
        indexName="mrp-products_sk"
        searchClient={searchClient}
      >
        <Configure
            ruleContexts={['ecommerce']}
        />

        <QueryRuleContext
            trackedFilters={{
              designerName: (values) => values,
            }}
            transformRuleContexts={(ruleContexts: string[]) => {
              return ruleContexts;
            }}
          />

        <SearchBox />
        <div className="left-panel">
          {/* @ts-ignore */}
          {/* <DynamicWidgets maxValuesPerFacet={5} fallbackWidget={RefinementList}> */}
            <Panel header="Categories">
              <HierarchicalMenu attributes={["categories_lvl1", "categories_lvl2", "categories_lvl3"]} searchable={true}/>
            </Panel>
            <Panel header="Designer Name">
              <RefinementList attribute="designerName" searchable={true}/>
            </Panel>
          {/* </DynamicWidgets> */}
        </div>
        <div className="right-panel">
          <Stats />
          <CurrentRefinements />

          <Hits hitComponent={hitView}/>
          <Pagination />
        </div>
      </InstantSearch>
      </div>
    );
}
