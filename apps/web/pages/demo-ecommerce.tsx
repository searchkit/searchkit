import { InstantSearch, SearchBox, Hits, Highlight, DynamicWidgets, RefinementList, ToggleRefinement, Panel, Pagination, Stats, connectSearchBox, NumericMenu, RangeInput, CurrentRefinements, QueryRuleCustomData, HierarchicalMenu, RangeSlider, Configure, QueryRuleContext, SortBy } from 'react-instantsearch-dom';
import Client from '@searchkit/instantsearch-client'
import Script from 'next/script';

const searchClient = Client({
  url: '/api/product-search',
});

const hitView = (props: any) => {
  return (
    <div>
      <img src={props.hit.imageURL} className="hit-image" />
      <h3><Highlight hit={props.hit} attribute="designerName" /></h3>
      <p><Highlight hit={props.hit} attribute="name" /></p>

      <br />
    </div>
  )
}

export default function Web() {
    return (
      <div className="ais-InstantSearch bg-slate-50">
        <Script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "c98b302ea3bb4a33a012a7ef0ab3e240"}' />

  
      <InstantSearch
        indexName="mrp-products_sk"
        searchClient={searchClient}
      >
        <Configure
            ruleContexts={['ecommerce']}

        />

        <QueryRuleContext
            trackedFilters={{
              designerName: (values: unknown[]) => values,
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
              <RefinementList attribute="designerName" searchable={true} defaultRefinement={["TOM FORD"]} />
            </Panel>
            <Panel header="Price">
              <RangeInput attribute="price" />
            </Panel>
          {/* </DynamicWidgets> */}
        </div>
        <div className="right-panel">
        <div className="flex">
          <div className="flex-auto w-full py-2 px-4">
            <Stats />
            <CurrentRefinements />
          </div>
          <div className="flex-none">
            <SortBy defaultRefinement='mrp-products_sk' items={[
              { value: 'mrp-products_sk', label: 'Relevance' },
              { value: 'mrp-products_sk_price_asc', label: 'Cheapest' },
              { value: 'mrp-products_sk_price_desc', label: 'Most Expensive' },

            ]}
            />
          </div>
          </div>

          <Hits hitComponent={hitView}/>
          <Pagination />
        </div>
      </InstantSearch>
      </div>
    );
}
