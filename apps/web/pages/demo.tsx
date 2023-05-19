import { InstantSearch, SearchBox, Hits, Highlight, DynamicWidgets, RefinementList, Pagination, Stats, RangeInput, CurrentRefinements, Snippet, SortBy, InstantSearchServerState, InstantSearchSSRProvider } from 'react-instantsearch-hooks-web';
import { getServerState } from 'react-instantsearch-hooks-server';
import { renderToString } from 'react-dom/server';

import Client from '@searchkit/instantsearch-client'
import Searchkit from "searchkit"
import { config } from "./api/config"
import { GetServerSideProps } from 'next';
import { createInstantSearchRouterNext } from 'react-instantsearch-hooks-router-nextjs';
import singletonRouter from 'next/router';

const hitView = (props: any) => {
  return (
    <div>
      <img src={props.hit.poster} className="hit-image" />
      <h2><Highlight hit={props.hit} attribute="title" /></h2>
      <br />
      
      <Snippet hit={props.hit} attribute="plot" />

    </div>
  )
}

const Panel = ({ header, children }: { header: string, children: any }) => (
  <div className="mb-4">
    <h3 className="mb-2">{header}</h3>
    {children}
  </div>
);

type WebProps = {
  serverState?: InstantSearchServerState;
  url?: string;
};

const searchkitClient = new Searchkit(config)
const searchClient = Client(searchkitClient);

export default function Web({ serverState, url }: WebProps) {


    return (
      <InstantSearchSSRProvider {...serverState}>

      <div className="ais-InstantSearch bg-gray-100 h-screen p-4">
  
      <InstantSearch
        indexName="imdb_movies"
        searchClient={searchClient}
        routing={{
          router: createInstantSearchRouterNext({
            singletonRouter,
            serverUrl: url,
          }),
        }}
      >
        <SearchBox placeholder='search movies' />
        <div className="left-panel">
          <DynamicWidgets fallbackComponent={FallbackComponent} facets={[]}>
            <Panel header="actors">
              <RefinementList attribute="actors" searchable={true} limit={10} searchablePlaceholder='search actors' />
            </Panel>
            <Panel header="metascore">
              <RangeInput attribute="metascore" />
            </Panel>
          </DynamicWidgets>
        </div>
        <div className="right-panel">
        <div className="flex">
          <div className="flex-auto w-full py-2 px-4">
            <Stats />
            <CurrentRefinements />
          </div>
          <div className="flex-none">
            <SortBy items={[
              { value: 'imdb_movies', label: 'Relevance' },
              { value: 'imdb_movies_rated_desc', label: 'Highly Rated Movies' },
            ]}
            />
          </div>
          </div>

          <Hits hitComponent={hitView}/>
          <Pagination />
        </div>
      </InstantSearch>
      </div>
      </InstantSearchSSRProvider>
    );
}

function FallbackComponent({ attribute }: { attribute: string }) {
  return (
    <Panel header={attribute}>
      <RefinementList attribute={attribute} />
    </Panel>
  );
}

export const getServerSideProps: GetServerSideProps<WebProps> =
  async function getServerSideProps({ req }) {
    const protocol = req.headers.referer?.split('://')[0] || 'https';
    const url = `${protocol}://${req.headers.host}${req.url}`;
    const serverState = await getServerState(<Web url={url} />, {
      renderToString,
    });

    return {
      props: {
        serverState,
        url,
      },
    };
  };
