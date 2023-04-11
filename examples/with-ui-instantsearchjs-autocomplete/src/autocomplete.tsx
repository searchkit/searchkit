/** @jsxRuntime classic */
/** @jsx h */
import { autocomplete, getAlgoliaFacets } from '@algolia/autocomplete-js';
import { createLocalStorageRecentSearchesPlugin } from '@algolia/autocomplete-plugin-recent-searches';
import { InstantSearch } from 'instantsearch.js';

import {
  debouncedSetInstantSearchUiState,
  getInstantSearchUiState,
  getInstantSearchUrl,
  INSTANT_SEARCH_HIERARCHICAL_ATTRIBUTE,
  INSTANT_SEARCH_INDEX_NAME,
  setInstantSearchUiState,
} from './instantsearch';
import { isModifierEvent } from './isModifierEvent';
import { searchClient } from './searchClient';

function onSelect({ setIsOpen, setQuery, event, query, category }) {
  // You want to trigger the default browser behavior if the event is modified.
  if (isModifierEvent(event)) {
    return;
  }

  setQuery(query);
  setIsOpen(false);
  setInstantSearchUiState({
    query,
    hierarchicalMenu: {
      [INSTANT_SEARCH_HIERARCHICAL_ATTRIBUTE]: [category],
    },
  });
}

function getItemUrl({ query, category }) {
  return getInstantSearchUrl({
    query,
    hierarchicalMenu: {
      [INSTANT_SEARCH_HIERARCHICAL_ATTRIBUTE]: [category],
    },
  });
}

function getItemWrapper({ html, children, query, category }) {
  const uiState = {
    query,
    hierarchicalMenu: {
      [INSTANT_SEARCH_HIERARCHICAL_ATTRIBUTE]: [category],
    },
  };

  return html`<a
    class="aa-ItemLink"
    href=${getInstantSearchUrl(uiState)}
    onClick=${(event) => {
      if (!isModifierEvent(event)) {
        // Bypass the original link behavior if there's no event modifier
        // to set the InstantSearch UI state without reloading the page.
        event.preventDefault();
      }
    }}
  >
    ${children}
  </a>`;
}

const recentSearchesPlugin = createLocalStorageRecentSearchesPlugin({
  key: 'instantsearch',
  limit: 3,
  transformSource({ source }) {
    return {
      ...source,
      getItemUrl({ item }) {
        return getItemUrl({
          query: item.label,
          category: item.category,
        });
      },
      onSelect({ setIsOpen, setQuery, item, event }) {
        onSelect({
          setQuery,
          setIsOpen,
          event,
          query: item.label,
          category: item.category,
        });
      },
      templates: {
        ...source.templates,
        // Update the default `item` template to wrap it with a link
        // and plug it to the InstantSearch router.
        item(params) {
          const { children } = (source.templates.item(params) as any).props;
          const { item, html } = params;

          return getItemWrapper({
            query: item.label,
            category: item.category,
            html,
            children,
          });
        },
      },
    };
  },
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
          onSelect: () => {
            // here you add facet to the search
          },
          templates: {
            header({ html }) {
              return html`<div class="aa-SourceHeader">
                <div class="aa-SourceHeaderTitle">Categories</div>
              </div>`;
            },
            item({ item, components, html }) {
              return html`
                <div>
                  <div class="aa-ItemContent">
                    <div class="aa-ItemContentTitle">
                      <div class="aa-ItemContentTitle">${item.label}</div>
                    </div>
                  </div>
                </div>
              `;
            }
          }
        }
      ];
    }
  };
}

const searchPageState = getInstantSearchUiState();

export function startAutocomplete(searchInstance: InstantSearch) {
  let skipInstantSearchStateUpdate = false;

  const { setQuery } = autocomplete({
    container: '#autocomplete',
    placeholder: 'Search for products',
    openOnFocus: true,
    plugins: [
      recentSearchesPlugin,
      createCategoriesPlugin({ searchClient })
    ],
    detachedMediaQuery: 'none',
    initialState: {
      query: searchPageState.query || '',
    },
    navigator: {
      navigate() {
        // We don't navigate to a new page because we leverage the InstantSearch
        // UI state API.
      },
    },
    onSubmit({ state }) {
      setInstantSearchUiState({ query: state.query });
    },
    onReset() {
      setInstantSearchUiState({
        query: '',
        hierarchicalMenu: {
          [INSTANT_SEARCH_HIERARCHICAL_ATTRIBUTE]: [],
        },
      });
    },
    onStateChange({ prevState, state }) {
      if (!skipInstantSearchStateUpdate && prevState.query !== state.query) {
        debouncedSetInstantSearchUiState({ query: state.query });
      }
      skipInstantSearchStateUpdate = false;
    },
  });

  window.addEventListener('popstate', () => {
    skipInstantSearchStateUpdate = true;
    setQuery(
      (searchInstance.helper && searchInstance.helper.state.query) || ''
    );
  });
}
