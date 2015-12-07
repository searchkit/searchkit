var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var _ = require("lodash");
var classNames = require('classnames');
var core_1 = require("../../../../../core");
require("./../styles/index.scss");
var MenuFilter = (function (_super) {
    __extends(MenuFilter, _super);
    function MenuFilter() {
        _super.apply(this, arguments);
    }
    MenuFilter.prototype.shouldCreateNewSearcher = function () {
        return true;
    };
    MenuFilter.prototype.defineAccessor = function () {
        return new core_1.FacetAccessor(this.props.field, { operator: "OR", title: this.props.title });
    };
    MenuFilter.prototype.addFilter = function (option) {
        this.accessor.state.clear();
        if (option != "all") {
            this.accessor.state.add(option.key);
        }
        this.searchkit.performSearch();
    };
    MenuFilter.prototype.renderOption = function (option) {
        var optionClassName = classNames({
            "menu-list-options__item": true,
            "menu-list-option": true,
            "menu-list-option--checked": this.accessor.state.contains(option.key)
        });
        return (React.createElement("div", {"className": optionClassName, "key": option.key, "onClick": this.addFilter.bind(this, option)}, React.createElement("div", {"className": "menu-list-option__text"}, option.key)));
    };
    MenuFilter.prototype.renderAllOption = function () {
        var optionClassName = classNames({
            "menu-list-options__item": true,
            "menu-list-option": true,
            "menu-list-option--checked": !this.accessor.state.getValue()
        });
        return (React.createElement("div", {"className": optionClassName, "key": "all", "onClick": this.addFilter.bind(this, "all")}, React.createElement("div", {"className": "menu-list-option__text"}, "All")));
    };
    MenuFilter.prototype.render = function () {
        return (React.createElement("div", {"className": "menu-list"}, React.createElement("div", {"className": "menu-list-options"}, this.renderAllOption(), _.map(this.accessor.getBuckets(), this.renderOption.bind(this)))));
    };
    return MenuFilter;
})(core_1.SearchkitComponent);
exports.MenuFilter = MenuFilter;
//# sourceMappingURL=MenuFilter.js.map