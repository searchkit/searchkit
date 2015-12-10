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
var SelectedFilters = (function (_super) {
    __extends(SelectedFilters, _super);
    function SelectedFilters() {
        _super.apply(this, arguments);
    }
    SelectedFilters.prototype.getFilters = function () {
        return this.searcher.query.getFiltersArray();
    };
    SelectedFilters.prototype.hasFilters = function () {
        return _.size(this.getFilters()) > 0;
    };
    SelectedFilters.prototype.renderFilter = function (filter) {
        var className = classNames((_a = {
                "selected-filters__item": true,
                "selected-filter": true
            },
            _a["selected-filter--" + filter.$id] = true,
            _a
        ));
        return (React.createElement("div", {"className": className, "key": filter.$name + ":" + filter.$value}, React.createElement("div", {"className": "selected-filter__name"}, filter.$name, ": ", filter.$value), React.createElement("div", {"className": "selected-filter__remove-action", "onMouseDown": this.leftMouseDown(this.removeFilter.bind(this, filter))}, "x")));
        var _a;
    };
    SelectedFilters.prototype.removeFilter = function (filter) {
        filter.$remove();
        this.searchkit.performSearch();
    };
    SelectedFilters.prototype.render = function () {
        if (!this.hasFilters()) {
            return (React.createElement("div", null));
        }
        return (React.createElement("div", {"className": "selected-filters"}, _.map(_.filter(this.getFilters(), { $disabled: false }), this.renderFilter.bind(this))));
    };
    return SelectedFilters;
})(core_1.SearchkitComponent);
exports.SelectedFilters = SelectedFilters;
//# sourceMappingURL=SelectedFilters.js.map