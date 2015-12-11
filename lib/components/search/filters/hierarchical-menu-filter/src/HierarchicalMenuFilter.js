var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var _ = require("lodash");
var classNames = require('classnames');
require("../styles/index.scss");
var core_1 = require("../../../../../core");
var HierarchicalMenuFilter = (function (_super) {
    __extends(HierarchicalMenuFilter, _super);
    function HierarchicalMenuFilter(props) {
        _super.call(this, props);
    }
    HierarchicalMenuFilter.prototype.shouldCreateNewSearcher = function () {
        return true;
    };
    HierarchicalMenuFilter.prototype.defineAccessor = function () {
        return new core_1.HierarchicalFacetAccessor(this.props.id, { id: this.props.id, title: this.props.title, fields: this.props.fields });
    };
    HierarchicalMenuFilter.prototype.addFilter = function (option, level) {
        if (this.accessor.state.contains(level, option.key)) {
            this.accessor.state = this.accessor.state.clear(level);
        }
        else {
            this.accessor.state = this.accessor.state.clear(level);
            this.accessor.state = this.accessor.state.add(level, option.key);
        }
        this.searchkit.performSearch();
    };
    HierarchicalMenuFilter.prototype.renderOption = function (level, option) {
        var _this = this;
        var className = classNames({
            "hierarchical-menu-option--selected": this.accessor.state.contains(level, option.key),
            "hierarchical-menu-option": true
        });
        return (React.createElement("div", {"key": option.key}, React.createElement(core_1.FastClick, {"handler": this.addFilter.bind(this, option, level)}, React.createElement("div", {"className": className}, React.createElement("div", {"className": "hierarchical-menu-option__text"}, option.key), React.createElement("div", {"className": "hierarchical-menu-option__count"}, option.doc_count))), (function () {
            if (_this.accessor.resultsState.contains(level, option.key)) {
                return _this.renderOptions(level + 1);
            }
        })()));
    };
    HierarchicalMenuFilter.prototype.renderOptions = function (level) {
        return (React.createElement("div", {"className": "hierarchical-menu-list__hierarchical-options"}, _.map(this.accessor.getBuckets(level), this.renderOption.bind(this, level))));
    };
    HierarchicalMenuFilter.prototype.render = function () {
        var className = classNames((_a = {
                "hierarchical-menu-list": true
            },
            _a["filter--" + this.props.id] = true,
            _a
        ));
        return (React.createElement("div", {"className": className}, React.createElement("div", {"className": "hierarchical-menu-list__header"}, this.props.title), React.createElement("div", {"className": "hierarchical-menu-list__root"}, this.renderOptions(0))));
        var _a;
    };
    return HierarchicalMenuFilter;
})(core_1.SearchkitComponent);
exports.HierarchicalMenuFilter = HierarchicalMenuFilter;
//# sourceMappingURL=HierarchicalMenuFilter.js.map