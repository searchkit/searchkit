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
var NoHitsErrorDisplay = /** @class */ (function (_super) {
    __extends(NoHitsErrorDisplay, _super);
    function NoHitsErrorDisplay() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NoHitsErrorDisplay.prototype.render = function () {
        var _a = this.props, errorLabel = _a.errorLabel, bemBlocks = _a.bemBlocks, resetSearchFn = _a.resetSearchFn, tryAgainLabel = _a.tryAgainLabel;
        return (React.createElement("div", { "data-qa": "no-hits", className: bemBlocks.container() },
            React.createElement("div", { className: bemBlocks.container("info") }, errorLabel),
            React.createElement("div", { className: bemBlocks.container("steps") },
                React.createElement(core_1.FastClick, { handler: resetSearchFn },
                    React.createElement("div", { className: bemBlocks.container("step-action") }, tryAgainLabel)))));
    };
    return NoHitsErrorDisplay;
}(React.Component));
exports.NoHitsErrorDisplay = NoHitsErrorDisplay;
//# sourceMappingURL=NoHitsErrorDisplay.js.map