import {
  InstantSearch,
  SearchBox,
  Hits,
  Highlight,
  RefinementList,
  Panel,
  Pagination,
  Stats,
  NumericMenu,
  RangeInput,
  CurrentRefinements,
  createConnector,
} from "react-instantsearch-dom";
import Client from "@searchkit/instantsearch-client";
import { useState } from "react";

const searchClient = Client({
  url: "/api/search"
});

const writersInputConnector = createConnector({
  displayName: "writers",
  getProvidedProps: (props, searchState) => {
    return {
      writers: searchState.writers || "",
    };
  },
  refine: (props, searchState, nextValue) => {
    return {
      ...searchState,
      writers: nextValue,
    };
  },
  getSearchParameters(searchParameters, props, searchState) {
    const { writers = "" } = searchState;

    if (!writers) return searchParameters;

    return searchParameters
      .addFacet("writers")
      .addFacetRefinement("writers", writers);
  },
});

const WritersSearchInput = writersInputConnector(({ refine }) => {
  const [query, setQuery] = useState("");
  return (
    <form onSubmit={(e) => {
      e.preventDefault(); refine(query)
    }}>
      <input
        type="text"
        className="ais-SearchBox-input"
        placeholder="search writers"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
        }}
      />
    </form>
  );
});

const hitView = (props: any) => {
  return (
    <div>
      <img
        src={props.hit.poster}
        style={{ margin: "auto", maxHeight: "70rem" }}
      />
      <h2>
        <Highlight hit={props.hit} attribute="title" />
      </h2>
      <br />

      <Highlight hit={props.hit} attribute="actors" />
    </div>
  );
};

export default function Web() {
  return (
    <div className="ais-InstantSearch">
      <InstantSearch indexName="imdb_movies" searchClient={searchClient}>
        <SearchBox />
        <div className="left-panel">
          <Panel header="Type">
            <RefinementList attribute="type" searchable={true} />
          </Panel>
          <Panel header="actors">
            <RefinementList attribute="actors" searchable={true} limit={10} />
          </Panel>
          <Panel header="imdbrating">
            <NumericMenu
              attribute="imdbrating"
              items={[
                { label: "5 - 7", start: 5, end: 7 },
                { label: "7 - 9", start: 7, end: 9 },
                { label: ">= 9", start: 9 }
              ]}
            />
          </Panel>
          <Panel header="metascore">
            <RangeInput attribute="metascore" header="Range Input" />
          </Panel>
          <Panel header="writers">
            <WritersSearchInput />
          </Panel>
        </div>
        <div className="right-panel">
          <Stats />
          <CurrentRefinements />

          <Hits hitComponent={hitView} />
          <Pagination />
        </div>
      </InstantSearch>
    </div>
  );
}
