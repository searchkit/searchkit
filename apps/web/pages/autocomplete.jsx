import {
  autocomplete,
  getAlgoliaResults,
  getAlgoliaFacets
} from "@algolia/autocomplete-js";
import React, { createElement, Fragment, useEffect, useRef } from 'react';
import { render } from 'react-dom';
import client from "@searchkit/instantsearch-client";

function Autocomplete(props) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) {
      return undefined;
    }

    const search = autocomplete({
      container: containerRef.current,
      renderer: { createElement, Fragment, render },
      ...props,
    });

    return () => {
      search.destroy();
    };
  }, [props.plugins]);

  return <div ref={containerRef} />;
}

const searchClient = client({
  url: "https://ises-cfw.searchkit.workers.dev"
});

function createCategoriesPlugin({
  searchClient
}) {
  return {
    getSources({ query }) {
      return [
        {
          sourceId: "categoriesPlugin",
          getItems() {
            return getAlgoliaFacets({
              searchClient,
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
            item({ item, components }) {
              return (
                <div className="aa-ItemWrapper">
                  <div className="aa-ItemContent">
                    <div className="aa-ItemContentBody">
                      <div className="aa-ItemContentTitle">{item.label}</div>
                    </div>
                  </div>
                </div>
              );
            }
          }
        }
      ];
    }
  };
}

export default function AutocompletePage() {
  return (
    <div className="bg-gray-100 h-screen p-4">
      <Autocomplete
        openOnFocus
        plugins={[createCategoriesPlugin({ searchClient })]}
        getSources={({ query, state }) => {
          if (!query) {
            return [];
          }
      
          return [
            {
              sourceId: "movies",
              getItems() {
                return getAlgoliaResults({
                  // @ts-ignore
                  searchClient,
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
        }}
      />
    </div>
  );
}

