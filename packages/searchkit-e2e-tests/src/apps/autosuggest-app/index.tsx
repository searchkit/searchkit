import * as ReactDOM from "react-dom";
import * as React from "react";

import { SearchkitAutosuggest, FacetFilterDatasource } from "@searchkit/autosuggest"

import {
  SearchkitManager, SearchkitProvider,
    SearchBox, Hits, RefinementListFilter, Pagination,
    HierarchicalMenuFilter, HitsStats, SortingSelector, NoHits,
    SelectedFilters, ResetFilters, RangeFilter, NumericRefinementListFilter,
    ViewSwitcherHits, ViewSwitcherToggle,
    Layout, TopBar, LayoutBody, LayoutResults,
    ActionBar, ActionBarRow, SideBar
} from "searchkit"

import { MovieHitsGridItem, MovieHitsListItem } from "../../components"

// require("@searchkit/autosuggest/src/styles.css")
require("searchkit/release/theme.css")


const searchkit = new SearchkitManager("http://demo.searchkit.co/api/movies/")


const App = () => (
    <SearchkitProvider searchkit={searchkit}>
        <Layout>
            <TopBar>
                {/* <SearchBox
                    autofocus={true}
                    searchOnChange={true}
                    prefixQueryFields={["actors^1", "type^2", "languages", "title^10"]} /> */}
                <SearchkitAutosuggest sources={[
                    new FacetFilterDatasource({ accessorId:"actors", size:5})
                ]}/>
            </TopBar>
            <LayoutBody>
                <SideBar>
                    <HierarchicalMenuFilter
                        fields={["type.raw", "genres.raw"]}
                        title="Categories"
                        id="categories" />
                    <RefinementListFilter
                        id="actors"
                        title="Actors"
                        field="actors.raw"
                        operator="AND"
                        size={10} />
                </SideBar>
                <LayoutResults>
                    <ActionBar>

                        <ActionBarRow>
                            <HitsStats />
                        </ActionBarRow>

                        <ActionBarRow>
                            <SelectedFilters />
                            <ResetFilters />
                        </ActionBarRow>

                    </ActionBar>
                    <Hits mod="sk-hits-grid" hitsPerPage={10} itemComponent={MovieHitsGridItem}
                        sourceFilter={["title", "poster", "imdbId"]} />
                    <NoHits />
                </LayoutResults>
            </LayoutBody>
        </Layout>
    </SearchkitProvider>
)

ReactDOM.render(<App />, document.getElementById('root'))
