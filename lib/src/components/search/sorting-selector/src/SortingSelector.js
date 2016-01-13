var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var _ = require("lodash");
require("../styles/index.scss");
var core_1 = require("../../../../core");
var SortingSelector = (function (_super) {
    __extends(SortingSelector, _super);
    function SortingSelector() {
        _super.apply(this, arguments);
    }
    SortingSelector.prototype.defineAccessor = function () {
        return new core_1.SortingAccessor("sort", { options: this.props.options });
    };
    SortingSelector.prototype.defineBEMBlocks = function () {
        return {
            container: (this.props.mod || "sorting-selector")
        };
    };
    SortingSelector.prototype.renderOption = function (option) {
        return (React.createElement("option", {"key": option.label, "value": option.label}, option.label));
    };
    SortingSelector.prototype.updateSorting = function (e) {
        var val = e.target.value;
        this.accessor.state = this.accessor.state.setValue(val);
        this.searchkit.performSearch();
    };
    SortingSelector.prototype.getSelectedValue = function () {
        return "" + this.accessor.state.getValue();
    };
    SortingSelector.prototype.render = function () {
        return (React.createElement("div", {"className": this.bemBlocks.container()}, React.createElement("select", {"onChange": this.updateSorting.bind(this), "value": this.getSelectedValue()}, _.map(this.props.options, this.renderOption.bind(this)))));
    };
    return SortingSelector;
})(core_1.SearchkitComponent);
exports.SortingSelector = SortingSelector;
//# sourceMappingURL=SortingSelector.js.map