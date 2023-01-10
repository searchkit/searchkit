import { InstantSearch, SearchBox, Hits, Highlight, DynamicWidgets, RefinementList, ToggleRefinement, Panel, Pagination, Stats, connectSearchBox, NumericMenu, RangeInput, CurrentRefinements, QueryRuleCustomData } from 'react-instantsearch-dom';
import Client from '@searchkit/instantsearch-client'
import Script from 'next/script'

const searchClient = Client({
  url: '/api/search',
});

const hitView = (props: any) => {
  return (
    <div>
      <img src={props.hit.poster} className="hit-image" />
      <h2><Highlight hit={props.hit} attribute="title" /></h2>
      <br />
      
      <Highlight hit={props.hit} attribute="actors" />

    </div>
  )
}

export default function Web() {
    return (
      <div className="ais-InstantSearch">
        <Script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "c98b302ea3bb4a33a012a7ef0ab3e240"}' />
  
      <InstantSearch
        indexName="imdb_movies"
        searchClient={searchClient}
      >
        <SearchBox />
        <div className="left-panel">
          {/* @ts-ignore */}
          <DynamicWidgets maxValuesPerFacet={5} fallbackWidget={RefinementList}>
            <Panel header="Type">
              <RefinementList attribute="type" searchable={true}/>
            </Panel>
            <Panel header="actors">
              <RefinementList attribute="actors" searchable={true} limit={10} />
            </Panel>
            <Panel header="imdbrating">
              <NumericMenu
                attribute="imdbrating"
                items={[
                  { label: '5 - 7', start: 5, end: 7 },
                  { label: '7 - 9', start: 7, end: 9 },
                  { label: '>= 9', start: 9 },
                ]}
              />
            </Panel>
            <Panel header="metascore">
              <RangeInput attribute="metascore" header="Range Input" />
            </Panel>
          </DynamicWidgets>
        </div>
        <div className="right-panel">
        <QueryRuleCustomData>
        {({ items }: { items: any[] }) =>
          items.map(({ title }) => {
            if (!title) {
              return null;
            }

            return (
              <section key={title}>
                <h2>{title}</h2>
                <p>You have typed in movie, show something wild about movies!</p>
              </section>
            );
          })
        }
      </QueryRuleCustomData>
          <Stats />
          <CurrentRefinements />

          <Hits hitComponent={hitView}/>
          <Pagination />
        </div>
      </InstantSearch>
      </div>
    );
}
