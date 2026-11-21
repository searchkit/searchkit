'use client'
import { InstantSearch, RefinementList, Stats, CurrentRefinements } from 'react-instantsearch'
import Client from '@searchkit/instantsearch-client'

const searchClient = Client({
  url: '/api/search'
})

// Facet value ordering: `brand` lists the most common brands, `brand_az` (configured with
// `order: 'alpha'` in app/api/search/route.ts) lists brands alphabetically from the start of
// the field. `sortBy` keeps that order in the widget, which otherwise sorts by count.
export default function FacetOrder() {
  return (
    <InstantSearch indexName="products" searchClient={searchClient}>
      <div className="container">
        <div className="search-panel">
          <div className="search-panel__filters">
            <div className="panel" data-testid="brand-by-count">
              <h5>brand (most common)</h5>
              <RefinementList attribute="brand" />
            </div>
            <div className="panel" data-testid="brand-a-z">
              <h5>brand (A–Z)</h5>
              <RefinementList attribute="brand_az" sortBy={['name:asc']} searchable />
            </div>
          </div>
          <div className="search-panel__results">
            <Stats />
            <CurrentRefinements />
          </div>
        </div>
      </div>
    </InstantSearch>
  )
}
