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
    PathFacetAccessor.prototype.getBuckets = function (level) {
        var results = this.getResults();
        console.log(results, ['aggregations', this.key, "lvl" + level, "parents", 'buckets']);
        var rpath = ['aggregations', this.key, "lvl" + level, "parents", 'buckets'];
        return _.get(results, rpath, []);
    };
    PathFacetAccessor.prototype.buildSharedQuery = function (query) {
        var _this = this;
        var levelFilters = this.state.getValue();
        var lastIndex = levelFilters.length - 1;
        var filterTerms = _.map(levelFilters, function (filter, i) {
            var value = filter[0];
            var subField = (i === lastIndex) ? ".value" : ".ancestors";
            return core_1.Term(_this.options.field + subField, value, {
                $name: _this.options.title || _this.translate(_this.key),
                $value: _this.translate(value),
                $id: _this.options.id,
                $disabled: _this.state.levelHasFilters(i + 1),
                $remove: function () {
                    _this.state = _this.state.clear(i);
                }
            });
        });
        if (filterTerms.length > 0) {
            query = query.addFilter(this.options.field, core_1.NestedFilter(this.options.field, core_1.BoolMust(filterTerms)));
        }
        return query;
    };
    PathFacetAccessor.prototype.buildOwnQuery = function (query) {
        var aggs = {
            "lvl0": {
                filter: {
                    bool: {
                        must: [
                            core_1.Term("taxonomy.level", 1)
                        ]
                    }
                },
                "aggs": {
                    "parents": {
                        "terms": {
                            "field": "taxonomy.value",
                            "size": 0
                        }
                    }
                }
            }
        };
        _.each(this.state.getValue(), function (level, i) {
            aggs["lvl" + (i + 1)] = {
                filter: {
                    bool: {
                        must: [
                            core_1.Term("taxonomy.level", i + 2),
                            core_1.Term("taxonomy.ancestors", level[0])
                        ]
                    }
                },
                "aggs": {
                    "parents": {
                        "terms": {
                            "field": "taxonomy.value",
                            "size": 0
                        }
                    }
                }
            };
        });
        query = query.setAggs({
            taxonomy: {
                nested: {
                    path: "taxonomy"
                },
                aggs: aggs
            }
        });
        return query;
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
    HierarchicalRefinementFilter.prototype.renderOption = function (level, option) {
        var _this = this;
        var block = this.bemBlocks.option;
        var isSelected = this.accessor.state.contains(level, option.key);
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
        return (React.createElement("div", {"className": block("hierarchical-options")}, _.map(this.accessor.getBuckets(level), this.renderOption.bind(this, level))));
    };
    HierarchicalRefinementFilter.prototype.render = function () {
        var block = this.bemBlocks.container;
        return (React.createElement("div", {"className": block().mix("filter--" + this.props.id)}, React.createElement("div", {"className": block("header")}, this.props.title), React.createElement("div", {"className": block("root")}, this.renderOptions(0))));
    };
    return HierarchicalRefinementFilter;
})(core_1.SearchkitComponent);
exports.HierarchicalRefinementFilter = HierarchicalRefinementFilter;
//# sourceMappingURL=HierarchicalRefinementFilter.js.map