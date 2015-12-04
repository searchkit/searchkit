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
var RefinementListFilter = (function (_super) {
    __extends(RefinementListFilter, _super);
    function RefinementListFilter() {
        _super.apply(this, arguments);
    }
    RefinementListFilter.prototype.shouldCreateNewSearcher = function () {
        return true;
    };
    RefinementListFilter.prototype.defineAccessor = function () {
        return new core_1.FacetAccessor(this.props.field, { operator: this.props.operator, title: this.props.title });
    };
    RefinementListFilter.prototype.addFilter = function (option) {
        this.accessor.state.toggle(option.key);
        this.searchkit.performSearch();
    };
    RefinementListFilter.prototype.renderOption = function (option) {
        var checkedClassName = classNames({
            "refinement-option__checkbox": true,
            "refinement-option__checkbox--checked": this.accessor.state.contains(option.key)
        });
        var optionClassName = classNames({
            "refinement-list-filter__item": true,
            "refinement-option": true,
            "refinement-option--checked": this.accessor.state.contains(option.key)
        });
        return (React.createElement("div", {"className": optionClassName, "key": option.key, "onClick": this.addFilter.bind(this, option)}, React.createElement("div", {"className": checkedClassName}), React.createElement("div", {"className": "refinement-option__text"}, option.key), React.createElement("div", {"className": "refinement-option__count"}, option.doc_count)));
    };
    RefinementListFilter.prototype.hasOptions = function () {
        return this.accessor.getBuckets().length != 0;
    };
    RefinementListFilter.prototype.render = function () {
        var className = classNames({
            "refinement-list-filter": true,
            "refinement-list-filter--disabled": !this.hasOptions()
        });
        return (React.createElement("div", {"className": className}, React.createElement("div", {"className": "refinement-list-filter__header"}, this.props.title), React.createElement("div", {"className": "refinement-list-filter__options"}, _.map(this.accessor.getBuckets(), this.renderOption.bind(this)))));
    };
    return RefinementListFilter;
})(core_1.SearchkitComponent);
exports.RefinementListFilter = RefinementListFilter;
//# sourceMappingURL=RefinementListFilter.js.map