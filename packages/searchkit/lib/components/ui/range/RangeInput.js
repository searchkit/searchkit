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
var react_1 = require("../../../core/react");
var omit = require("lodash/omit");
/*
 * Input validates input and only calls onChange for valid values
 */
var NumberInput = /** @class */ (function (_super) {
    __extends(NumberInput, _super);
    function NumberInput(props) {
        var _this = _super.call(this, props) || this;
        _this.onChange = _this.onChange.bind(_this);
        _this.state = {
            value: props.value
        };
        return _this;
    }
    NumberInput.prototype.componentWillReceiveProps = function (nextProps) {
        if (nextProps.value !== this.props.value) {
            this.setState({ value: nextProps.value });
        }
    };
    NumberInput.prototype.isValid = function (value) {
        value = '' + value; // ensure string
        // Weird number check, please do something else
        return ('' + parseInt(value, 10) == value);
    };
    NumberInput.prototype.onChange = function (e) {
        var _a = this.props, field = _a.field, onChange = _a.onChange;
        var value = e.target.value;
        this.setState({ value: value });
        if (this.isValid(value) && onChange) {
            onChange(value, field);
        }
    };
    NumberInput.prototype.render = function () {
        var rest = omit(this.props, ['field', 'onChange']);
        return React.createElement("input", __assign({ type: "number" }, rest, { value: this.state.value, onChange: this.onChange }));
    };
    NumberInput.defaultProps = {
        value: ''
    };
    return NumberInput;
}(React.Component));
exports.NumberInput = NumberInput;
var RangeInput = /** @class */ (function (_super) {
    __extends(RangeInput, _super);
    function RangeInput(props) {
        var _this = _super.call(this, props) || this;
        // this.handleInputChange = this.handleInputChange.bind(this);
        _this.handleSubmit = _this.handleSubmit.bind(_this);
        return _this;
    }
    RangeInput.prototype.handleInputChange = function (_value, _key) {
        // const { min, max, minValue, maxValue, onFinished } = this.props
        // const values = defaults({
        //   [key]: clamp(value, min, max)
        // }, {
        //   min: minValue, max: maxValue
        // })
        // onFinished(values)
    };
    RangeInput.prototype.handleSubmit = function (e) {
        e.preventDefault();
        this.props.onFinished({ min: this.refs.min.state.value, max: this.refs.max.state.value });
    };
    RangeInput.prototype.render = function () {
        var _a = this.props, mod = _a.mod, className = _a.className, minValue = _a.minValue, maxValue = _a.maxValue, translate = _a.translate, minPlaceholder = _a.minPlaceholder, maxPlaceholder = _a.maxPlaceholder;
        var bemBlocks = {
            container: react_1.block(mod).el
        };
        return (React.createElement("form", { className: bemBlocks.container().mix(className), onSubmit: this.handleSubmit },
            React.createElement(NumberInput, { ref: "min", className: bemBlocks.container("input"), value: minValue, field: "min", onChange: this.handleInputChange, placeholder: translate('range.min') || minPlaceholder }),
            React.createElement("div", { className: bemBlocks.container("to-label") }, translate('range.to') || '-'),
            React.createElement(NumberInput, { ref: "max", className: bemBlocks.container("input"), value: maxValue, field: "max", onChange: this.handleInputChange, placeholder: translate('range.max') || maxPlaceholder }),
            React.createElement("button", { type: "submit", className: bemBlocks.container("submit") }, translate('range.submit') || 'Go')));
    };
    RangeInput.defaultProps = {
        mod: "sk-range-input",
        translate: function (_str) { return undefined; },
        minPlaceholder: 'min',
        maxPlaceholder: 'max'
    };
    return RangeInput;
}(React.Component));
exports.RangeInput = RangeInput;
//# sourceMappingURL=RangeInput.js.map