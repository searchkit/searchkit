import {
  autocomplete,
  getAlgoliaResults,
  getAlgoliaFacets
} from "@algolia/autocomplete-js";
import React, { createElement, Fragment, useEffect, useRef, useState } from 'react';
import { render } from 'react-dom';
import client from "@searchkit/instantsearch-client";
import { InstantSearch, usePagination, useSearchBox } from 'react-instantsearch-hooks';
import { Hits } from 'react-instantsearch-hooks-web';


function Autocomplete(props) {
  const containerRef = useRef(null);

  const { query, refine: setQuery } = useSearchBox();
  const [
    instantSearchUiState,
    setInstantSearchUiState,
  ] = useState({ query });
  const { refine: setPage } = usePagination();

  useEffect(() => {
    setQuery(instantSearchUiState.query);
    setPage(0);
  }, [instantSearchUiState]);

  useEffect(() => {
    if (!containerRef.current) {
      return undefined;
    }

    const plugins = [createCategoriesPlugin({ autocompleteClient, setInstantSearchUiState })]

    const search = autocomplete({
      container: containerRef.current,
      onSubmit({ state }) {
        setInstantSearchUiState({ query: state.query });
      },
      renderer: { createElement, Fragment, render },
      plugins,
      getSources: () => [],
      ...props,
    });

    return () => {
      search.destroy();
    };
  }, []);

  return <div ref={containerRef} />;
}

const autocompleteClient = client({
  url: "https://ises-cfw.searchkit.workers.dev"
});

const searchClient = client({
  url: "https://ises-cfw.searchkit.workers.dev"
});

function createCategoriesPlugin({
  autocompleteClient,
  setInstantSearchUiState
}) {
  return {
    getSources({ query, setQuery, refresh, setIsOpen }) {
      return [
        {
          sourceId: "categoriesPlugin",
          getItems() {
            return getAlgoliaFacets({
              searchClient: autocompleteClient,
              queries: [
                {
                  indexName: "imdb_movies",
                  facet: "actors",
                  params: {
                    facetName: "actors",
                    facetQuery: query,
                    maxFacetHits: query ? 3 : 5
                  }
                }
              ]
            });
          },
          templates: {
            header() {
              return (
                <Fragment>
                  <span className="aa-SourceHeaderTitle">Actors</span>
                  <div className="aa-SourceHeaderLine" />
                </Fragment>
              );
            },
            item({ item }) {
              return (
                <div className="aa-ItemWrapper">
                  <div className="aa-ItemContent">
                    <div className="aa-ItemContentBody">
                      <div className="aa-ItemContentTitle" onClick={(event) => {
                          event.stopPropagation();
                          setQuery(item.label);
                          setInstantSearchUiState({ query: item.label })
                          setIsOpen(false);
                        }}>{item.label}</div>
                    </div>
                  </div>
                </div>
              );
            }
          }
        },
        {
          sourceId: "movies",
          getItems() {
            return getAlgoliaResults({
              // @ts-ignore
              searchClient: autocompleteClient,
              queries: [
                {
                  indexName: "imdb_movies",
                  query,
                  params: {
                    query
                  }
                }
              ],
              transformResponse({ hits }) {
                const [imdbMoviesHits] = hits;
  
                return imdbMoviesHits;
              }
            });
          },
          getItemUrl({ item }) {
            return `https://www.imdb.com/title/${item.objectID}`;
          },
          templates: {
            header() {
              return (
                <Fragment>
                  <span className="aa-SourceHeaderTitle">Movies</span>
                  <div className="aa-SourceHeaderLine" />
                </Fragment>
              );
            },
            item({ item, components }) {
              return <div>{item.title}</div>;
            },
            noResults() {
              return "No products for this query.";
            }
          }
        }
      ];
    },
    transformSource({ source }) {
      return {
        ...source,
        onSelect({ item }) {
          debugger
          setInstantSearchUiState({
            query: item.label,
          });
        },
      };
    },
  };
}

export default function AutocompletePage() {
  return (
    <div className="bg-gray-100 h-screen p-4">
      <InstantSearch
        searchClient={searchClient}
        indexName="imdb_movies"
        routing
      >
        <Autocomplete
          openOnFocus
        />
        <Hits />
      </InstantSearch>
    </div>
  );
}

