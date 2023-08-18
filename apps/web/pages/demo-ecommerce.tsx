import { InstantSearch, SearchBox, Hits, Highlight, DynamicWidgets, RefinementList, Pagination, Stats, RangeInput, CurrentRefinements, Snippet, SortBy, InstantSearchServerState, InstantSearchSSRProvider, HierarchicalMenu, ToggleRefinement } from 'react-instantsearch-hooks-web';
import { getServerState } from 'react-instantsearch-hooks-server';
import { renderToString } from 'react-dom/server';

import Client from '@searchkit/instantsearch-client'
import { GetServerSideProps } from 'next';
import { createInstantSearchRouterNext } from 'react-instantsearch-hooks-router-nextjs';
import singletonRouter from 'next/router';

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

const Panel = ({ header, children }: { header: string, children: any }) => (
  <div className="mb-4">
    <h3 className="mb-2">{header}</h3>
    {children}
  </div>
);

type WebProps = {
  serverState?: InstantSearchServerState;
  url?: string;
  serverUrl?: string;
};

export default function Web({ serverState, url, serverUrl }: WebProps) {

    const searchClient = Client({
      url: serverUrl + '/api/product-search',
    });

    return (
      <InstantSearchSSRProvider {...serverState}>

        <div className="ais-InstantSearch bg-gray-100 h-screen p-4">

        <InstantSearch
        indexName="search-ecommerce"
        searchClient={searchClient}
        routing={{
          router: createInstantSearchRouterNext({
            singletonRouter,
            serverUrl: url,
          }),
        }}
      >

        <SearchBox />
        <div className="left-panel">
          <Panel header="Categories">
            <HierarchicalMenu attributes={["categories_lvl1", "categories_lvl2", "categories_lvl3"]} />
          </Panel>
          <Panel header="Designer Name">
            <RefinementList attribute="designerName" searchable />
          </Panel>
          <Panel header="Price">
            <RangeInput attribute="price" />
          </Panel>
          <ToggleRefinement
            attribute="outOfStock"
            label="Out of Stock"
          />
        </div>
        <div className="right-panel">
        <div className="flex">
          <div className="flex-auto w-full py-2 px-4">
            <Stats />
            <CurrentRefinements />
          </div>
          <div className="flex-none">
            <SortBy items={[
              { value: 'search-ecommerce', label: 'Relevance' },
              { value: 'search-ecommerce_price_asc', label: 'Cheapest' },
              { value: 'search-ecommerce_price_desc', label: 'Most Expensive' },
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

export const getServerSideProps: GetServerSideProps<WebProps> =
  async function getServerSideProps({ req }) {
    const protocol = req.headers.referer?.split('://')[0] || 'http';
    const serverUrl = `${protocol}://${req.headers.host}`;
    const url = `${protocol}://${req.headers.host}${req.url}`;
    const serverState = await getServerState(<Web url={url} serverUrl={serverUrl} />, {
      renderToString,
    });

    return {
      props: {
        serverState,
        url,
        serverUrl
      },
    };
  };

