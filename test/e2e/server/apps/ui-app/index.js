"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _a = require("../../../../../src"), SearchkitManager = _a.SearchkitManager, SearchkitProvider = _a.SearchkitProvider, SearchBox = _a.SearchBox, Hits = _a.Hits, RefinementListFilter = _a.RefinementListFilter, Pagination = _a.Pagination, HierarchicalMenuFilter = _a.HierarchicalMenuFilter, HitsStats = _a.HitsStats, SortingSelector = _a.SortingSelector, NoHits = _a.NoHits, SelectedFilters = _a.SelectedFilters, ResetFilters = _a.ResetFilters, RangeFilter = _a.RangeFilter, NumericRefinementListFilter = _a.NumericRefinementListFilter, Panel = _a.Panel, TagCloud = _a.TagCloud, Toggle = _a.Toggle, Select = _a.Select, Tabs = _a.Tabs, ItemList = _a.ItemList, CheckboxItemList = _a.CheckboxItemList, CheckboxFilter = _a.CheckboxFilter, RefinementListFilter2 = _a.RefinementListFilter2, MenuFilter2 = _a.MenuFilter2;
var host = "http://demo.searchkit.co/api/movies";
var ReactDOM = require("react-dom");
var React = require("react");
var searchkit = new SearchkitManager(host);
var MockList_1 = require("./MockList");
var _ = require("lodash");
require("../../../../../theming/theme.scss");
var MovieHitsGridItem = function (props) {
    var bemBlocks = props.bemBlocks, result = props.result;
    var url = "http://www.imdb.com/title/" + result._source.imdbId;
    var source = _.extend({}, result._source, result.highlight);
    return (React.createElement("div", {className: bemBlocks.item().mix(bemBlocks.container("item")), "data-qa": "hit"}, React.createElement("a", {href: url, target: "_blank"}, React.createElement("img", {"data-qa": "poster", className: bemBlocks.item("poster"), src: result._source.poster, width: "170", height: "240"}), React.createElement("div", {"data-qa": "title", className: bemBlocks.item("title"), dangerouslySetInnerHTML: { __html: source.title }}))));
};
var App = (function (_super) {
    __extends(App, _super);
    function App() {
        _super.apply(this, arguments);
    }
    App.prototype.render = function () {
        return (React.createElement(SearchkitProvider, {searchkit: searchkit}, React.createElement("div", {className: "sk-layout"}, React.createElement("div", {className: "sk-layout__body"}, React.createElement("div", {className: "sk-layout__filters"}, React.createElement(Panel, {title: 'My Panel', collapsable: true}, React.createElement("p", null, "panel contents")), React.createElement(MockList_1.MockList, {title: "Tag Cloud", listComponent: TagCloud}), React.createElement(MockList_1.MockList, {title: "Toggle", listComponent: Toggle}), React.createElement(MockList_1.MockList, {title: "Select", listComponent: Select}), React.createElement(MockList_1.MockList, {title: "Tabs", listComponent: Tabs}), React.createElement(MockList_1.MockList, {title: "Item List", listComponent: ItemList}), React.createElement(MockList_1.MockList, {title: "Checkbox List", listComponent: CheckboxItemList}), React.createElement(CheckboxFilter, {id: "rating", title: "Rating", field: "rated.raw", value: "R", label: "Rated 'R'"}), React.createElement(RefinementListFilter2, {translations: { "facets.view_more": "View more writers" }, id: "writers", title: "Writers", field: "writers.raw", size: 10, listComponent: CheckboxItemList}), React.createElement(MenuFilter2, {field: "type.raw", title: "Movie Type", id: "move_type", showCount: true, listComponent: Tabs})), React.createElement("div", {className: "sk-layout__results sk-results-list"}, React.createElement("div", {className: "sk-results-list__action-bar sk-action-bar"}, React.createElement("div", {className: "sk-action-bar__info"}, React.createElement(HitsStats, {translations: {
            "hitstats.results_found": "{hitCount} results found"
        }}), React.createElement(SortingSelector, {options: [
            { label: "Relevance", field: "_score", order: "desc" },
            { label: "Latest Releases", field: "released", order: "desc" },
            { label: "Earliest Releases", field: "released", order: "asc" }
        ]})), React.createElement("div", {className: "sk-action-bar__filters"}, React.createElement(SelectedFilters, null), React.createElement(ResetFilters, null))), React.createElement(Hits, {hitsPerPage: 10, highlightFields: ["title"], itemComponent: MovieHitsGridItem, mod: "sk-hits-grid"}), React.createElement(NoHits, {suggestionsField: "title"}), React.createElement(Pagination, {showNumbers: true}))))));
    };
    return App;
}(React.Component));
ReactDOM.render(React.createElement(App, null), document.getElementById("root"));
