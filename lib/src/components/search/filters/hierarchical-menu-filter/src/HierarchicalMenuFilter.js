var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
require("../styles/index.scss");
var core_1 = require("../../../../../core");
var defaults = require("lodash/defaults");
var map = require("lodash/map");
var HierarchicalMenuFilter = (function (_super) {
    __extends(HierarchicalMenuFilter, _super);
    function HierarchicalMenuFilter(props) {
        _super.call(this, props);
    }
    HierarchicalMenuFilter.prototype.defineBEMBlocks = function () {
        var blockClass = this.props.mod || "hierarchical-menu";
        return {
            container: blockClass + "-list",
            option: blockClass + "-option"
        };
    };
    HierarchicalMenuFilter.prototype.defineAccessor = function () {
        return new core_1.HierarchicalFacetAccessor(this.props.id, { id: this.props.id, title: this.props.title, fields: this.props.fields, size: 0 });
    };
    HierarchicalMenuFilter.prototype.addFilter = function (option, level) {
        this.accessor.state = this.accessor.state.toggleLevel(level, option.key);
        this.searchkit.performSearch();
    };
    HierarchicalMenuFilter.prototype.renderOption = function (level, option) {
        var _this = this;
        var block = this.bemBlocks.option;
        var className = block().state({
            selected: this.accessor.state.contains(level, option.key)
        });
        return (React.createElement("div", {"key": option.key}, React.createElement(core_1.FastClick, {"handler": this.addFilter.bind(this, option, level)}, React.createElement("div", {"className": className}, React.createElement("div", {"className": block("text")}, this.translate(option.key)), React.createElement("div", {"className": block("count")}, option.doc_count))), (function () {
            if (_this.accessor.resultsState.contains(level, option.key)) {
                return _this.renderOptions(level + 1);
            }
        })()));
    };
    HierarchicalMenuFilter.prototype.renderOptions = function (level) {
        var block = this.bemBlocks.container;
        return (React.createElement("div", {"className": block("hierarchical-options")}, map(this.accessor.getBuckets(level), this.renderOption.bind(this, level))));
    };
    HierarchicalMenuFilter.prototype.render = function () {
        var block = this.bemBlocks.container;
        var classname = block()
            .mix("filter--" + this.props.id)
            .state({
            disabled: this.accessor.getBuckets(0).length == 0
        });
        return (React.createElement("div", {"className": classname}, React.createElement("div", {"className": block("header")}, this.props.title), React.createElement("div", {"className": block("root")}, this.renderOptions(0))));
    };
    HierarchicalMenuFilter.propTypes = defaults({
        id: React.PropTypes.string.isRequired,
        fields: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
        title: React.PropTypes.string.isRequired
    }, core_1.SearchkitComponent.propTypes);
    return HierarchicalMenuFilter;
})(core_1.SearchkitComponent);
exports.HierarchicalMenuFilter = HierarchicalMenuFilter;
//# sourceMappingURL=HierarchicalMenuFilter.js.map