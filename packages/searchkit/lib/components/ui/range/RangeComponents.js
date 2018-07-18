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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var PropTypes = require("prop-types");
var _1 = require("./");
var RangeComponent = /** @class */ (function (_super) {
    __extends(RangeComponent, _super);
    function RangeComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RangeComponent.prototype.render = function () {
        var _a = this.props, showHistogram = _a.showHistogram, showSlider = _a.showSlider, showInput = _a.showInput;
        return (React.createElement("div", null,
            showHistogram ? React.createElement(_1.RangeHistogram, __assign({}, this.props)) : undefined,
            showSlider ? React.createElement(_1.RangeSlider, __assign({}, this.props)) : undefined,
            showInput ? React.createElement(_1.RangeInput, __assign({}, this.props)) : undefined));
    };
    RangeComponent.propTypes = {
        showHistogram: PropTypes.bool,
        showSlider: PropTypes.bool,
        showInput: PropTypes.bool
    };
    return RangeComponent;
}(React.PureComponent));
exports.RangeComponent = RangeComponent;
function RangeComponentBuilder(components) {
    return function (props) { return React.createElement(RangeComponent, __assign({}, props, components)); };
}
exports.RangeComponentBuilder = RangeComponentBuilder;
exports.RangeSliderHistogram = RangeComponentBuilder({ showHistogram: true, showSlider: true });
exports.RangeSliderHistogramInput = RangeComponentBuilder({ showHistogram: true, showSlider: true, showInput: true });
exports.RangeSliderInput = RangeComponentBuilder({ showSlider: true, showInput: true });
exports.RangeHistogramInput = RangeComponentBuilder({ showHistogram: true, showInput: true });
//# sourceMappingURL=RangeComponents.js.map