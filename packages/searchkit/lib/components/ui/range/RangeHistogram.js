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
var react_1 = require("../../../core/react");
var maxBy = require("lodash/maxBy");
var map = require("lodash/map");
function computeMaxValue(items, field) {
    if (!items || items.length == 0)
        return 0;
    return maxBy(items, field)[field];
}
var RangeHistogram = /** @class */ (function (_super) {
    __extends(RangeHistogram, _super);
    function RangeHistogram() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RangeHistogram.prototype.render = function () {
        var _a = this.props, mod = _a.mod, className = _a.className, minValue = _a.minValue, maxValue = _a.maxValue, _b = _a.items, items = _b === void 0 ? [] : _b;
        var bemBlocks = {
            container: react_1.block(mod).el
        };
        var maxCount = computeMaxValue(items, "doc_count");
        if (maxCount == 0)
            return null;
        var bars = map(items, function (_a) {
            var key = _a.key, doc_count = _a.doc_count;
            var outOfBounds = (key < minValue || key > maxValue);
            return (React.createElement("div", { className: bemBlocks.container('bar').state({ 'out-of-bounds': outOfBounds }), key: key, style: {
                    height: (doc_count / maxCount) * 100 + "%"
                } }));
        });
        return (React.createElement("div", { className: bemBlocks.container().mix(className) }, bars));
    };
    RangeHistogram.defaultProps = {
        mod: 'sk-range-histogram'
    };
    return RangeHistogram;
}(React.PureComponent));
exports.RangeHistogram = RangeHistogram;
//# sourceMappingURL=RangeHistogram.js.map