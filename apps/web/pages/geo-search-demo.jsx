import { InstantSearch, Hits, RefinementList } from 'react-instantsearch-dom';
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
    result_attributes: ["title", "description"],
    search_attributes: [],
    facet_attributes: [{ attribute: "states", field: "states.keyword", type: "string"}],
    geo_attribute: "location",
  }
})

const searchClient = Client(searchkitClient);

const apiKey = 'AIzaSyCnxbEhpVqsd7m-dDGb3mJrFEnZFSKdKOU';
const endpoint = 'https://maps.googleapis.com/maps/api/js?v=weekly';

const hitView = (props) => {
  return (
    <div>
      <h2>{props.hit.title}</h2>      
      <p>{props.hit.description}</p>
    </div>
  )
}

export default function Web() {
    return (
      <div className="ais-InstantSearch bg-gray-100 h-screen p-4">
        <Script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "c98b302ea3bb4a33a012a7ef0ab3e240"}' />
  
      <InstantSearch
        indexName="us_parks"
        searchClient={searchClient}
      >
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

        <div className="left-panel p-4">
          <RefinementList attribute="states" />
        </div>
        <div className="right-panel">
          <Hits hitComponent={hitView}/>
        </div>

        </div>
      </InstantSearch>
      </div>
    );
}
