Object.defineProperty(exports, "__esModule", { value: true });
var PropTypes = require("prop-types");
exports.RangePropTypes = {
    onChange: PropTypes.func.isRequired,
    onFinishd: PropTypes.func.isRequired,
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
    minValue: PropTypes.number,
    maxValue: PropTypes.number,
    items: PropTypes.array,
    disabled: PropTypes.bool,
    mod: PropTypes.string,
    className: PropTypes.string,
    translate: PropTypes.func
};
//# sourceMappingURL=RangeProps.js.map