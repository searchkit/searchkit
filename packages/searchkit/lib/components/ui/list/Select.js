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
var core_1 = require("../../../core");
var map = require("lodash/map");
var identity = require("lodash/identity");
var Select = /** @class */ (function (_super) {
    __extends(Select, _super);
    function Select(props) {
        var _this = _super.call(this, props) || this;
        _this.onChange = _this.onChange.bind(_this);
        return _this;
    }
    Select.prototype.onChange = function (e) {
        var setItems = this.props.setItems;
        var key = e.target.value;
        setItems([key]);
    };
    Select.prototype.getSelectedValue = function () {
        var _a = this.props.selectedItems, selectedItems = _a === void 0 ? [] : _a;
        if (selectedItems.length == 0)
            return null;
        return selectedItems[0];
    };
    Select.prototype.render = function () {
        var _a = this.props, mod = _a.mod, className = _a.className, items = _a.items, disabled = _a.disabled, showCount = _a.showCount, translate = _a.translate, countFormatter = _a.countFormatter;
        var bemBlocks = {
            container: core_1.block(mod).el
        };
        return (React.createElement("div", { className: bemBlocks.container().mix(className).state({ disabled: disabled }) },
            React.createElement("select", { onChange: this.onChange, value: this.getSelectedValue() }, map(items, function (_a) {
                var key = _a.key, label = _a.label, title = _a.title, disabled = _a.disabled, doc_count = _a.doc_count;
                var text = translate(label || title || key);
                if (showCount && doc_count !== undefined)
                    text += " (" + countFormatter(doc_count) + ")";
                return React.createElement("option", { key: key, value: key, disabled: disabled }, text);
            }))));
    };
    Select.defaultProps = {
        mod: "sk-select",
        showCount: true,
        translate: identity,
        countFormatter: identity
    };
    return Select;
}(React.PureComponent));
exports.Select = Select;
//# sourceMappingURL=Select.js.map