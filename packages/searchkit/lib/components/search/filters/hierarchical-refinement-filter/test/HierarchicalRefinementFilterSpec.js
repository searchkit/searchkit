var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var enzyme_1 = require("enzyme");
var TestHelpers_1 = require("../../../../__test__/TestHelpers");
var HierarchicalRefinementFilter_1 = require("../src/HierarchicalRefinementFilter");
var core_1 = require("../../../../../core");
var _ = require("lodash");
describe("Refinement List Filter tests", function () {
    beforeEach(function () {
        _this.searchkit = core_1.SearchkitManager.mock();
        spyOn(_this.searchkit, "performSearch");
        _this.wrapper = enzyme_1.mount(React.createElement(HierarchicalRefinementFilter_1.HierarchicalRefinementFilter, { countFormatter: function (count) { return "#" + count; }, field: "test", id: "testid", title: "test title", searchkit: _this.searchkit }));
        _this.accessor = _this.searchkit.getAccessorByType(core_1.NestedFacetAccessor);
        _this.setResults = function () {
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
                            },
                            lvl1: {
                                children: {
                                    buckets: [
                                        { key: "option2child1", doc_count: 1 },
                                        { key: "option2child2", doc_count: 1 }
                                    ]
                                }
                            }
                        }
                    }
                }
            });
        };
        _this.getContainer = function (label, index) {
            var container = _this.wrapper.find(".sk-hierarchical-refinement-list__" + label);
            if (_.isNumber(index)) {
                return container.children().at(index);
            }
            else {
                return container;
            }
        };
    });
    it("should configure accessor correctly", function () {
        expect(_this.accessor.key).toBe("testid");
        var options = _this.accessor.options;
        expect(options).toEqual({
            "id": "testid",
            "title": "test title",
            "field": "test",
            "size": undefined,
            "orderKey": undefined,
            "orderDirection": undefined,
            "startLevel": undefined
        });
    });
    it("should render correctly", function () {
        _this.setResults();
        expect(_this.wrapper).toMatchSnapshot();
    });
    it("should render 2nd level and have 1 levels selected correctly", function () {
        _this.accessor.state = _this.accessor.state.setValue([
            ["option2"], ["option2child2"]
        ]);
        _this.setResults();
        expect(_this.wrapper).toMatchSnapshot();
    });
    it("handle clicking an option", function () {
        _this.setResults();
        var option2 = _this.wrapper
            .find(".sk-hierarchical-refinement-list__hierarchical-options")
            .children().at(1)
            .find(".sk-hierarchical-refinement-option");
        TestHelpers_1.fastClick(option2);
        expect(_this.accessor.state.getValue())
            .toEqual([["option2"]]);
    });
    it("should add disabled state when no results", function () {
        expect(_this.wrapper).toMatchSnapshot();
    });
});
//# sourceMappingURL=HierarchicalRefinementFilterSpec.js.map