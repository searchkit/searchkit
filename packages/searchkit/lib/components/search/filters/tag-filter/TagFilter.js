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
var core_1 = require("../../../../core");
var TagFilter = /** @class */ (function (_super) {
    __extends(TagFilter, _super);
    function TagFilter() {
        var _this = _super.call(this) || this;
        _this.handleClick = _this.handleClick.bind(_this);
        return _this;
    }
    TagFilter.prototype.isActive = function () {
        var _a = this.props, field = _a.field, value = _a.value;
        var accessor = this.searchkit.accessors.statefulAccessors[field];
        if (!accessor) {
            console.warn('Missing accessor for', field, 'in TagFilter, add TagFilterConfig if needed');
            return false;
        }
        return accessor.state.contains(value);
    };
    TagFilter.prototype.handleClick = function () {
        var _a = this.props, field = _a.field, value = _a.value;
        var accessor = this.searchkit.accessors.statefulAccessors[field];
        if (!accessor) {
            console.error('Missing accessor for', field, 'in TagFilter, add TagFilterConfig if needed');
            return;
        }
        accessor.state = accessor.state.toggle(value);
        this.searchkit.performSearch();
    };
    TagFilter.prototype.render = function () {
        var _a = this.props, value = _a.value, children = _a.children;
        var className = "sk-tag-filter";
        if (this.isActive())
            className += " is-active";
        if (children) {
            return (React.createElement(core_1.FastClick, { handler: this.handleClick },
                React.createElement("div", { key: value, className: className }, this.props.children)));
        }
        else {
            // No children, use the value instead
            return (React.createElement(core_1.FastClick, { handler: this.handleClick },
                React.createElement("div", { key: value, className: className }, value)));
        }
    };
    return TagFilter;
}(core_1.SearchkitComponent));
exports.TagFilter = TagFilter;
//# sourceMappingURL=TagFilter.js.map