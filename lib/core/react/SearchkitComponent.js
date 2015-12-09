var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var SearchkitManager_1 = require("../SearchkitManager");
var Searcher_1 = require("../Searcher");
var SearchkitComponent = (function (_super) {
    __extends(SearchkitComponent, _super);
    function SearchkitComponent() {
        _super.apply(this, arguments);
    }
    SearchkitComponent.prototype.defineAccessor = function () {
        return null;
    };
    SearchkitComponent.prototype.shouldCreateNewSearcher = function () {
        return false;
    };
    SearchkitComponent.prototype.componentWillMount = function () {
        var _this = this;
        this.searchkit = this.context["searchkit"];
        this.accessor = this.defineAccessor();
        if (!this.shouldCreateNewSearcher()) {
            this.searcher = this.searcher || this.props["searcher"] || this.context["searcher"];
        }
        if (this.accessor) {
            // this.searcher.stateManager.registerAccessor(this.accessor)
            if (!this.searcher) {
                this.searcher = new Searcher_1.Searcher();
                this.searchkit.addSearcher(this.searcher);
            }
            this.searcher.addAccessor(this.accessor);
        }
        if (this.searcher) {
            this.stateListenerUnsubscribe = this.searcher.stateListener.subscribe(function () {
                _this.forceUpdate();
            });
        }
    };
    SearchkitComponent.prototype.isLoading = function () {
        return this.searcher && this.searcher.loading;
    };
    SearchkitComponent.prototype.componentWillUnmount = function () {
        if (this.stateListenerUnsubscribe) {
            this.stateListenerUnsubscribe.dispose();
        }
    };
    SearchkitComponent.contextTypes = {
        searchkit: React.PropTypes.instanceOf(SearchkitManager_1.SearchkitManager),
        searcher: React.PropTypes.instanceOf(Searcher_1.Searcher)
    };
    return SearchkitComponent;
})(React.Component);
exports.SearchkitComponent = SearchkitComponent;
//# sourceMappingURL=SearchkitComponent.js.map