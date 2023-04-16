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
  Snippet,
  CurrentRefinements,
  HierarchicalMenu,
  Configure,
  DynamicWidgets,
  QueryRuleCustomData,
} from "react-instantsearch-dom";
import Client from "@searchkit/instantsearch-client";

const searchClient = Client({
  url: "/api/search"
});

const HitView = (props: any) => {
  return (
    <div>
      <div className="hit__details">
        <h2>
          <Highlight attribute="name" hit={props.hit} />
        </h2>
        <Snippet attribute="description" hit={props.hit} />
      </div>
    </div>
  );
};

export default function Web() {
  return (
    <div className="">
      <InstantSearch indexName="products" searchClient={searchClient}>
        <Configure hitsPerPage={15} />
        <div className="container">
          <div className="search-panel">
            <div className="search-panel__filters">
              <DynamicWidgets facets={["*"]}>
                <Panel header="brand">
                  <RefinementList attribute="brand" searchable />
                </Panel>
                <Panel header="categories">
                  <HierarchicalMenu
                    attributes={[
                      "categories.lvl0",
                      "categories.lvl1",
                      "categories.lvl2",
                    ]}
                  />
                </Panel>
                <Panel header="price">
                <NumericMenu attribute="price" items={[
                  { label: 'All' },
                  { label: 'Less than $10', end: 10 },
                  { label: '$10 to $100', start: 10, end: 100 },
                  { label: '$100 to $500', start: 100, end: 500 },
                  { label: 'More than $500', start: 500 },
                ]} />
                </Panel>
              </DynamicWidgets>
            </div>
            <div className="search-panel__results">
              <div className="searchbox">
                <SearchBox />
              </div>
              <QueryRuleCustomData>
                {({ items }: { items: any[] }) =>
                  items.map(({ title, body, url }) => {
                    if (!title) {
                      return null;
                    }

                    return (
                      <section key={title}>
                        <h2>{title}</h2>
                        <p>{body}</p>
                        <a href={url}>Learn more</a>
                      </section>
                    );
                  })
                }
              </QueryRuleCustomData>
              <Stats />
              <CurrentRefinements />

              <Hits hitComponent={HitView} />
              <Pagination />
            </div>
        </div>
        </div>
      </InstantSearch>
    </div>
  );
}
