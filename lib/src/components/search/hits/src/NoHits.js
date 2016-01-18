var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _ = require("lodash");
var React = require("react");
require("../styles/no-hits.scss");
var core_1 = require("../../../../core");
var NoHits = (function (_super) {
    __extends(NoHits, _super);
    function NoHits() {
        _super.apply(this, arguments);
        this.translations = NoHits.translations;
    }
    NoHits.prototype.componentWillMount = function () {
        _super.prototype.componentWillMount.call(this);
        this.noFiltersAccessor = this.searchkit.addAccessor(new core_1.NoFiltersHitCountAccessor());
        if (this.props.suggestionsField) {
            this.suggestionsAccessor = this.searchkit.addAccessor(new core_1.SuggestionsAccessor(this.props.suggestionsField));
        }
    };
    NoHits.prototype.defineBEMBlocks = function () {
        var block = (this.props.mod || "no-hits");
        return {
            container: block
        };
    };
    NoHits.prototype.getSuggestion = function () {
        return this.suggestionsAccessor && this.suggestionsAccessor.getSuggestion();
    };
    NoHits.prototype.renderSuggestions = function () {
        var suggestion = this.getSuggestion();
        if (suggestion) {
            return (React.createElement(core_1.FastClick, {"handler": this.setQueryString.bind(this, suggestion)}, React.createElement("div", {"className": this.bemBlocks.container("step-action")}, this.translate("NoHits.DidYouMean", { suggestion: suggestion }))));
        }
        return null;
    };
    NoHits.prototype.setQueryString = function (query) {
        this.searchkit.getQueryAccessor().setQueryString(query, true);
        this.searchkit.performSearch(true);
    };
    NoHits.prototype.resetFilters = function () {
        this.searchkit.getQueryAccessor().keepOnlyQueryState();
        this.searchkit.performSearch(true);
    };
    NoHits.prototype.renderResetFilters = function () {
        if (this.noFiltersAccessor) {
            if (this.noFiltersAccessor.getCount() > 0) {
                var query = this.getQuery().getQueryString();
                return (React.createElement(core_1.FastClick, {"handler": this.resetFilters.bind(this)}, React.createElement("div", {"className": this.bemBlocks.container("step-action")}, this.translate("NoHits.SearchWithoutFilters", { query: query }))));
            }
        }
        return null;
    };
    NoHits.prototype.render = function () {
        if (this.hasHits() || this.isInitialLoading() || this.isLoading())
            return null;
        var query = this.getQuery().getQueryString();
        var suggestion = this.getSuggestion();
        var infoKey = suggestion ? "NoHits.NoResultsFoundDidYouMean" : "NoHits.NoResultsFound";
        var action = this.renderSuggestions() || this.renderResetFilters() || null;
        return (React.createElement("div", {"data-qa": "no-hits", "className": this.bemBlocks.container()}, React.createElement("div", {"className": this.bemBlocks.container("info")}, this.translate(infoKey, { query: query, suggestion: suggestion })), React.createElement("div", {"className": this.bemBlocks.container("steps")}, action)));
    };
    NoHits.translations = {
        "NoHits.NoResultsFound": "No results found for {query}.",
        "NoHits.NoResultsFoundDidYouMean": "No results found for {query}. Did you mean {suggestion}?",
        "NoHits.DidYouMean": "Search for {suggestion} instead",
        "NoHits.SearchWithoutFilters": "Search for {query} without filters"
    };
    NoHits.propTypes = _.defaults({
        suggestionsField: React.PropTypes.string,
        translations: core_1.SearchkitComponent.translationsPropType(NoHits.translations)
    }, core_1.SearchkitComponent.propTypes);
    return NoHits;
})(core_1.SearchkitComponent);
exports.NoHits = NoHits;
//# sourceMappingURL=NoHits.js.map