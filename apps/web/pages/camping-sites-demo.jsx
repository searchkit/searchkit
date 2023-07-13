import { InstantSearch, SearchBox, Hits, Highlight, createConnector, DynamicWidgets, RefinementList, ToggleRefinement, Panel, Pagination, Stats, connectSearchBox, NumericMenu, RangeInput, CurrentRefinements, QueryRuleCustomData, Snippet, SortBy, Configure, HierarchicalMenu } from 'react-instantsearch-dom';
import Client from '@searchkit/instantsearch-client'
import Script from 'next/script'
import Searchkit from "searchkit"

import {
  GoogleMapsLoader,
  GeoSearch,
  Marker,
} from 'react-instantsearch-dom-maps';

const searchkitClient = new Searchkit({
  connection: {
    host: 'https://commerce-demo.es.us-east4.gcp.elastic-cloud.com:9243',
    apiKey: 'a2Rha1VJTUJMcGU4ajA3Tm9fZ0Y6MjAzX2pLbURTXy1hNm9SUGZGRlhJdw=='
  },
  search_settings: {
    highlight_attributes: ['name'],
    search_attributes: ['name'],
    result_attributes: ['name'],
    facet_attributes: [
      { field: 'price', attribute: 'price', type: 'numeric', nestedPath: 'availabilities' },
      { field: 'region.keyword', attribute: 'region', type: 'string'},
      { field: 'categories_lvl1.keyword', attribute: 'categories_lvl1', type: 'string'},
      { field: 'categories_lvl2.keyword', attribute: 'categories_lvl2', type: 'string'},
    ],
    filter_attributes: [
      { field: 'start', attribute: 'availabilities.start', type: 'date', nestedPath: 'availabilities' },
      { field: 'end', attribute: 'availabilities.end', type: 'date', nestedPath: 'availabilities' }
    ],
    geo_attribute: 'location',
  }
})

const defaultAvailabilityDates = ['2023-06-30', '2024-03-01']
const demo = createConnector({
  displayName: 'AvailabilityDates',
  getProvidedProps: (props, searchState) => {
    return {
      availabilityDates: searchState.availabilityDates || defaultAvailabilityDates
    }
  },
  refine: (props, searchState, nextValue) => {
    return {
      ...searchState,
      availabilityDates: nextValue
    }
  },
  getSearchParameters(searchParameters, props, searchState) {
    const { availabilityDates = defaultAvailabilityDates } = searchState;    
    return searchParameters.addNumericRefinement('availabilities.start', '<=', (new Date(availabilityDates[0])).getTime()).addNumericRefinement('availabilities.end', '>=', (new Date(availabilityDates[1])).getTime());
  },
})

const AvailabilityDates = demo(({ availabilityDates, refine }) => {

  return (
    <div>
      <input type="date"
       value={availabilityDates[0]} onChange={(e) => {
          refine([e.target.value, availabilityDates[1]])
        }}
       ></input>
       <input type="date"
       value={availabilityDates[1]}
       onChange={(e) => {
          refine([availabilityDates[0], e.target.value])
        }}
       ></input>
    </div>
  )
})

const searchClient = Client(searchkitClient);

const hitView = (props) => {
  const availabilities = props.hit.inner_hits?.availabilities || { hits: { hits: [] }}
  return (
    <div>
      <h2><Highlight hit={props.hit} attribute="name" /></h2>
      <br />
      {availabilities.hits.hits.map((availability) => {
        return (
          <div className="mb-3">
            <p>dates: {availability._source.start} - {availability._source.end}</p>
            <p>price: {availability._source.price}</p>
          </div>
        )
      })
      }
    </div>
  )
}

const apiKey = 'AIzaSyAPSJE7wwwvLb4BkLPx3d5xPMof1wo4xrM';
const endpoint = 'https://maps.googleapis.com/maps/api/js?v=weekly';

export default function Web() {
    return (
      <div className="ais-InstantSearch bg-gray-100 h-screen p-4">
        <Script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "c98b302ea3bb4a33a012a7ef0ab3e240"}' />
  
      <InstantSearch
        indexName="search-camping-sites"
        searchClient={searchClient}
      >
        
        <SearchBox />
        <div className="left-panel">
          <HierarchicalMenu attributes={['categories_lvl1', 'categories_lvl2']} />
          <h3>Region</h3>
          <RefinementList attribute="region" searchable={true} />
          <h3>Price</h3>
          <RangeInput attribute="price" header="Range Input" />
          <h3>Dates</h3>
          <AvailabilityDates />
        </div>
        <div className="right-panel">
        
        <div className="flex">
          <div className="flex-auto w-full py-2 px-4">
            <Stats />
            <CurrentRefinements />
          </div>
          </div>

          <div style={{ height: 500 }}>
          <GoogleMapsLoader apiKey={apiKey} endpoint={endpoint}>
          {(google) => (
            <GeoSearch google={google}>
              {({ hits }) => (
                <>
                  {hits.map((hit) => (
                    <Marker key={hit.objectID} hit={hit} />
                  ))}
                </>
              )}
            </GeoSearch>
          )}
        </GoogleMapsLoader>
        </div>

          <Hits hitComponent={hitView}/>
          <Pagination />
        </div>
      </InstantSearch>
      </div>
    );
}
