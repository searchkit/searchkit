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
var ui_1 = require("../../../ui");
exports.Panel = ui_1.Panel;
exports.CheckboxItemList = ui_1.CheckboxItemList;
var FacetFilter_1 = require("./FacetFilter");
var defaults = require("lodash/defaults");
var concat = require("lodash/concat");
var isUndefined = require("lodash/isUndefined");
var FacetFilterProps_1 = require("./FacetFilterProps");
var allItem = {
    key: "$all", label: "All"
};
var MenuFilter = /** @class */ (function (_super) {
    __extends(MenuFilter, _super);
    function MenuFilter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MenuFilter.prototype.toggleFilter = function (option) {
        if (option === allItem.key || this.accessor.state.contains(option)) {
            this.accessor.state = this.accessor.state.clear();
        }
        else {
            this.accessor.state = this.accessor.state.setValue([option]);
        }
        this.searchkit.performSearch();
    };
    MenuFilter.prototype.setFilters = function (options) {
        this.toggleFilter(options[0]);
    };
    MenuFilter.prototype.getSelectedItems = function () {
        var selectedValue = this.accessor.state.getValue()[0];
        return [!isUndefined(selectedValue) ? selectedValue : allItem.key];
    };
    MenuFilter.prototype.getItems = function () {
        var all = {
            key: allItem.key,
            label: allItem.label,
            doc_count: this.accessor.getDocCount()
        };
        return concat([all], _super.prototype.getItems.call(this));
    };
    MenuFilter.propTypes = defaults({}, FacetFilterProps_1.FacetFilterPropTypes.propTypes);
    MenuFilter.defaultProps = defaults({
        listComponent: ui_1.ItemList,
        operator: "OR"
    }, FacetFilter_1.FacetFilter.defaultProps);
    return MenuFilter;
}(FacetFilter_1.FacetFilter));
exports.MenuFilter = MenuFilter;
//# sourceMappingURL=MenuFilter.js.map