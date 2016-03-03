"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _a = require("../../../../../src"), SearchkitManager = _a.SearchkitManager, SearchkitProvider = _a.SearchkitProvider, SearchBox = _a.SearchBox, Hits = _a.Hits, RefinementListFilter = _a.RefinementListFilter, Pagination = _a.Pagination, HierarchicalMenuFilter = _a.HierarchicalMenuFilter, HitsStats = _a.HitsStats, SortingSelector = _a.SortingSelector, NoHits = _a.NoHits, SelectedFilters = _a.SelectedFilters, ResetFilters = _a.ResetFilters, RangeFilter = _a.RangeFilter, NumericRefinementListFilter = _a.NumericRefinementListFilter;
var host = "http://demo.searchkit.co/api/movies";
var ReactDOM = require("react-dom");
var React = require("react");
var searchkit = new SearchkitManager(host);
var _ = require("lodash");
require("../../../../../theming/theme.scss");
require("./customisations.scss");
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
        return (React.createElement(SearchkitProvider, {searchkit: searchkit}, React.createElement("div", {className: "sk-layout"}, React.createElement("div", {className: "sk-layout__top-bar sk-top-bar"}, React.createElement("div", {className: "sk-top-bar__content"}, React.createElement("div", {className: "my-logo"}, "Searchkit Acme co"), React.createElement(SearchBox, {autofocus: true, searchOnChange: true, prefixQueryFields: ["actors^1", "type^2", "languages", "title^10"]}))), React.createElement("div", {className: "sk-layout__body"}, React.createElement("div", {className: "sk-layout__filters"}, React.createElement(HierarchicalMenuFilter, {fields: ["type.raw", "genres.raw"], title: "Categories", id: "categories"}), React.createElement(RangeFilter, {min: 0, max: 100, field: "metaScore", id: "metascore", title: "Metascore", showHistogram: true}), React.createElement(RangeFilter, {min: 0, max: 10, field: "imdbRating", id: "imdbRating", title: "IMDB Rating", showHistogram: true}), React.createElement(RefinementListFilter, {id: "actors", title: "Actors", field: "actors.raw", size: 10}), React.createElement(RefinementListFilter, {translations: { "facets.view_more": "View more writers" }, id: "writers", title: "Writers", field: "writers.raw", operator: "OR", size: 10}), React.createElement(RefinementListFilter, {id: "countries", title: "Countries", field: "countries.raw", operator: "OR", size: 10}), React.createElement(NumericRefinementListFilter, {id: "runtimeMinutes", title: "Length", field: "runtimeMinutes", options: [
            { title: "All" },
            { title: "up to 20", from: 0, to: 20 },
            { title: "21 to 60", from: 21, to: 60 },
            { title: "60 or more", from: 61, to: 1000 }
        ]})), React.createElement("div", {className: "sk-layout__results sk-results-list"}, React.createElement("div", {className: "sk-results-list__action-bar sk-action-bar"}, React.createElement("div", {className: "sk-action-bar__info"}, React.createElement(HitsStats, {translations: {
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
