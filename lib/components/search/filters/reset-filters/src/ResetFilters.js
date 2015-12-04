var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
require("./../styles/index.scss");
var core_1 = require("../../../../../core");
var ResetFilters = (function (_super) {
    __extends(ResetFilters, _super);
    function ResetFilters() {
        _super.apply(this, arguments);
    }
    ResetFilters.prototype.hasFilters = function () {
        return !!this.searcher.query.hasFilters();
    };
    ResetFilters.prototype.resetFilters = function () {
        //TODO
        // this.searcher.stateManager.state.clearAll()
        // this.searcher.stateManager.updateHistory()
    };
    ResetFilters.prototype.renderResetButton = function () {
        return (React.createElement("div", {"className": "reset-filters", "onClick": this.resetFilters.bind(this)}, React.createElement("div", {"className": "reset-filters__text"}, "clear all filters")));
    };
    ResetFilters.prototype.render = function () {
        var _this = this;
        return (React.createElement("div", null, (function () {
            if (_this.hasFilters()) {
                return _this.renderResetButton();
            }
        })()));
    };
    return ResetFilters;
})(core_1.SearchkitComponent);
exports.ResetFilters = ResetFilters;
//# sourceMappingURL=ResetFilters.js.map