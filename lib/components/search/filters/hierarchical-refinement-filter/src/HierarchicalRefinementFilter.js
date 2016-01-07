var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var _ = require("lodash");
require("../styles/index.scss");
var core_1 = require("../../../../../core");
var PathFacetAccessor = (function (_super) {
    __extends(PathFacetAccessor, _super);
    function PathFacetAccessor(key, options) {
        _super.call(this, key, options.id);
        this.state = new core_1.LevelState();
        this.options = options;
    }
    PathFacetAccessor.prototype.getBuckets = function (path) {
        var results = this.getResults();
        var rpath = ['aggregations', this.key, path, 'buckets'];
        return _.get(results, rpath, []);
    };
    PathFacetAccessor.prototype.buildSharedQuery = function (query) {
        var _this = this;
        var levelFilters = this.state.getValue();
        var filterTerms = _.map(levelFilters, function (level, i) {
            var filter = level[0];
            var value = filter.slice(_.get(levelFilters, [i - 1, 0], "/").length);
            return core_1.Term(_this.options.field, filter, {
                $name: _this.options.title || _this.translate(_this.key),
                $value: _this.translate(value),
                $id: _this.options.id,
                $disabled: false,
                $remove: function () {
                    _this.state = _this.state.clear(i);
                }
            });
        });
        if (filterTerms.length > 0) {
            query = query.addFilter(this.options.field, core_1.BoolMust(filterTerms));
        }
        return query;
    };
    PathFacetAccessor.prototype.buildOwnQuery = function (query) {
        var _this = this;
        var aggs = (_a = {},
            _a["/"] = core_1.Terms(this.options.field, {
                size: 0,
                include: "/.+",
                exclude: "/.+/.+"
            }),
            _a
        );
        _.forEach(this.state.getValue(), function (value) {
            aggs[value] = core_1.Terms(_this.options.field, {
                size: 0,
                include: value + "/.+",
                exclude: value + "/.+/.+"
            });
        });
        query = query.setAggs(core_1.AggsList(this.key, query.getFilters(this.options.field), aggs));
        return query;
        var _a;
    };
    return PathFacetAccessor;
})(core_1.Accessor);
exports.PathFacetAccessor = PathFacetAccessor;
var HierarchicalRefinementFilter = (function (_super) {
    __extends(HierarchicalRefinementFilter, _super);
    function HierarchicalRefinementFilter(props) {
        _super.call(this, props);
    }
    HierarchicalRefinementFilter.prototype.defineBEMBlocks = function () {
        var blockClass = this.props.mod || "hierarchical-menu";
        return {
            container: blockClass + "-list",
            option: blockClass + "-option"
        };
    };
    HierarchicalRefinementFilter.prototype.shouldCreateNewSearcher = function () {
        return true;
    };
    HierarchicalRefinementFilter.prototype.defineAccessor = function () {
        return new PathFacetAccessor(this.props.id, { id: this.props.id, title: this.props.title, field: this.props.field });
    };
    HierarchicalRefinementFilter.prototype.addFilter = function (level, option) {
        this.accessor.state = this.accessor.state.clear(level);
        this.accessor.state = this.accessor.state.add(level, option.key);
        this.searchkit.performSearch();
    };
    HierarchicalRefinementFilter.prototype.renderOption = function (path, level, option) {
        var _this = this;
        var block = this.bemBlocks.option;
        var isSelected = this.accessor.state.contains(level, option.key);
        var className = block().state({
            selected: isSelected
        });
        return (React.createElement("div", {"key": option.key}, React.createElement(core_1.FastClick, {"handler": this.addFilter.bind(this, level, option)}, React.createElement("div", {"className": className}, React.createElement("div", {"className": block("text")}, this.translate(option.key.slice(path.length))), React.createElement("div", {"className": block("count")}, option.doc_count))), (function () {
            if (isSelected) {
                return _this.renderOptions(option.key, level + 1);
            }
        })()));
    };
    HierarchicalRefinementFilter.prototype.renderOptions = function (path, level) {
        var block = this.bemBlocks.container;
        return (React.createElement("div", {"className": block("hierarchical-options")}, _.map(this.accessor.getBuckets(path), this.renderOption.bind(this, path, level))));
    };
    HierarchicalRefinementFilter.prototype.render = function () {
        var block = this.bemBlocks.container;
        return (React.createElement("div", {"className": block().mix("filter--" + this.props.id)}, React.createElement("div", {"className": block("header")}, this.props.title), React.createElement("div", {"className": block("root")}, this.renderOptions("/", 0))));
    };
    return HierarchicalRefinementFilter;
})(core_1.SearchkitComponent);
exports.HierarchicalRefinementFilter = HierarchicalRefinementFilter;
//# sourceMappingURL=HierarchicalRefinementFilter.js.map