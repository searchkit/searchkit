var _this = this;
var React = require("react");
var enzyme_1 = require("enzyme");
var HierarchicalRefinementFilter_tsx_1 = require("../src/HierarchicalRefinementFilter.tsx");
var core_1 = require("../../../../../core");
var bem = require("bem-cn");
var _ = require("lodash");
describe("Refinement List Filter tests", function () {
    beforeEach(function () {
        _this.searchkit = new core_1.SearchkitManager("localhost:9200", { useHistory: true });
        _this.createWrapper = function () {
            _this.wrapper = enzyme_1.mount(React.createElement(HierarchicalRefinementFilter_tsx_1.HierarchicalRefinementFilter, {"field": "test", "id": "testid", "title": "test title", "searchkit": _this.searchkit}));
            _this.searchkit.setResults({
                aggregations: {
                    testid: {
                        children: {
                            lvl0: {
                                children: {
                                    buckets: [
                                        { key: "option1", doc_count: 1 },
                                        { key: "option2", doc_count: 2 }
                                    ]
                                }
                            }
                        }
                    }
                }
            });
            _this.wrapper.update();
            _this.accessor = _this.searchkit.accessors.getAccessors()[0];
        };
        _this.getContainer = function (label, index) {
            var container = _this.wrapper.find(".hierarchical-refinement-list__" + label);
            if (_.isNumber(index)) {
                return container.children().at(index);
            }
            else {
                return container;
            }
        };
    });
    it("should render correctly", function () {
        _this.createWrapper();
        _this.wrapper.update();
        expect(_this.getContainer("header").text()).toBe("test title");
        expect(_this.getContainer("hierarchical-options").children().map(function (n) {
            return {
                label: n.find(".hierarchical-refinement-option__text").text(),
                count: n.find(".hierarchical-refinement-option__count").text()
            };
        })).toEqual([{ label: 'option1', count: "1" }, { label: "option2", count: "2" }]);
    });
    it("should configure accessor correctly", function () {
        _this.createWrapper();
        expect(_this.accessor.key).toBe("testid");
        var options = _this.accessor.options;
        expect(options).toEqual({
            "id": "testid",
            "title": "test title",
            "field": "test"
        });
    });
});
//# sourceMappingURL=HierarchicalRefinementFilterSpec.js.map