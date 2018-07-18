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
var HierarchicalRefinementFilter = /** @class */ (function (_super) {
    __extends(HierarchicalRefinementFilter, _super);
    function HierarchicalRefinementFilter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HierarchicalRefinementFilter.prototype.defineBEMBlocks = function () {
        var blockClass = this.props.mod || "sk-hierarchical-refinement";
        return {
            container: blockClass + "-list",
            option: blockClass + "-option"
        };
    };
    HierarchicalRefinementFilter.prototype.defineAccessor = function () {
        var _a = this.props, field = _a.field, id = _a.id, title = _a.title, size = _a.size, orderKey = _a.orderKey, orderDirection = _a.orderDirection, startLevel = _a.startLevel;
        return new core_1.NestedFacetAccessor(id, {
            field: field, id: id, title: title, size: size, orderKey: orderKey,
            orderDirection: orderDirection, startLevel: startLevel
        });
    };
    HierarchicalRefinementFilter.prototype.addFilter = function (level, option) {
        this.accessor.state = this.accessor.state.toggleLevel(level, option.key);
        this.searchkit.performSearch();
    };
    HierarchicalRefinementFilter.prototype.renderOption = function (level, option) {
        var block = this.bemBlocks.option;
        var active = this.accessor.resultsState.contains(level, option.key);
        var _a = this.props, countFormatter = _a.countFormatter, itemComponent = _a.itemComponent;
        return (React.createElement("div", { key: option.key },
            core_1.renderComponent(itemComponent, {
                active: active,
                bemBlocks: this.bemBlocks,
                label: this.translate(option.key),
                itemKey: option.key,
                count: countFormatter(option.doc_count),
                showCount: true,
                onClick: this.addFilter.bind(this, level, option)
            }),
            active && this.renderOptions(level + 1)));
    };
    HierarchicalRefinementFilter.prototype.renderOptions = function (level) {
        var block = this.bemBlocks.container;
        return (React.createElement("div", { className: block("hierarchical-options") }, map(this.accessor.getBuckets(level), this.renderOption.bind(this, level))));
    };
    HierarchicalRefinementFilter.prototype.render = function () {
        var block = this.bemBlocks.container;
        var _a = this.props, id = _a.id, title = _a.title, containerComponent = _a.containerComponent;
        return core_1.renderComponent(containerComponent, {
            title: title,
            className: id ? "filter--" + id : undefined,
            disabled: this.accessor.getBuckets(0).length == 0
        }, React.createElement("div", { className: block("root") }, this.renderOptions(0)));
    };
    HierarchicalRefinementFilter.defaultProps = {
        countFormatter: identity,
        containerComponent: ui_1.Panel,
        itemComponent: ui_1.ItemComponent
    };
    HierarchicalRefinementFilter.propTypes = defaults({
        field: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        orderKey: PropTypes.string,
        orderDirection: PropTypes.oneOf(["asc", "desc"]),
        startLevel: PropTypes.number,
        countFormatter: PropTypes.func,
        containerComponent: core_1.RenderComponentPropType,
        itemComponent: core_1.RenderComponentPropType
    }, core_1.SearchkitComponent.propTypes);
    return HierarchicalRefinementFilter;
}(core_1.SearchkitComponent));
exports.HierarchicalRefinementFilter = HierarchicalRefinementFilter;
//# sourceMappingURL=HierarchicalRefinementFilter.js.map