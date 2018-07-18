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
var FastClick_1 = require("../../../core/react/FastClick");
function itemRenderer(props) {
    var bemBlocks = props.bemBlocks, onClick = props.onClick, active = props.active, disabled = props.disabled, style = props.style, itemKey = props.itemKey, label = props.label, count = props.count, showCount = props.showCount, showCheckbox = props.showCheckbox;
    var block = bemBlocks.option;
    var className = block()
        .state({ active: active, disabled: disabled })
        .mix(bemBlocks.container("item"));
    var hasCount = showCount && (count != undefined) && (count != null);
    return (React.createElement(FastClick_1.FastClick, { handler: onClick },
        React.createElement("div", { className: className, style: style, "data-qa": "option", "data-key": itemKey },
            showCheckbox ? React.createElement("input", { type: "checkbox", "data-qa": "checkbox", checked: active, readOnly: true, className: block("checkbox").state({ active: active }) }) : undefined,
            React.createElement("div", { "data-qa": "label", className: block("text") }, label),
            hasCount ? React.createElement("div", { "data-qa": "count", className: block("count") }, count) : undefined)));
}
var ItemComponent = /** @class */ (function (_super) {
    __extends(ItemComponent, _super);
    function ItemComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ItemComponent.prototype.render = function () {
        return itemRenderer(this.props);
    };
    ItemComponent.defaultProps = {
        showCount: true,
        showCheckbox: false
    };
    return ItemComponent;
}(React.PureComponent));
exports.ItemComponent = ItemComponent;
var CheckboxItemComponent = /** @class */ (function (_super) {
    __extends(CheckboxItemComponent, _super);
    function CheckboxItemComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CheckboxItemComponent.prototype.render = function () {
        return itemRenderer(this.props);
    };
    CheckboxItemComponent.defaultProps = {
        showCount: true,
        showCheckbox: true
    };
    return CheckboxItemComponent;
}(React.PureComponent));
exports.CheckboxItemComponent = CheckboxItemComponent;
//# sourceMappingURL=ItemComponents.js.map