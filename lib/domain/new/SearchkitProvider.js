var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var SearchkitManager_1 = require("./SearchkitManager");
var SearchkitProvider = (function (_super) {
    __extends(SearchkitProvider, _super);
    function SearchkitProvider() {
        _super.apply(this, arguments);
    }
    SearchkitProvider.prototype.componentWillMount = function () {
        var _this = this;
        this.searcherUnsubscribe = this.props.searchkit.resultsListener.subscribe(function () { return _this.forceUpdate(); });
    };
    SearchkitProvider.prototype.componentDidMount = function () {
        this.props.searchkit.completeRegistration();
    };
    SearchkitProvider.prototype.componentWillUnmount = function () {
        this.searcherUnsubscribe.dispose();
    };
    SearchkitProvider.prototype.getChildContext = function () {
        return { searchkit: this.props.searchkit };
    };
    SearchkitProvider.prototype.render = function () {
        return this.props.children;
    };
    SearchkitProvider.childContextTypes = {
        searchkit: React.PropTypes.instanceOf(SearchkitManager_1.default)
    };
    return SearchkitProvider;
})(React.Component);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SearchkitProvider;
//# sourceMappingURL=SearchkitProvider.js.map