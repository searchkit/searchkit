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
    NoHits.prototype.defineBEMBlocks = function () {
        var block = (this.props.mod || "no-hits");
        return {
            container: block
        };
    };
    NoHits.prototype.renderSuggestions = function () {
        var firstSuggestion = _.get(this.searchkit.getSuggestions(), [0, "options", 0, "text"], false);
        if (!firstSuggestion)
            return null;
        return (React.createElement(core_1.FastClick, {"handler": this.updateQueryString.bind(this, firstSuggestion)}, React.createElement("div", {"className": this.bemBlocks.container("suggestion")}, this.translate("NoHits.DidYouMean", { suggestion: firstSuggestion }))));
    };
    NoHits.prototype.updateQueryString = function (queryString) {
        this.searchkit.setQueryString(queryString);
        this.searchkit.performSearch();
    };
    NoHits.prototype.render = function () {
        if (this.hasHits() || this.isInitialLoading())
            return null;
        return (React.createElement("div", {"data-qa": "no-hits", "className": this.bemBlocks.container()}, React.createElement("div", {"className": this.bemBlocks.container("info")}, this.translate("NoHits.NoResultsFound"), this.renderSuggestions())));
    };
    NoHits.translations = {
        "NoHits.NoResultsFound": "No results found",
        "NoHits.DidYouMean": "Did you mean {suggestion}?"
    };
    NoHits.propTypes = _.defaults({
        translations: core_1.SearchkitComponent.translationsPropType(NoHits.translations)
    }, core_1.SearchkitComponent.propTypes);
    return NoHits;
})(core_1.SearchkitComponent);
exports.NoHits = NoHits;
//# sourceMappingURL=NoHits.js.map