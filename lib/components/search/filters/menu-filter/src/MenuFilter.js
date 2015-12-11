var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var _ = require("lodash");
var classNames = require('classnames');
require("../styles/index.scss");
var core_1 = require("../../../../../core");
var MenuFilter = (function (_super) {
    __extends(MenuFilter, _super);
    function MenuFilter() {
        _super.apply(this, arguments);
    }
    MenuFilter.prototype.shouldCreateNewSearcher = function () {
        return true;
    };
    MenuFilter.prototype.defineAccessor = function () {
        return new core_1.FacetAccessor(this.props.field, { id: this.props.id, operator: "OR", title: this.props.title });
    };
    MenuFilter.prototype.addFilter = function (option) {
        this.accessor.state = this.accessor.state.clear();
        if (option != "all") {
            this.accessor.state = this.accessor.state.add(option.key);
        }
        this.searchkit.performSearch();
    };
    MenuFilter.prototype.renderOption = function (option) {
        var optionClassName = classNames({
            "menu-list-options__item": true,
            "menu-list-option": true,
            "menu-list-option--checked": this.accessor.state.contains(option.key)
        });
        return (React.createElement(core_1.FastClick, {"handler": this.addFilter.bind(this, option)}, React.createElement("div", {"className": optionClassName, "key": option.key}, React.createElement("div", {"className": "menu-list-option__text"}, option.key))));
    };
    MenuFilter.prototype.renderAllOption = function () {
        var optionClassName = classNames({
            "menu-list-options__item": true,
            "menu-list-option": true,
            "menu-list-option--checked": !this.accessor.state.getValue()
        });
        return (React.createElement(core_1.FastClick, {"handler": this.addFilter.bind(this, "all")}, React.createElement("div", {"className": optionClassName, "key": "all"}, React.createElement("div", {"className": "menu-list-option__text"}, "All"))));
    };
    MenuFilter.prototype.render = function () {
        var className = classNames((_a = {
                "menu-list": true
            },
            _a["filter--" + this.props.id] = true,
            _a
        ));
        return (React.createElement("div", {"className": className}, React.createElement("div", {"className": "menu-list-options"}, this.renderAllOption(), _.map(this.accessor.getBuckets(), this.renderOption.bind(this)))));
        var _a;
    };
    return MenuFilter;
})(core_1.SearchkitComponent);
exports.MenuFilter = MenuFilter;
//# sourceMappingURL=MenuFilter.js.map