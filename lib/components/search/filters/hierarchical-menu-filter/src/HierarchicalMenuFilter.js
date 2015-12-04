var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var HierarchicalFacetAccessor_1 = require("../../../../../domain/accessors/HierarchicalFacetAccessor");
var _ = require("lodash");
var classNames = require('classnames');
var SearchkitComponent_1 = require("../../../../SearchkitComponent");
require("./../styles/index.scss");
var HierarchicalMenuFilter = (function (_super) {
    __extends(HierarchicalMenuFilter, _super);
    function HierarchicalMenuFilter(props) {
        _super.call(this, props);
    }
    HierarchicalMenuFilter.prototype.componentWillMount = function () {
        _super.prototype.componentWillMount.call(this);
        this.createAccessors();
    };
    HierarchicalMenuFilter.prototype.createAccessors = function () {
        var _this = this;
        this.accessors = this.props.fields.map(function (field, i) {
            var ignoreKeys = _.slice(_this.props.fields, i);
            return _this.searcher.stateManager.registerAccessor(new HierarchicalFacetAccessor_1.default(field, { title: _this.props.title, size: 100, fields: ignoreKeys }));
        });
    };
    HierarchicalMenuFilter.prototype.addFilter = function (accessor, option) {
        var isSelected = accessor.state.contains(option.key);
        var childAccessors = _.slice(this.accessors, _.indexOf(this.accessors, accessor));
        _.each(childAccessors, function (accessor) { return accessor.state.clear(); });
        if (!isSelected)
            accessor.state.add(option.key);
        accessor.search();
    };
    HierarchicalMenuFilter.prototype.getLevelAccessor = function (level) {
        return this.accessors[level - 1];
    };
    HierarchicalMenuFilter.prototype.renderOption = function (level, option) {
        var _this = this;
        var accessor = this.getLevelAccessor(level);
        var isSelected = accessor.state.contains(option.key);
        var optionClassName = classNames({
            "hierarchical-menu-list-option": true,
            "hierarchical-menu-list-option--checked": isSelected
        });
        return (React.createElement("div", {"className": "hierarchical-menu-list-options__item", "key": level + "_" + option.key}, React.createElement("div", {"className": optionClassName, "onClick": this.addFilter.bind(this, accessor, option)}, React.createElement("div", {"className": "hierarchical-menu-list-option__text"}, option.key, " (", option.doc_count, ")")), (function () {
            if (isSelected) {
                return _this.renderOptions(level + 1);
            }
        })()));
    };
    HierarchicalMenuFilter.prototype.hasOptions = function () {
        return this.accessors[0].getBuckets().length != 0;
    };
    HierarchicalMenuFilter.prototype.renderOptions = function (level) {
        var accessor = this.accessors[level - 1];
        if (!accessor) {
            return null;
        }
        return (React.createElement("div", {"className": "hierarchical-menu-list-options"}, _.map(accessor.getBuckets(), this.renderOption.bind(this, level))));
    };
    HierarchicalMenuFilter.prototype.render = function () {
        var className = classNames({
            "hierarchical-menu-list-option": true,
            "hierarchical-menu-list-option--disabled": !this.hasOptions()
        });
        return (React.createElement("div", {"className": "hierarchical-menu-list"}, React.createElement("div", {"className": className}, React.createElement("div", {"className": "hierarchical-menu-list-option__text"}, this.props.title)), this.renderOptions(1)));
    };
    return HierarchicalMenuFilter;
})(SearchkitComponent_1.default);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = HierarchicalMenuFilter;
//# sourceMappingURL=HierarchicalMenuFilter.js.map