var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var classNames = require('classnames');
require("../styles/index.scss");
var core_1 = require("../../../../../core");
var ResetFilters = (function (_super) {
    __extends(ResetFilters, _super);
    function ResetFilters() {
        _super.apply(this, arguments);
    }
    ResetFilters.prototype.hasFilters = function () {
        return this.searcher.hasFiltersOrQuery();
    };
    ResetFilters.prototype.resetFilters = function () {
        this.searchkit.resetState();
        this.searchkit.performSearch();
    };
    ResetFilters.prototype.renderResetButton = function () {
        var className = classNames({
            "reset-filters": true,
            "reset-filters--disabled": !this.hasFilters()
        });
        return (React.createElement(core_1.FastClick, {"handler": this.resetFilters.bind(this)}, React.createElement("div", {"className": className}, React.createElement("div", {"className": "reset-filters__text"}, "clear all filters"))));
    };
    ResetFilters.prototype.render = function () {
        return (React.createElement("div", null, this.renderResetButton()));
    };
    return ResetFilters;
})(core_1.SearchkitComponent);
exports.ResetFilters = ResetFilters;
//# sourceMappingURL=ResetFilters.js.map