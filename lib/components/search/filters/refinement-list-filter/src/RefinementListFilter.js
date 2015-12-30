var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var _ = require("lodash");
require("../styles/index.scss");
var core_1 = require("../../../../../core");
var RefinementListFilter = (function (_super) {
    __extends(RefinementListFilter, _super);
    function RefinementListFilter(props) {
        _super.call(this, props);
        this.defaultSize = (this.props.size || 50);
        this.state = {
            size: this.defaultSize
        };
    }
    RefinementListFilter.prototype.shouldCreateNewSearcher = function () {
        return true;
    };
    RefinementListFilter.prototype.defineAccessor = function () {
        return new core_1.FacetAccessor(this.props.field, { id: this.props.id, operator: this.props.operator, title: this.props.title, size: this.state.size });
    };
    RefinementListFilter.prototype.defineBEMBlocks = function () {
        var blockName = this.props.mod || "refinement-list";
        return {
            container: blockName,
            option: blockName + "-option"
        };
    };
    RefinementListFilter.prototype.addFilter = function (option) {
        this.accessor.state = this.accessor.state.toggle(option.key);
        this.searchkit.performSearch();
    };
    RefinementListFilter.prototype.renderOption = function (option) {
        var block = this.bemBlocks.option;
        var isSelected = this.accessor.state.contains(option.key);
        var optionClassName = block()
            .mix(this.bemBlocks.container("item"))
            .state({ selected: isSelected });
        return (React.createElement(core_1.FastClick, {"handler": this.addFilter.bind(this, option), "key": option.key}, React.createElement("div", {"className": optionClassName}, React.createElement("div", {"className": block("checkbox").state({ selected: isSelected })}), React.createElement("div", {"className": block("text")}, this.translate(option.key)), React.createElement("div", {"className": block("count")}, option.doc_count))));
    };
    RefinementListFilter.prototype.hasOptions = function () {
        return this.accessor.getBuckets().length != 0;
    };
    RefinementListFilter.prototype.toggleViewMore = function (size) {
        this.setState({ size: size });
        this.accessor.setSize(size);
        this.searchkit.performSearch();
    };
    RefinementListFilter.prototype.renderShowMore = function () {
        var total = this.accessor.getCount();
        if (total < this.state.size && this.state.size == this.defaultSize) {
            return null;
        }
        var label = "";
        var size = 0;
        if (this.state.size >= total) {
            size = this.defaultSize;
            label = "view less";
        }
        else if ((this.state.size + 50) >= total) {
            size = this.state.size + 50;
            label = "view all";
        }
        else {
            size = this.state.size + 50;
            label = "view more";
        }
        return (React.createElement(core_1.FastClick, {"handler": this.toggleViewMore.bind(this, size)}, React.createElement("div", {"className": this.bemBlocks.container("view-more-action")}, label)));
    };
    RefinementListFilter.prototype.render = function () {
        var block = this.bemBlocks.container;
        var className = block()
            .mix("filter--" + this.props.id)
            .state({
            disabled: !this.hasOptions()
        });
        return (React.createElement("div", {"className": className}, React.createElement("div", {"className": block("header")}, this.props.title), React.createElement("div", {"className": block("options")}, _.map(this.accessor.getBuckets(), this.renderOption.bind(this))), this.renderShowMore()));
    };
    return RefinementListFilter;
})(core_1.SearchkitComponent);
exports.RefinementListFilter = RefinementListFilter;
//# sourceMappingURL=RefinementListFilter.js.map