import { useEffect, useState } from 'react'
import { InstantSearch, SearchBox, Hits, Highlight, RefinementList, Pagination, Stats, RangeInput, CurrentRefinements, HierarchicalMenu, useRange } from 'react-instantsearch';
import Client from '@searchkit/instantsearch-client'
import Head from 'next/head'
import Searchkit from "searchkit"
import GeoMap from '../components/GeoMap'

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
const AvailabilityDates = () => {
  const [availabilityDates, setAvailabilityDates] = useState(defaultAvailabilityDates)
  const [startDate, endDate] = availabilityDates
  // Managed numeric refinements (like the price RangeInput). Configure's numericFilters
  // cannot be mixed with them, so the dates are applied through useRange instead.
  const startRange = useRange({ attribute: 'availabilities.start' })
  const endRange = useRange({ attribute: 'availabilities.end' })

  useEffect(() => {
    // refine takes a [min, max] tuple in react-instantsearch v7
    startRange.refine([undefined, new Date(startDate).getTime()])
    endRange.refine([new Date(endDate).getTime(), undefined])
    // Refine only when the dates change: useRange returns a new object every render, so listing
    // startRange/endRange would refine (and re-search) on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate])

  return (
    <div>
      <input type="date"
       value={startDate} onChange={(e) => {
          setAvailabilityDates([e.target.value, endDate])
        }}
       ></input>
       <input type="date"
       value={endDate}
       onChange={(e) => {
          setAvailabilityDates([startDate, e.target.value])
        }}
       ></input>
    </div>
  )
}

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
        <Head>
            <title>Camping sites Demo</title>
        </Head>
  
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

          <GeoMap apiKey={apiKey} endpoint={endpoint} height={500} />

          <Hits hitComponent={hitView}/>
          <Pagination />
        </div>
      </InstantSearch>
      </div>
    );
}
