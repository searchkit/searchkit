var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var _ = require("lodash");
var FacetAccessor_1 = require("../../../../../domain/accessors/FacetAccessor");
var SearchkitComponent_1 = require("../../../../SearchkitComponent");
require("./../styles/index.scss");
var SelectedFilters = (function (_super) {
    __extends(SelectedFilters, _super);
    function SelectedFilters() {
        _super.apply(this, arguments);
    }
    SelectedFilters.prototype.getFilters = function () {
        var filterAccessors = this.searcher.stateManager.findAccessorsByClass(FacetAccessor_1.default);
        var filters = _.flatten(_.map(filterAccessors, function (facetAccessor) {
            var filters = facetAccessor.state.get() || [];
            return _.map(filters, function (filter) {
                return { name: facetAccessor.options.title, value: filter, accessor: facetAccessor };
            });
        }));
        return filters || [];
    };
    SelectedFilters.prototype.hasFilters = function () {
        return _.size(this.getFilters()) != 0;
    };
    SelectedFilters.prototype.renderFilter = function (filter) {
        return (React.createElement("div", {"className": "selected-filters__item selected-filter", "key": filter.name + ":" + filter.value}, React.createElement("div", {"className": "selected-filter__name"}, filter.name, ": ", filter.value), React.createElement("div", {"className": "selected-filter__remove-action", "onClick": this.removeFilter.bind(this, filter.value, filter.accessor)}, "x")));
    };
    SelectedFilters.prototype.removeFilter = function (value, facetAccessor) {
        facetAccessor.state.remove(value);
        facetAccessor.search();
    };
    SelectedFilters.prototype.render = function () {
        if (!this.hasFilters()) {
            return (React.createElement("div", null));
        }
        return (React.createElement("div", {"className": "selected-filters"}, _.map(this.getFilters(), this.renderFilter.bind(this))));
    };
    return SelectedFilters;
})(SearchkitComponent_1.default);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SelectedFilters;
//# sourceMappingURL=SelectedFilters.js.map