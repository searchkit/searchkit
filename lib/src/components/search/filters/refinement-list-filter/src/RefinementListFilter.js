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
    }
    RefinementListFilter.prototype.shouldCreateNewSearcher = function () {
        return true;
    };
    RefinementListFilter.prototype.defineAccessor = function () {
        return new core_1.FacetAccessor(this.props.field, {
            id: this.props.id, operator: this.props.operator,
            title: this.props.title, size: (this.props.size || 50),
            translations: this.props.translations
        });
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
        return (React.createElement(core_1.FastClick, {"handler": this.addFilter.bind(this, option), "key": option.key}, React.createElement("div", {"className": optionClassName, "data-qa": "option"}, React.createElement("div", {"data-qa": "checkbox", "className": block("checkbox").state({ selected: isSelected })}), React.createElement("div", {"data-qa": "label", "className": block("text")}, this.translate(option.key)), React.createElement("div", {"data-qa": "count", "className": block("count")}, option.doc_count))));
    };
    RefinementListFilter.prototype.hasOptions = function () {
        return this.accessor.getBuckets().length != 0;
    };
    RefinementListFilter.prototype.toggleViewMoreOption = function (option) {
        this.accessor.setViewMoreOption(option);
        this.searchkit.performSearch();
    };
    RefinementListFilter.prototype.renderShowMore = function () {
        var option = this.accessor.getMoreSizeOption();
        if (!option) {
            return null;
        }
        return (React.createElement("div", {"onClick": this.toggleViewMoreOption.bind(this, option)}, React.createElement("div", {"data-qa": "show-more", "className": this.bemBlocks.container("view-more-action")}, this.translate(option.label))));
    };
    RefinementListFilter.prototype.render = function () {
        var block = this.bemBlocks.container;
        var className = block()
            .mix("filter--" + this.props.id)
            .state({
            disabled: !this.hasOptions()
        });
        return (React.createElement("div", {"data-qa": "filter--" + this.props.id, "className": className}, React.createElement("div", {"data-qa": "header", "className": block("header")}, this.props.title), React.createElement("div", {"data-qa": "options", "className": block("options")}, _.map(this.accessor.getBuckets(), this.renderOption.bind(this))), this.renderShowMore()));
    };
    return RefinementListFilter;
})(core_1.SearchkitComponent);
exports.RefinementListFilter = RefinementListFilter;
//# sourceMappingURL=RefinementListFilter.js.map