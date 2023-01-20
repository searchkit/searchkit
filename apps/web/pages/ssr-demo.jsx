import React from 'react';
import { useRouter } from 'next/router';
import qs from 'qs';
import { findResultsState } from 'react-instantsearch-dom/server';
import { App } from '../components/ssr-demo/App';
import Client from '@searchkit/instantsearch-client'

const searchClient = Client({
  url: 'https://ises-cfw.searchkit.workers.dev',
});

const updateAfter = 700;

const createURL = (state) => `?${qs.stringify(state)}`;

const pathToSearchState = (path) =>
  path.includes('?') ? qs.parse(path.substring(path.indexOf('?') + 1)) : {};

const searchStateToURL = (searchState) =>
  searchState ? `${window.location.pathname}?${qs.stringify(searchState)}` : '';

const DEFAULT_PROPS = {
  searchClient,
  indexName: 'imdb_movies',
};

export default function Page(props) {
  const [searchState, setSearchState] = React.useState(props.searchState);
  const router = useRouter();
  const debouncedSetState = React.useRef();

  React.useEffect(() => {
    if (router) {
      router.beforePopState(({ url }) => {
        setSearchState(pathToSearchState(url));
      });
    }
  }, [router]);

  return (
    <div>
      <App
        {...DEFAULT_PROPS}
        searchState={searchState}
        resultsState={props.resultsState}
        onSearchStateChange={(nextSearchState) => {
          clearTimeout(debouncedSetState.current);

          debouncedSetState.current = setTimeout(() => {
            const href = searchStateToURL(nextSearchState);

            router.push(href, href, { shallow: true });
          }, updateAfter);

          setSearchState(nextSearchState);
        }}
        createURL={createURL}
      />
    </div>
  );
}

export async function getServerSideProps({ resolvedUrl }) {
  const searchState = pathToSearchState(resolvedUrl);
  const resultsState = await findResultsState(App, {
    ...DEFAULT_PROPS,
    searchState,
  });

  return {
    props: {
      resultsState: JSON.parse(JSON.stringify(resultsState)),
      searchState,
    },
  };
}