var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var components_1 = require("../../components");
var core_1 = require("../../core");
require("./../styles/index.scss");
var App = (function (_super) {
    __extends(App, _super);
    function App() {
        _super.apply(this, arguments);
    }
    App.prototype.componentWillMount = function () {
        _super.prototype.componentWillMount.call(this);
        this.primarySearcher = this.searchkit.createSearcher();
        this.primarySearcher.search_type = "query_then_fetch";
    };
    App.prototype.render = function () {
        return (React.createElement(core_1.SearcherProvider, {"searcher": this.primarySearcher}, React.createElement("div", {"className": "layout"}, React.createElement("div", {"className": "layout__search-box"}, React.createElement(components_1.SearchBox, null)), React.createElement("div", {"className": "layout__filters"}, React.createElement(components_1.RefinementListFilter, {"title": "Actors", "field": "actors.raw", "operator": "AND"}), React.createElement(components_1.RefinementListFilter, {"title": "Languages", "field": "languages.raw", "operator": "OR"})), React.createElement("div", {"className": "layout__results-info"}, React.createElement(components_1.HitsStats, null)), React.createElement("div", {"className": "layout__results"}, React.createElement(components_1.Hits, {"hitsPerPage": 50})))));
    };
    return App;
})(core_1.SearchkitComponent);
exports.App = App;
//# sourceMappingURL=App.js.map