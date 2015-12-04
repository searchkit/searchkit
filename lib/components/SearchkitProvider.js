var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var react_1 = require("react");
var ESClient_1 = require("../domain/ESClient");
var SearchkitProvider = (function (_super) {
    __extends(SearchkitProvider, _super);
    function SearchkitProvider(props) {
        _super.call(this, props);
        this.searcher = props.searcher;
    }
    SearchkitProvider.prototype.componentWillMount = function () {
        var _this = this;
        this.searcherUnsubscribe = this.searcher.resultsListener.subscribe(function () { return _this.forceUpdate(); });
    };
    SearchkitProvider.prototype.componentDidMount = function () {
        this.searcher.completeRegistration();
    };
    SearchkitProvider.prototype.componentWillUnmount = function () {
        this.searcherUnsubscribe.dispose();
    };
    SearchkitProvider.prototype.getChildContext = function () {
        return { searcher: this.props.searcher };
    };
    SearchkitProvider.prototype.render = function () {
        return this.props.children;
    };
    SearchkitProvider.childContextTypes = {
        searcher: React.PropTypes.instanceOf(ESClient_1.default)
    };
    return SearchkitProvider;
})(react_1.Component);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SearchkitProvider;
//# sourceMappingURL=SearchkitProvider.js.map