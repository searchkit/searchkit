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
  CurrentRefinements
} from "react-instantsearch-dom";
import Client from "@searchkit/instantsearch-client";

const searchClient = Client({
  url: "/api/search"
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
