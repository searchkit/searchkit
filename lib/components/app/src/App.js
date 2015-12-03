var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var index_ts_1 = require("../../index.ts");
require("./../styles/index.scss");
var App = (function (_super) {
    __extends(App, _super);
    function App() {
        _super.apply(this, arguments);
    }
    App.prototype.render = function () {
        return (React.createElement("div", {"className": "layout"}, React.createElement("div", {"className": "layout__search-box"}, React.createElement(index_ts_1.SelectedFilters, null), React.createElement(index_ts_1.SearchBox, null)), React.createElement("div", {"className": "layout__filters"}, React.createElement(index_ts_1.ResetFilters, null), React.createElement(index_ts_1.HierarchicalMenuFilter, {"fields": ["type.raw", "genres.raw"], "title": "Categories"}), React.createElement("div", {"className": "layout__filters__heading"}, "Refine Results By"), React.createElement(index_ts_1.RefinementListFilter, {"title": "Actors", "field": "actors.raw", "operator": "AND"}), React.createElement(index_ts_1.RefinementListFilter, {"title": "Languages", "field": "languages.raw", "operator": "OR"}), React.createElement(index_ts_1.RefinementListFilter, {"title": "Countries", "field": "countries.raw", "operator": "OR"})), React.createElement("div", {"className": "layout__results-info"}, React.createElement(index_ts_1.HitsStats, null)), React.createElement("div", {"className": "layout__results"}, React.createElement(index_ts_1.Hits, {"hitsPerPage": 50, "render": "movies"}), React.createElement(index_ts_1.Pagination, null))));
    };
    return App;
})(React.Component);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = App;
//# sourceMappingURL=App.js.map