import { InstantSearch, Hits, RefinementList } from 'react-instantsearch';
import Client from '@searchkit/instantsearch-client'
import Searchkit from "searchkit"
import Head from "next/head"
import GeoMap from '../components/GeoMap'

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

const apiKey = 'AIzaSyAPSJE7wwwvLb4BkLPx3d5xPMof1wo4xrM';
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
        <Head>
            <title>Geo Search demo</title>
        </Head>
      <InstantSearch
        indexName="us_parks"
        searchClient={searchClient}
      >
        <GeoMap apiKey={apiKey} endpoint={endpoint} height={500} />

        <div className="left-panel p-4">
          <RefinementList attribute="states" />
        </div>
        <div className="right-panel">
          <Hits hitComponent={hitView}/>
        </div>
      </InstantSearch>
      </div>
    );
}
