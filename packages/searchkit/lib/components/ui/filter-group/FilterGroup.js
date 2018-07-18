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
var map = require("lodash/map");
var FilterGroupItem = /** @class */ (function (_super) {
    __extends(FilterGroupItem, _super);
    function FilterGroupItem(props) {
        var _this = _super.call(this, props) || this;
        _this.removeFilter = _this.removeFilter.bind(_this);
        return _this;
    }
    FilterGroupItem.prototype.removeFilter = function () {
        var _a = this.props, removeFilter = _a.removeFilter, filter = _a.filter;
        if (removeFilter) {
            removeFilter(filter);
        }
    };
    FilterGroupItem.prototype.render = function () {
        var _a = this.props, bemBlocks = _a.bemBlocks, label = _a.label, itemKey = _a.itemKey;
        return (React.createElement(react_1.FastClick, { handler: this.removeFilter },
            React.createElement("div", { className: bemBlocks.items("value"), "data-key": itemKey }, label)));
    };
    return FilterGroupItem;
}(React.PureComponent));
exports.FilterGroupItem = FilterGroupItem;
var FilterGroup = /** @class */ (function (_super) {
    __extends(FilterGroup, _super);
    function FilterGroup(props) {
        var _this = _super.call(this, props) || this;
        _this.removeFilters = _this.removeFilters.bind(_this);
        return _this;
    }
    FilterGroup.prototype.removeFilters = function () {
        var _a = this.props, removeFilters = _a.removeFilters, filters = _a.filters;
        if (removeFilters) {
            removeFilters(filters);
        }
    };
    FilterGroup.prototype.render = function () {
        var _this = this;
        var _a = this.props, mod = _a.mod, className = _a.className, title = _a.title, filters = _a.filters;
        var bemBlocks = {
            container: react_1.block(mod).el,
            items: react_1.block(mod + "-items").el
        };
        return (React.createElement("div", { key: title, className: bemBlocks.container().mix(className) },
            React.createElement("div", { className: bemBlocks.items() },
                React.createElement("div", { className: bemBlocks.items("title") }, title),
                React.createElement("div", { className: bemBlocks.items("list") }, map(filters, function (filter) { return _this.renderFilter(filter, bemBlocks); }))),
            this.renderRemove(bemBlocks)));
    };
    FilterGroup.prototype.renderFilter = function (filter, bemBlocks) {
        var _a = this.props, translate = _a.translate, removeFilter = _a.removeFilter;
        return (React.createElement(FilterGroupItem, { key: filter.value, itemKey: filter.value, bemBlocks: bemBlocks, filter: filter, label: translate(filter.value), removeFilter: removeFilter }));
    };
    FilterGroup.prototype.renderRemove = function (bemBlocks) {
        if (!this.props.removeFilters)
            return null;
        return (React.createElement(react_1.FastClick, { handler: this.removeFilters },
            React.createElement("div", { className: bemBlocks.container("remove-action"), onClick: this.removeFilters }, "X")));
    };
    FilterGroup.defaultProps = {
        mod: "sk-filter-group",
        translate: function (str) { return str; }
    };
    return FilterGroup;
}(React.Component));
exports.FilterGroup = FilterGroup;
//# sourceMappingURL=FilterGroup.js.map