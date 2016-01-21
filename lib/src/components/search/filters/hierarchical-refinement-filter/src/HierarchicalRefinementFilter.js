var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
require("../styles/index.scss");
var core_1 = require("../../../../../core");
var defaults = require("lodash/defaults");
var omit = require("lodash/omit");
var map = require("lodash/map");
var HierarchicalRefinementFilter = (function (_super) {
    __extends(HierarchicalRefinementFilter, _super);
    function HierarchicalRefinementFilter(props) {
        _super.call(this, props);
    }
    HierarchicalRefinementFilter.prototype.defineBEMBlocks = function () {
        var blockClass = this.props.mod || "hierarchical-refinement";
        return {
            container: blockClass + "-list",
            option: blockClass + "-option"
        };
    };
    HierarchicalRefinementFilter.prototype.defineAccessor = function () {
        return new core_1.NestedFacetAccessor(this.props.id, omit(this.props, ["mod"]));
    };
    HierarchicalRefinementFilter.prototype.addFilter = function (level, option) {
        this.accessor.state = this.accessor.state.toggleLevel(level, option.key);
        this.searchkit.performSearch();
    };
    HierarchicalRefinementFilter.prototype.renderOption = function (level, option) {
        var _this = this;
        var block = this.bemBlocks.option;
        var isSelected = this.accessor.resultsState.contains(level, option.key);
        var className = block().state({
            selected: isSelected
        });
        return (React.createElement("div", {"key": option.key}, React.createElement(core_1.FastClick, {"handler": this.addFilter.bind(this, level, option)}, React.createElement("div", {"className": className}, React.createElement("div", {"className": block("text")}, this.translate(option.key)), React.createElement("div", {"className": block("count")}, option.doc_count))), (function () {
            if (isSelected) {
                return _this.renderOptions(level + 1);
            }
        })()));
    };
    HierarchicalRefinementFilter.prototype.renderOptions = function (level) {
        var block = this.bemBlocks.container;
        return (React.createElement("div", {"className": block("hierarchical-options")}, map(this.accessor.getBuckets(level), this.renderOption.bind(this, level))));
    };
    HierarchicalRefinementFilter.prototype.render = function () {
        var block = this.bemBlocks.container;
        return (React.createElement("div", {"data-qa": "filter--" + this.props.id, "className": block().mix("filter--" + this.props.id)}, React.createElement("div", {"data-qa": "title", "className": block("header")}, this.props.title), React.createElement("div", {"data-qa": "options", "className": block("root")}, this.renderOptions(0))));
    };
    HierarchicalRefinementFilter.propTypes = map({
        field: React.PropTypes.string.isRequired,
        id: React.PropTypes.string.isRequired,
        title: React.PropTypes.string.isRequired,
        orderKey: React.PropTypes.string,
        orderDirection: React.PropTypes.oneOf(["asc", "desc"]),
        startLevel: React.PropTypes.number
    }, core_1.SearchkitComponent.propTypes);
    return HierarchicalRefinementFilter;
})(core_1.SearchkitComponent);
exports.HierarchicalRefinementFilter = HierarchicalRefinementFilter;
//# sourceMappingURL=HierarchicalRefinementFilter.js.map