var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var Searcher_1 = require("./Searcher");
var SearcherProvider = (function (_super) {
    __extends(SearcherProvider, _super);
    function SearcherProvider() {
        _super.apply(this, arguments);
    }
    SearcherProvider.prototype.getChildContext = function () {
        return { searcher: this.props.searcher };
    };
    SearcherProvider.prototype.render = function () {
        return this.props.children;
    };
    SearcherProvider.childContextTypes = {
        searcher: React.PropTypes.instanceOf(Searcher_1.default)
    };
    return SearcherProvider;
})(React.Component);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SearcherProvider;
//# sourceMappingURL=SearcherProvider.js.map