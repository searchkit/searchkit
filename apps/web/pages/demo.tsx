import { InstantSearch, SearchBox, Hits, Highlight, DynamicWidgets, RefinementList, Pagination, Stats, RangeInput, CurrentRefinements, Snippet, SortBy, InstantSearchServerState, InstantSearchSSRProvider, useHits, HitsProps } from 'react-instantsearch-hooks-web';
import { getServerState } from 'react-instantsearch-hooks-server';
import { renderToString } from 'react-dom/server';
import Head from "next/head"

import Client from '@searchkit/instantsearch-client'
import Searchkit from "searchkit"
import { config } from "./api/config"
import { GetServerSideProps } from 'next';
import { createInstantSearchRouterNext } from 'react-instantsearch-hooks-router-nextjs';
import singletonRouter from 'next/router';

const Panel = ({ header, children }: { header: string, children: any }) => (
  <div className="mb-4">
    <h3 className="mb-2">{header}</h3>
    {children}
  </div>
);

const CustomHits = (props: HitsProps<any>) => {
    const { hits, results, sendEvent } = useHits(props);
  
    return (
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">

      {hits.map((hit: any) => (
        <div className="bg-white rounded-lg overflow-hidden shadow">
          <img src={hit.poster} alt="movie cover" className="w-full h-64 object-cover"/>
          <div className="p-4">
            <h3 className="text-lg font-semibold"><Highlight hit={hit} attribute="title" /></h3>
            <p className="text-gray-600">      <Snippet hit={hit} attribute="plot" /> </p> 
            </div>
            </div>
            ))};
            </div>
    );
  }

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
        <Head>
          <title>Searchkit Demo</title>
        </Head>
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
          <div className="flex-auto w-full py-2 items-center h-full ">
            <Stats classNames={{
              root: 'text-md text-gray-600',

            }} />
            <CurrentRefinements classNames={{
              
            }} />
            <div className="flex-none">
              <SortBy items={[
                { value: 'imdb_movies', label: 'Relevance' },
                { value: 'imdb_movies_rated_desc', label: 'Highly Rated Movies' },
              ]}
              />
          </div>
          </div>
          </div>
            <CustomHits/>

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
