var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var _ = require("lodash");
require("../styles/index.scss");
var core_1 = require("../../../../../core");
var SelectedFilters = (function (_super) {
    __extends(SelectedFilters, _super);
    function SelectedFilters() {
        _super.apply(this, arguments);
    }
    SelectedFilters.prototype.defineBEMBlocks = function () {
        var blockName = (this.props.mod || "selected-filters");
        return {
            container: blockName,
            option: blockName + "-option"
        };
    };
    SelectedFilters.prototype.getFilters = function () {
        return this.searcher.query.getFiltersArray();
    };
    SelectedFilters.prototype.hasFilters = function () {
        return _.size(this.getFilters()) > 0;
    };
    SelectedFilters.prototype.renderFilter = function (filter) {
        var block = this.bemBlocks.option;
        var className = block()
            .mix(this.bemBlocks.container("item"))
            .mix("selected-filter--" + filter.$id);
        return (React.createElement("div", {"className": className, "key": filter.$name + ":" + filter.$value}, React.createElement("div", {"className": block("name")}, filter.$name, ": ", filter.$value), React.createElement(core_1.FastClick, {"handler": this.removeFilter.bind(this, filter)}, React.createElement("div", {"className": block("remove-action")}, "x"))));
    };
    SelectedFilters.prototype.removeFilter = function (filter) {
        filter.$remove();
        this.searchkit.performSearch();
    };
    SelectedFilters.prototype.render = function () {
        if (!this.hasFilters()) {
            return (React.createElement("div", null));
        }
        return (React.createElement("div", {"className": this.bemBlocks.container()}, _.map(_.filter(this.getFilters(), { $disabled: false }), this.renderFilter.bind(this))));
    };
    return SelectedFilters;
})(core_1.SearchkitComponent);
exports.SelectedFilters = SelectedFilters;
//# sourceMappingURL=SelectedFilters.js.map