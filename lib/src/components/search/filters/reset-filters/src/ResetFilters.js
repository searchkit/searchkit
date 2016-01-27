var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
require("../styles/index.scss");
var core_1 = require("../../../../../core");
var defaults = require("lodash/defaults");
var ResetFilters = (function (_super) {
    __extends(ResetFilters, _super);
    function ResetFilters() {
        _super.apply(this, arguments);
        this.translations = ResetFilters.translations;
    }
    ResetFilters.prototype.defineBEMBlocks = function () {
        return {
            container: (this.props.mod || "reset-filters")
        };
    };
    ResetFilters.prototype.hasFilters = function () {
        return this.getQuery().hasFiltersOrQuery();
    };
    ResetFilters.prototype.resetFilters = function () {
        this.searchkit.resetState();
        this.searchkit.performSearch();
    };
    ResetFilters.prototype.renderResetButton = function () {
        var block = this.bemBlocks.container;
        return (React.createElement("div", {"className": block("reset")}, this.translate("reset.clear_all")));
    };
    ResetFilters.prototype.render = function () {
        var block = this.bemBlocks.container;
        return (React.createElement("div", null, React.createElement(core_1.FastClick, {"handler": this.resetFilters.bind(this)}, React.createElement("div", {"className": block().state({ disabled: !this.hasFilters() })}, this.renderResetButton()))));
    };
    ResetFilters.translations = {
        "reset.clear_all": "Clear all filters"
    };
    ResetFilters.propTypes = defaults({
        translations: core_1.SearchkitComponent.translationsPropType(ResetFilters.translations)
    }, core_1.SearchkitComponent.propTypes);
    return ResetFilters;
})(core_1.SearchkitComponent);
exports.ResetFilters = ResetFilters;
//# sourceMappingURL=ResetFilters.js.map