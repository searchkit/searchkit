var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var _ = require("lodash");
require("../styles/index.scss");
var core_1 = require("../../../../../core");
var MenuFilter = (function (_super) {
    __extends(MenuFilter, _super);
    function MenuFilter() {
        _super.apply(this, arguments);
    }
    MenuFilter.prototype.shouldCreateNewSearcher = function () {
        return true;
    };
    MenuFilter.prototype.defineBEMBlocks = function () {
        var blockName = this.props.mod || "menu-list";
        return {
            container: blockName,
            option: blockName + "-option"
        };
    };
    MenuFilter.prototype.defineAccessor = function () {
        return new core_1.FacetAccessor(this.props.field, { id: this.props.id, operator: "OR", title: this.props.title });
    };
    MenuFilter.prototype.addFilter = function (option) {
        if (option === "All" || this.accessor.state.contains(option)) {
            this.accessor.state = this.accessor.state.clear();
        }
        else {
            this.accessor.state = this.accessor.state.setValue([option]);
        }
        this.searchkit.performSearch();
    };
    MenuFilter.prototype.renderOption = function (label, count, isChecked) {
        var className = this.bemBlocks.option()
            .state({ selected: isChecked })
            .mix(this.bemBlocks.container("item"));
        return (React.createElement(core_1.FastClick, {"handler": this.addFilter.bind(this, label), "key": label}, React.createElement("div", {"className": className}, React.createElement("div", {"className": this.bemBlocks.option("text")}, label), React.createElement("div", {"className": this.bemBlocks.option("count")}, count))));
    };
    MenuFilter.prototype.createOption = function (option) {
        var isChecked = this.accessor.state.contains(option.key);
        var count = option.doc_count;
        var label = this.translate(option.key);
        return this.renderOption(label, count, isChecked);
    };
    MenuFilter.prototype.render = function () {
        var _this = this;
        var block = this.bemBlocks.container;
        var className = block().mix("filter--" + this.props.id);
        var isAllChecked = function () {
            return !_this.accessor.state.getValue() || _this.accessor.state.getValue().length == 0;
        };
        return (React.createElement("div", {"className": className}, React.createElement("div", {"className": block("header")}, this.props.title), React.createElement("div", {"className": block("options")}, this.renderOption("All", null, isAllChecked()), _.map(this.accessor.getBuckets(), this.createOption.bind(this)))));
    };
    return MenuFilter;
})(core_1.SearchkitComponent);
exports.MenuFilter = MenuFilter;
//# sourceMappingURL=MenuFilter.js.map