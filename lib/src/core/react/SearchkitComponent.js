var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var SearchkitManager_1 = require("../SearchkitManager");
var block = require('bem-cn');
var SearchkitComponent = (function (_super) {
    __extends(SearchkitComponent, _super);
    function SearchkitComponent() {
        _super.apply(this, arguments);
        this.translations = {};
    }
    SearchkitComponent.prototype.defineBEMBlocks = function () {
        return null;
    };
    SearchkitComponent.prototype.defineAccessor = function () {
        return null;
    };
    SearchkitComponent.prototype.translate = function (key) {
        return ((this.searchkit.translate(key)) ||
            (this.props.translations && this.props.translations[key]) ||
            this.translations[key] ||
            key);
    };
    SearchkitComponent.prototype.componentWillMount = function () {
        var _this = this;
        this.bemBlocks = _.transform(this.defineBEMBlocks(), function (result, cssClass, name) {
            result[name] = block(cssClass);
        });
        this.searchkit = this.context["searchkit"];
        if (this.searchkit) {
            this.accessor = this.defineAccessor();
            if (this.accessor) {
                this.accessor = this.searchkit.addAccessor(this.accessor);
            }
            this.stateListenerUnsubscribe = this.searchkit.emitter.addListener(function () {
                _this.forceUpdate();
            });
        }
    };
    SearchkitComponent.prototype.getResults = function () {
        return this.searchkit.results;
    };
    SearchkitComponent.prototype.getHits = function () {
        return this.searchkit.getHits();
    };
    SearchkitComponent.prototype.getHitsCount = function () {
        return this.searchkit.getHitsCount();
    };
    SearchkitComponent.prototype.hasHits = function () {
        return this.searchkit.hasHits();
    };
    SearchkitComponent.prototype.getQuery = function () {
        return this.searchkit.query;
    };
    SearchkitComponent.prototype.isInitialLoading = function () {
        return this.searchkit.initialLoading;
    };
    SearchkitComponent.prototype.isLoading = function () {
        return this.searchkit.loading;
    };
    SearchkitComponent.prototype.getError = function () {
        return this.searchkit.error;
    };
    SearchkitComponent.prototype.componentWillUnmount = function () {
        if (this.stateListenerUnsubscribe) {
            this.stateListenerUnsubscribe();
        }
    };
    SearchkitComponent.contextTypes = {
        searchkit: React.PropTypes.instanceOf(SearchkitManager_1.SearchkitManager)
    };
    return SearchkitComponent;
})(React.Component);
exports.SearchkitComponent = SearchkitComponent;
//# sourceMappingURL=SearchkitComponent.js.map