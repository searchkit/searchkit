var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var PropTypes = require("prop-types");
var SearchkitManager_1 = require("../SearchkitManager");
var SearchkitProvider = /** @class */ (function (_super) {
    __extends(SearchkitProvider, _super);
    function SearchkitProvider() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SearchkitProvider.prototype.componentDidMount = function () {
        this.props.searchkit.setupListeners();
        this.props.searchkit.completeRegistration();
    };
    SearchkitProvider.prototype.componentWillUnmount = function () {
        var searchkit = this.props.searchkit;
        searchkit.unlistenHistory();
        searchkit.guidGenerator.reset();
    };
    SearchkitProvider.prototype.getChildContext = function () {
        return { searchkit: this.props.searchkit };
    };
    SearchkitProvider.prototype.render = function () {
        return this.props.children;
    };
    SearchkitProvider.childContextTypes = {
        searchkit: PropTypes.instanceOf(SearchkitManager_1.SearchkitManager)
    };
    SearchkitProvider.propTypes = {
        searchkit: PropTypes.instanceOf(SearchkitManager_1.SearchkitManager).isRequired,
        children: PropTypes.element.isRequired
    };
    return SearchkitProvider;
}(React.Component));
exports.SearchkitProvider = SearchkitProvider;
//# sourceMappingURL=SearchkitProvider.js.map