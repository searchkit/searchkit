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
var PropTypes = require("prop-types");
var core_1 = require("../../../../../core");
var ui_1 = require("../../../../ui");
var defaults = require("lodash/defaults");
var map = require("lodash/map");
var identity = require("lodash/identity");
var HierarchicalMenuFilter = /** @class */ (function (_super) {
    __extends(HierarchicalMenuFilter, _super);
    function HierarchicalMenuFilter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HierarchicalMenuFilter.prototype.defineBEMBlocks = function () {
        var blockClass = this.props.mod || "sk-hierarchical-menu";
        return {
            container: blockClass + "-list",
            option: blockClass + "-option"
        };
    };
    HierarchicalMenuFilter.prototype.defineAccessor = function () {
        var _a = this.props, id = _a.id, title = _a.title, fields = _a.fields, size = _a.size, orderKey = _a.orderKey, orderDirection = _a.orderDirection;
        return new core_1.HierarchicalFacetAccessor(id, {
            id: id, title: title, fields: fields, size: size, orderKey: orderKey, orderDirection: orderDirection
        });
    };
    HierarchicalMenuFilter.prototype.addFilter = function (option, level) {
        this.accessor.state = this.accessor.state.toggleLevel(level, option.key);
        this.searchkit.performSearch();
    };
    HierarchicalMenuFilter.prototype.renderOption = function (level, option) {
        var _this = this;
        var block = this.bemBlocks.option;
        var _a = this.props, countFormatter = _a.countFormatter, itemComponent = _a.itemComponent;
        var active = this.accessor.state.contains(level, option.key);
        return (React.createElement("div", { key: option.key },
            core_1.renderComponent(itemComponent, {
                active: active,
                itemKey: option.key,
                showCount: true,
                bemBlocks: this.bemBlocks,
                onClick: this.addFilter.bind(this, option, level),
                label: this.translate(option.key),
                count: countFormatter(option.doc_count)
            }),
            (function () {
                if (_this.accessor.resultsState.contains(level, option.key)) {
                    return _this.renderOptions(level + 1);
                }
            })()));
    };
    HierarchicalMenuFilter.prototype.renderOptions = function (level) {
        var block = this.bemBlocks.container;
        return (React.createElement("div", { className: block("hierarchical-options") }, map(this.accessor.getBuckets(level), this.renderOption.bind(this, level))));
    };
    HierarchicalMenuFilter.prototype.render = function () {
        var block = this.bemBlocks.container;
        var _a = this.props, id = _a.id, title = _a.title, containerComponent = _a.containerComponent;
        return core_1.renderComponent(containerComponent, {
            title: title,
            className: id ? "filter--" + id : undefined,
            disabled: this.accessor.getBuckets(0).length == 0
        }, React.createElement("div", { className: block("root") }, this.renderOptions(0)));
    };
    HierarchicalMenuFilter.defaultProps = {
        countFormatter: identity,
        size: 20,
        containerComponent: ui_1.Panel,
        itemComponent: ui_1.ItemComponent
    };
    HierarchicalMenuFilter.propTypes = defaults({
        id: PropTypes.string.isRequired,
        fields: PropTypes.arrayOf(PropTypes.string).isRequired,
        title: PropTypes.string.isRequired,
        orderKey: PropTypes.string,
        orderDirection: PropTypes.oneOf(["asc", "desc"]),
        countFormatter: PropTypes.func,
        containerComponent: core_1.RenderComponentPropType,
        itemComponent: core_1.RenderComponentPropType
    }, core_1.SearchkitComponent.propTypes);
    return HierarchicalMenuFilter;
}(core_1.SearchkitComponent));
exports.HierarchicalMenuFilter = HierarchicalMenuFilter;
//# sourceMappingURL=HierarchicalMenuFilter.js.map