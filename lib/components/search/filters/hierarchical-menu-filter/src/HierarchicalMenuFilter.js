var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var _ = require("lodash");
var classNames = require('classnames');
var core_1 = require("../../../../../core");
require("./../styles/index.scss");
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
        this.accessor.state.clear(level);
        this.accessor.state.add(level, option.key);
        this.searchkit.performSearch();
    };
    HierarchicalMenuFilter.prototype.renderOption = function (level, option) {
        var _this = this;
        var className = classNames({
            "hierarchical-menu-option--selected": this.accessor.state.contains(level, option.key),
            "hierarchical-menu-option": true
        });
        return (React.createElement("div", {"key": option.key}, React.createElement("div", {"className": className, "onClick": this.addFilter.bind(this, option, level)}, option.key, " (", option.doc_count, ")"), React.createElement("div", null, (function () {
            if (_this.accessor.state.contains(level, option.key)) {
                return _this.renderOptions(level + 1);
            }
        })())));
    };
    HierarchicalMenuFilter.prototype.renderOptions = function (level) {
        return (React.createElement("div", {"className": "hierarchical-menu-list__hierarchical-options"}, _.map(this.accessor.getBuckets(level), this.renderOption.bind(this, level))));
    };
    HierarchicalMenuFilter.prototype.render = function () {
        var className = classNames((_a = {
                "hierarchical-menu-list": true
            },
            _a[this.props.id] = true,
            _a
        ));
        return (React.createElement("div", {"className": className}, React.createElement("div", {"className": "hierarchical-menu-list__header"}, this.props.title), this.renderOptions(0)));
        var _a;
    };
    return HierarchicalMenuFilter;
})(core_1.SearchkitComponent);
exports.HierarchicalMenuFilter = HierarchicalMenuFilter;
//# sourceMappingURL=HierarchicalMenuFilter.js.map