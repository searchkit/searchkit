var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var SearchkitManager_1 = require("../SearchkitManager");
var SearchkitProvider = (function (_super) {
    __extends(SearchkitProvider, _super);
    function SearchkitProvider() {
        _super.apply(this, arguments);
    }
    SearchkitProvider.prototype.componentDidMount = function () {
        this.props.searchkit.completeRegistration();
    };
    SearchkitProvider.prototype.getChildContext = function () {
        return { searchkit: this.props.searchkit };
    };
    SearchkitProvider.prototype.render = function () {
        return this.props.children;
    };
    SearchkitProvider.childContextTypes = {
        searchkit: React.PropTypes.instanceOf(SearchkitManager_1.SearchkitManager)
    };
    SearchkitProvider.propTypes = {
        searchkit: React.PropTypes.instanceOf(SearchkitManager_1.SearchkitManager).isRequired,
        children: React.PropTypes.element.isRequired
    };
    return SearchkitProvider;
})(React.Component);
exports.SearchkitProvider = SearchkitProvider;
//# sourceMappingURL=SearchkitProvider.js.map