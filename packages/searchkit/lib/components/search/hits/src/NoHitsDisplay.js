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
var core_1 = require("../../../../core");
var NoHitsDisplay = /** @class */ (function (_super) {
    __extends(NoHitsDisplay, _super);
    function NoHitsDisplay() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NoHitsDisplay.prototype.getSuggestionAction = function () {
        var _a = this.props, suggestion = _a.suggestion, setSuggestionFn = _a.setSuggestionFn, bemBlocks = _a.bemBlocks, translate = _a.translate;
        if (suggestion) {
            return (React.createElement(core_1.FastClick, { handler: setSuggestionFn },
                React.createElement("div", { className: bemBlocks.container("step-action") }, translate("NoHits.DidYouMean", { suggestion: suggestion }))));
        }
        return null;
    };
    NoHitsDisplay.prototype.getResetFilterAction = function () {
        var _a = this.props, filtersCount = _a.filtersCount, query = _a.query, resetFiltersFn = _a.resetFiltersFn, bemBlocks = _a.bemBlocks, translate = _a.translate;
        if (filtersCount > 0) {
            return (React.createElement(core_1.FastClick, { handler: resetFiltersFn },
                React.createElement("div", { className: bemBlocks.container("step-action") }, translate("NoHits.SearchWithoutFilters", { query: query }))));
        }
        return null;
    };
    NoHitsDisplay.prototype.render = function () {
        var _a = this.props, bemBlocks = _a.bemBlocks, noResultsLabel = _a.noResultsLabel;
        return (React.createElement("div", { "data-qa": "no-hits", className: bemBlocks.container() },
            React.createElement("div", { className: bemBlocks.container("info") }, noResultsLabel),
            React.createElement("div", { className: bemBlocks.container("steps") }, this.getSuggestionAction() || this.getResetFilterAction())));
    };
    return NoHitsDisplay;
}(React.Component));
exports.NoHitsDisplay = NoHitsDisplay;
//# sourceMappingURL=NoHitsDisplay.js.map