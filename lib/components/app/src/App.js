var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SearchBox_1 = require("../../search/search-box/src/SearchBox");
var Hits_1 = require("../../search/hits/src/Hits");
var HitsStats_1 = require("../../search/hits-stats/src/HitsStats");
var RefinementListFilter_1 = require("../../search/filters/refinement-list-filter/src/RefinementListFilter");
var SearchkitComponent_1 = require("../../../domain/new/SearchkitComponent");
var SearcherProvider_1 = require("../../../domain/new/SearcherProvider");
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
        return (React.createElement(SearcherProvider_1.default, {"searcher": this.primarySearcher}, React.createElement("div", {"className": "layout"}, React.createElement("div", {"className": "layout__search-box"}, React.createElement(SearchBox_1.default, null)), React.createElement("div", {"className": "layout__filters"}, React.createElement(RefinementListFilter_1.default, {"title": "Actors", "field": "actors.raw", "operator": "AND"}), React.createElement(RefinementListFilter_1.default, {"title": "Languages", "field": "languages.raw", "operator": "OR"})), React.createElement("div", {"className": "layout__results-info"}, React.createElement(HitsStats_1.default, null)), React.createElement("div", {"className": "layout__results"}, React.createElement(Hits_1.default, {"hitsPerPage": 50, "render": "movies"})))));
    };
    return App;
})(SearchkitComponent_1.default);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = App;
//# sourceMappingURL=App.js.map