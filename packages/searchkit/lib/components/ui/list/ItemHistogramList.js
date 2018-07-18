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
var ItemListComponents_1 = require("./ItemListComponents");
var FastClick_1 = require("../../../core/react/FastClick");
var defaults = require("lodash/defaults");
var ItemHistogramComponent = /** @class */ (function (_super) {
    __extends(ItemHistogramComponent, _super);
    function ItemHistogramComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ItemHistogramComponent.prototype.getCountRatio = function () {
        var _a = this.props, rawCount = _a.rawCount, listDocCount = _a.listDocCount;
        if ((rawCount == undefined) || (listDocCount == undefined) || (listDocCount == 0)) {
            return 0;
        }
        else {
            return rawCount / listDocCount;
        }
    };
    ItemHistogramComponent.prototype.render = function () {
        var _a = this.props, bemBlocks = _a.bemBlocks, onClick = _a.onClick, active = _a.active, disabled = _a.disabled, style = _a.style, itemKey = _a.itemKey, label = _a.label, count = _a.count, showCount = _a.showCount, showCheckbox = _a.showCheckbox;
        var block = bemBlocks.option;
        var className = block()
            .state({ active: active, disabled: disabled, histogram: true })
            .mix(bemBlocks.container("item"));
        var barWidth = (this.getCountRatio() * 100) + '%';
        return (React.createElement(FastClick_1.FastClick, { handler: onClick },
            React.createElement("div", { className: className, style: style, "data-qa": "option", "data-key": itemKey },
                React.createElement("div", { className: block("bar-container") },
                    React.createElement("div", { className: block("bar"), style: { width: barWidth } })),
                showCheckbox ? React.createElement("input", { type: "checkbox", "data-qa": "checkbox", checked: active, readOnly: true, className: block("checkbox").state({ active: active }) }) : undefined,
                React.createElement("div", { "data-qa": "label", className: block("text") }, label),
                (showCount && (count != undefined)) ? React.createElement("div", { "data-qa": "count", className: block("count") }, count) : undefined)));
    };
    return ItemHistogramComponent;
}(React.PureComponent));
exports.ItemHistogramComponent = ItemHistogramComponent;
var ItemHistogramList = /** @class */ (function (_super) {
    __extends(ItemHistogramList, _super);
    function ItemHistogramList() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ItemHistogramList.defaultProps = defaults({
        //mod: "sk-item-histogram",
        itemComponent: ItemHistogramComponent,
        showCount: true,
    }, ItemListComponents_1.AbstractItemList.defaultProps);
    return ItemHistogramList;
}(ItemListComponents_1.AbstractItemList));
exports.ItemHistogramList = ItemHistogramList;
//# sourceMappingURL=ItemHistogramList.js.map