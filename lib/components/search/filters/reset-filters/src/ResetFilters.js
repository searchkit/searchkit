var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var SearchkitComponent_ts_1 = require("../../../../SearchkitComponent.ts");
require("./../styles/index.scss");
var ResetFilters = (function (_super) {
    __extends(ResetFilters, _super);
    function ResetFilters() {
        _super.apply(this, arguments);
    }
    ResetFilters.prototype.hasFilters = function () {
        return !!this.searcher.stateManager.getData();
    };
    ResetFilters.prototype.resetFilters = function () {
        this.searcher.stateManager.state.clearAll();
        this.searcher.stateManager.updateHistory();
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
})(SearchkitComponent_ts_1.default);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ResetFilters;
//# sourceMappingURL=ResetFilters.js.map