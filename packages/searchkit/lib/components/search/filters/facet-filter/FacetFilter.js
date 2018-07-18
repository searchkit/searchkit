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
var FacetFilterProps_1 = require("./FacetFilterProps");
var core_1 = require("../../../../core");
var react_1 = require("../../../../core/react");
var ui_1 = require("../../../ui");
var identity = require("lodash/identity");
var FacetFilter = /** @class */ (function (_super) {
    __extends(FacetFilter, _super);
    function FacetFilter(props) {
        var _this = _super.call(this, props) || this;
        _this.toggleViewMoreOption = _this.toggleViewMoreOption.bind(_this);
        return _this;
    }
    FacetFilter.prototype.getAccessorOptions = function () {
        var _a = this.props, field = _a.field, id = _a.id, operator = _a.operator, title = _a.title, include = _a.include, exclude = _a.exclude, size = _a.size, translations = _a.translations, orderKey = _a.orderKey, orderDirection = _a.orderDirection, fieldOptions = _a.fieldOptions;
        return {
            id: id, operator: operator, title: title, size: size, include: include, exclude: exclude, field: field,
            translations: translations, orderKey: orderKey, orderDirection: orderDirection, fieldOptions: fieldOptions
        };
    };
    FacetFilter.prototype.defineAccessor = function () {
        return new core_1.FacetAccessor(this.props.id, this.getAccessorOptions());
    };
    FacetFilter.prototype.defineBEMBlocks = function () {
        var blockName = this.props.mod || "sk-refinement-list";
        return {
            container: blockName,
            option: blockName + "-option"
        };
    };
    FacetFilter.prototype.componentDidUpdate = function (prevProps) {
        if (prevProps.operator != this.props.operator) {
            this.accessor.options.operator = this.props.operator;
            this.searchkit.performSearch();
        }
    };
    FacetFilter.prototype.toggleFilter = function (key) {
        this.accessor.state = this.accessor.state.toggle(key);
        this.searchkit.performSearch();
    };
    FacetFilter.prototype.setFilters = function (keys) {
        this.accessor.state = this.accessor.state.setValue(keys);
        this.searchkit.performSearch();
    };
    FacetFilter.prototype.toggleViewMoreOption = function (option) {
        this.accessor.setViewMoreOption(option);
        this.searchkit.performSearch();
    };
    FacetFilter.prototype.hasOptions = function () {
        return this.accessor.getBuckets().length != 0;
    };
    FacetFilter.prototype.getSelectedItems = function () {
        return this.accessor.state.getValue();
    };
    FacetFilter.prototype.getItems = function () {
        return this.props.bucketsTransform(this.accessor.getBuckets());
    };
    FacetFilter.prototype.render = function () {
        var _a = this.props, listComponent = _a.listComponent, containerComponent = _a.containerComponent, showCount = _a.showCount, title = _a.title, id = _a.id, countFormatter = _a.countFormatter;
        return react_1.renderComponent(containerComponent, {
            title: title,
            className: id ? "filter--" + id : undefined,
            disabled: !this.hasOptions()
        }, [
            react_1.renderComponent(listComponent, {
                key: "listComponent",
                items: this.getItems(),
                itemComponent: this.props.itemComponent,
                selectedItems: this.getSelectedItems(),
                toggleItem: this.toggleFilter.bind(this),
                setItems: this.setFilters.bind(this),
                docCount: this.accessor.getDocCount(),
                showCount: showCount,
                translate: this.translate,
                countFormatter: countFormatter
            }),
            this.renderShowMore()
        ]);
    };
    FacetFilter.prototype.renderShowMore = function () {
        var _this = this;
        var option = this.accessor.getMoreSizeOption();
        if (!option || !this.props.showMore) {
            return null;
        }
        return (React.createElement(react_1.FastClick, { handler: function () { return _this.toggleViewMoreOption(option); }, key: "showMore" },
            React.createElement("div", { "data-qa": "show-more", className: this.bemBlocks.container("view-more-action") }, this.translate(option.label))));
    };
    FacetFilter.propTypes = FacetFilterProps_1.FacetFilterPropTypes;
    FacetFilter.defaultProps = {
        listComponent: ui_1.CheckboxItemList,
        containerComponent: ui_1.Panel,
        size: 50,
        collapsable: false,
        showCount: true,
        showMore: true,
        bucketsTransform: identity
    };
    return FacetFilter;
}(react_1.SearchkitComponent));
exports.FacetFilter = FacetFilter;
//# sourceMappingURL=FacetFilter.js.map