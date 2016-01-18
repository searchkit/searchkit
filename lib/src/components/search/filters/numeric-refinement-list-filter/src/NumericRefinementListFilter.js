var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var _ = require("lodash");
require("../styles/index.scss");
var core_1 = require("../../../../../core");
var NumericRefinementListFilter = (function (_super) {
    __extends(NumericRefinementListFilter, _super);
    function NumericRefinementListFilter() {
        _super.apply(this, arguments);
    }
    NumericRefinementListFilter.prototype.defineAccessor = function () {
        return new core_1.NumericOptionsAccessor(this.props.id, { id: this.props.id, field: this.props.field, options: this.props.options, title: this.props.title });
    };
    NumericRefinementListFilter.prototype.defineBEMBlocks = function () {
        var blockName = this.props.mod || "numeric-refinement-list";
        return {
            container: blockName,
            option: blockName + "-option"
        };
    };
    NumericRefinementListFilter.prototype.addFilter = function (option) {
        this.accessor.state = this.accessor.state.toggle(option.key);
        this.searchkit.performSearch();
    };
    NumericRefinementListFilter.prototype.isSelected = function (option) {
        return this.accessor.state.getValue() == option.key;
    };
    NumericRefinementListFilter.prototype.renderOption = function (option) {
        var block = this.bemBlocks.option;
        var className = block()
            .mix(this.bemBlocks.container("item"))
            .state({
            selected: this.isSelected(option),
            disabled: this.accessor.getBuckets().length == 0
        });
        return (React.createElement(core_1.FastClick, {"handler": this.addFilter.bind(this, option), "key": option.key}, React.createElement("div", {"className": className}, React.createElement("div", {"className": block("text")}, this.translate(option.key)), React.createElement("div", {"className": block("count")}, option.doc_count))));
    };
    NumericRefinementListFilter.prototype.render = function () {
        var block = this.bemBlocks.container;
        var className = block().mix("filter--" + this.props.id);
        return (React.createElement("div", {"className": className}, React.createElement("div", {"className": block("header")}, this.props.title), React.createElement("div", {"className": block("options")}, _.map(this.accessor.getBuckets(), this.renderOption.bind(this)))));
    };
    NumericRefinementListFilter.propTypes = _.defaults({
        field: React.PropTypes.string.isRequired,
        title: React.PropTypes.string.isRequired,
        id: React.PropTypes.string.isRequired,
        options: React.PropTypes.arrayOf(React.PropTypes.shape({
            title: React.PropTypes.string.isRequired,
            from: React.PropTypes.number,
            to: React.PropTypes.number
        }))
    }, core_1.SearchkitComponent.propTypes);
    return NumericRefinementListFilter;
})(core_1.SearchkitComponent);
exports.NumericRefinementListFilter = NumericRefinementListFilter;
//# sourceMappingURL=NumericRefinementListFilter.js.map