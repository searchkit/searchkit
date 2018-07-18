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
var ItemComponents_1 = require("./ItemComponents");
var core_1 = require("../../../core");
var map = require("lodash/map");
var includes = require("lodash/includes");
var defaults = require("lodash/defaults");
var identity = require("lodash/identity");
var AbstractItemList = /** @class */ (function (_super) {
    __extends(AbstractItemList, _super);
    function AbstractItemList() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AbstractItemList.prototype.isActive = function (option) {
        var _a = this.props, selectedItems = _a.selectedItems, multiselect = _a.multiselect;
        if (multiselect) {
            return includes(selectedItems, option.key);
        }
        else {
            if (selectedItems.length == 0)
                return null;
            return selectedItems[0] == option.key;
        }
    };
    AbstractItemList.prototype.render = function () {
        var _this = this;
        var _a = this.props, mod = _a.mod, itemComponent = _a.itemComponent, _b = _a.items, items = _b === void 0 ? [] : _b, translate = _a.translate, toggleItem = _a.toggleItem, setItems = _a.setItems, multiselect = _a.multiselect, countFormatter = _a.countFormatter, disabled = _a.disabled, showCount = _a.showCount, className = _a.className, docCount = _a.docCount;
        var bemBlocks = {
            container: core_1.block(mod).el,
            option: core_1.block(mod + "-option").el
        };
        var toggleFunc = multiselect ? toggleItem : (function (key) { return setItems([key]); });
        var actions = map(items, function (option) {
            var label = option.title || option.label || option.key;
            return React.createElement(itemComponent, {
                label: translate(label),
                onClick: function () { return toggleFunc(option.key); },
                bemBlocks: bemBlocks,
                key: option.key,
                itemKey: option.key,
                count: countFormatter(option.doc_count),
                rawCount: option.doc_count,
                listDocCount: docCount,
                disabled: option.disabled,
                showCount: showCount,
                active: _this.isActive(option)
            });
        });
        return (React.createElement("div", { "data-qa": "options", className: bemBlocks.container().mix(className).state({ disabled: disabled }) }, actions));
    };
    AbstractItemList.defaultProps = {
        mod: "sk-item-list",
        showCount: true,
        itemComponent: ItemComponents_1.CheckboxItemComponent,
        translate: identity,
        multiselect: true,
        selectItems: [],
        countFormatter: identity
    };
    return AbstractItemList;
}(React.PureComponent));
exports.AbstractItemList = AbstractItemList;
var ItemList = /** @class */ (function (_super) {
    __extends(ItemList, _super);
    function ItemList() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ItemList.defaultProps = defaults({
        itemComponent: ItemComponents_1.ItemComponent
    }, AbstractItemList.defaultProps);
    return ItemList;
}(AbstractItemList));
exports.ItemList = ItemList;
var CheckboxItemList = /** @class */ (function (_super) {
    __extends(CheckboxItemList, _super);
    function CheckboxItemList() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CheckboxItemList.defaultProps = defaults({
        itemComponent: ItemComponents_1.CheckboxItemComponent
    }, AbstractItemList.defaultProps);
    return CheckboxItemList;
}(AbstractItemList));
exports.CheckboxItemList = CheckboxItemList;
var Toggle = /** @class */ (function (_super) {
    __extends(Toggle, _super);
    function Toggle() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Toggle.defaultProps = defaults({
        itemComponent: ItemComponents_1.ItemComponent,
        mod: 'sk-toggle',
        showCount: false,
    }, AbstractItemList.defaultProps);
    return Toggle;
}(AbstractItemList));
exports.Toggle = Toggle;
var Tabs = /** @class */ (function (_super) {
    __extends(Tabs, _super);
    function Tabs() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Tabs.defaultProps = defaults({
        itemComponent: ItemComponents_1.ItemComponent,
        mod: 'sk-tabs',
        showCount: false,
        multiselect: false,
    }, AbstractItemList.defaultProps);
    return Tabs;
}(AbstractItemList));
exports.Tabs = Tabs;
//# sourceMappingURL=ItemListComponents.js.map