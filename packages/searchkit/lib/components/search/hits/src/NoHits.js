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
var PropTypes = require("prop-types");
var core_1 = require("../../../../core");
var NoHitsErrorDisplay_1 = require("./NoHitsErrorDisplay");
var NoHitsDisplay_1 = require("./NoHitsDisplay");
var defaults = require("lodash/defaults");
var NoHits = /** @class */ (function (_super) {
    __extends(NoHits, _super);
    function NoHits() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.translations = NoHits.translations;
        return _this;
    }
    NoHits.prototype.componentDidMount = function () {
        _super.prototype.componentDidMount.call(this);
        this.noFiltersAccessor = this.searchkit.addAccessor(new core_1.NoFiltersHitCountAccessor());
        if (this.props.suggestionsField) {
            this.suggestionsAccessor = this.searchkit.addAccessor(new core_1.SuggestionsAccessor(this.props.suggestionsField));
        }
    };
    NoHits.prototype.defineBEMBlocks = function () {
        var block = (this.props.mod || "sk-no-hits");
        return {
            container: block
        };
    };
    NoHits.prototype.getSuggestion = function () {
        return this.suggestionsAccessor && this.suggestionsAccessor.getSuggestion();
    };
    NoHits.prototype.setQueryString = function (query) {
        this.searchkit.getQueryAccessor().setQueryString(query, true);
        this.searchkit.performSearch(true);
    };
    NoHits.prototype.resetFilters = function () {
        this.searchkit.getQueryAccessor().keepOnlyQueryState();
        this.searchkit.performSearch(true);
    };
    NoHits.prototype.resetSearch = function () {
        this.searchkit.getQueryAccessor().resetState();
        this.searchkit.performSearch(true);
    };
    NoHits.prototype.getFilterCount = function () {
        return this.noFiltersAccessor && this.noFiltersAccessor.getCount();
    };
    NoHits.prototype.render = function () {
        if ((this.hasHits() || this.isInitialLoading() || this.isLoading()) && !this.getError())
            return null;
        if (this.getError()) {
            var props_1 = {
                errorLabel: this.translate("NoHits.Error"),
                resetSearchFn: this.resetSearch.bind(this),
                translate: this.translate,
                bemBlocks: this.bemBlocks,
                tryAgainLabel: this.translate("NoHits.ResetSearch"),
                error: this.getError()
            };
            return core_1.renderComponent(this.props.errorComponent, props_1);
        }
        var suggestion = this.getSuggestion();
        var query = this.getQuery().getQueryString();
        var infoKey = suggestion ? "NoHits.NoResultsFoundDidYouMean" : "NoHits.NoResultsFound";
        var props = {
            noResultsLabel: this.translate(infoKey, { query: query, suggestion: suggestion }),
            translate: this.translate,
            bemBlocks: this.bemBlocks,
            suggestion: suggestion,
            query: query,
            filtersCount: this.getFilterCount(),
            resetFiltersFn: this.resetFilters.bind(this),
            setSuggestionFn: this.setQueryString.bind(this, suggestion)
        };
        return core_1.renderComponent(this.props.component, props);
    };
    NoHits.translations = {
        "NoHits.NoResultsFound": "No results found for {query}.",
        "NoHits.NoResultsFoundDidYouMean": "No results found for {query}. Did you mean {suggestion}?",
        "NoHits.DidYouMean": "Search for {suggestion} instead",
        "NoHits.SearchWithoutFilters": "Search for {query} without filters",
        "NoHits.Error": "We're sorry, an issue occurred when fetching your results. Please try again.",
        "NoHits.ResetSearch": "Reset Search"
    };
    NoHits.propTypes = defaults({
        suggestionsField: PropTypes.string,
        translations: core_1.SearchkitComponent.translationsPropType(NoHits.translations)
    }, core_1.SearchkitComponent.propTypes);
    NoHits.defaultProps = {
        errorComponent: NoHitsErrorDisplay_1.NoHitsErrorDisplay,
        component: NoHitsDisplay_1.NoHitsDisplay
    };
    return NoHits;
}(core_1.SearchkitComponent));
exports.NoHits = NoHits;
//# sourceMappingURL=NoHits.js.map