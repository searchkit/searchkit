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
var ItemComponents_1 = require("./ItemComponents");
var map = require("lodash/map");
var includes = require("lodash/includes");
var sortBy = require("lodash/sortBy");
var minBy = require("lodash/minBy");
var maxBy = require("lodash/maxBy");
var identity = require("lodash/identity");
function computeMinMax(items, field) {
    if (!items || items.length == 0)
        return { min: 0, max: 0 };
    return {
        min: minBy(items, field)[field],
        max: maxBy(items, field)[field]
    };
}
var TagCloud = /** @class */ (function (_super) {
    __extends(TagCloud, _super);
    function TagCloud() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TagCloud.prototype.render = function () {
        var _this = this;
        var _a = this.props, mod = _a.mod, className = _a.className, disabled = _a.disabled, items = _a.items, translate = _a.translate;
        var bemBlocks = {
            container: react_1.block(mod).el,
            option: react_1.block(mod + "-option").el
        };
        var sortedItems = sortBy(items, function (it) { return translate(it.title || it.label || it.key).toLowerCase(); });
        var _b = computeMinMax(items, "doc_count"), min = _b.min, max = _b.max;
        return (React.createElement("div", { className: bemBlocks.container().mix(className).state({ disabled: disabled }) }, map(sortedItems, function (item) { return _this.renderItem(item, bemBlocks, min, max); })));
    };
    TagCloud.prototype.renderItem = function (item, bemBlocks, min, max) {
        var _a = this.props, itemComponent = _a.itemComponent, minFontSize = _a.minFontSize, maxFontSize = _a.maxFontSize, showCount = _a.showCount, countFormatter = _a.countFormatter, _b = _a.selectedItems, selectedItems = _b === void 0 ? [] : _b, toggleItem = _a.toggleItem, disabled = _a.disabled, translate = _a.translate;
        var sizeRatio = (min === max) ? 0.5 : ((item.doc_count - min) / (max - min));
        var fontSize = minFontSize + sizeRatio * (maxFontSize - minFontSize); // TODO : make ratio function customizable (square, log, etc.)
        return react_1.renderComponent(itemComponent, {
            label: translate(item.title || item.label || item.key),
            onClick: function () { return toggleItem(item.key); },
            bemBlocks: bemBlocks,
            key: item.key,
            itemKey: item.key,
            disabled: disabled || item.disabled,
            active: includes(selectedItems, item.key),
            style: { fontSize: fontSize + 'em' },
            showCount: showCount,
            count: countFormatter(item.doc_count)
        });
    };
    TagCloud.defaultProps = {
        mod: "sk-tag-cloud",
        itemComponent: ItemComponents_1.ItemComponent,
        showCount: false,
        minFontSize: 1,
        maxFontSize: 1.5,
        translate: identity,
        countFormatter: identity
    };
    return TagCloud;
}(React.PureComponent));
exports.TagCloud = TagCloud;
//# sourceMappingURL=TagCloud.js.map