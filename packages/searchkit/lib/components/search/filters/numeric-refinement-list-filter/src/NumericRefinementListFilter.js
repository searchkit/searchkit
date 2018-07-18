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
var PropTypes = require("prop-types");
var core_1 = require("../../../../../core");
var ui_1 = require("../../../../ui");
var defaults = require("lodash/defaults");
var map = require("lodash/map");
var NumericRefinementListFilter = /** @class */ (function (_super) {
    __extends(NumericRefinementListFilter, _super);
    function NumericRefinementListFilter(props) {
        var _this = _super.call(this, props) || this;
        _this.toggleItem = _this.toggleItem.bind(_this);
        _this.setItems = _this.setItems.bind(_this);
        return _this;
    }
    NumericRefinementListFilter.prototype.defineAccessor = function () {
        var _a = this.props, id = _a.id, field = _a.field, options = _a.options, title = _a.title, multiselect = _a.multiselect, fieldOptions = _a.fieldOptions;
        return new core_1.NumericOptionsAccessor(id, {
            id: id, field: field, options: options, title: title, multiselect: multiselect, fieldOptions: fieldOptions
        });
    };
    NumericRefinementListFilter.prototype.toggleItem = function (key) {
        this.accessor.toggleOption(key);
    };
    NumericRefinementListFilter.prototype.setItems = function (keys) {
        this.accessor.setOptions(keys);
    };
    NumericRefinementListFilter.prototype.getSelectedItems = function () {
        var selectedOptions = this.accessor.getSelectedOrDefaultOptions() || [];
        return map(selectedOptions, "title");
    };
    NumericRefinementListFilter.prototype.hasOptions = function () {
        return this.accessor.getBuckets().length != 0;
    };
    NumericRefinementListFilter.prototype.render = function () {
        var _a = this.props, listComponent = _a.listComponent, containerComponent = _a.containerComponent, itemComponent = _a.itemComponent, showCount = _a.showCount, title = _a.title, id = _a.id, mod = _a.mod, className = _a.className, countFormatter = _a.countFormatter;
        return core_1.renderComponent(containerComponent, {
            title: title,
            className: id ? "filter--" + id : undefined,
            disabled: !this.hasOptions()
        }, core_1.renderComponent(listComponent, {
            mod: mod, className: className,
            items: this.accessor.getBuckets(),
            itemComponent: itemComponent,
            selectedItems: this.getSelectedItems(),
            toggleItem: this.toggleItem,
            setItems: this.setItems,
            docCount: this.accessor.getDocCount(),
            showCount: showCount,
            translate: this.translate,
            countFormatter: countFormatter
        }));
    };
    NumericRefinementListFilter.propTypes = defaults({
        containerComponent: core_1.RenderComponentPropType,
        listComponent: core_1.RenderComponentPropType,
        itemComponent: core_1.RenderComponentPropType,
        field: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
        multiselect: PropTypes.bool,
        showCount: PropTypes.bool,
        options: PropTypes.arrayOf(PropTypes.shape({
            title: PropTypes.string.isRequired,
            from: PropTypes.number,
            to: PropTypes.number,
            key: PropTypes.string
        })),
        fieldOptions: PropTypes.shape({
            type: PropTypes.oneOf(["embedded", "nested", "children"]).isRequired,
            options: PropTypes.object
        }),
        countFormatter: PropTypes.func
    }, core_1.SearchkitComponent.propTypes);
    NumericRefinementListFilter.defaultProps = {
        listComponent: ui_1.ItemList,
        containerComponent: ui_1.Panel,
        multiselect: false,
        showCount: true
    };
    return NumericRefinementListFilter;
}(core_1.SearchkitComponent));
exports.NumericRefinementListFilter = NumericRefinementListFilter;
//# sourceMappingURL=NumericRefinementListFilter.js.map