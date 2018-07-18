var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var enzyme_1 = require("enzyme");
var HierarchicalMenuFilter_1 = require("../src/HierarchicalMenuFilter");
var TestHelpers_1 = require("../../../../__test__/TestHelpers");
var core_1 = require("../../../../../core");
;
describe("HierarchicalMenuFilter tests", function () {
    beforeEach(function () {
        _this.searchkit = core_1.SearchkitManager.mock();
        spyOn(_this.searchkit, "performSearch");
        _this.wrapper = enzyme_1.mount(React.createElement(HierarchicalMenuFilter_1.HierarchicalMenuFilter, { searchkit: _this.searchkit, title: "Categories", id: "categories", orderKey: "_term", orderDirection: "asc", countFormatter: function (count) { return "#" + count; }, fields: ["lvl1", "lvl2"] }));
        _this.accessor = _this.searchkit.getAccessorByType(core_1.HierarchicalFacetAccessor);
        _this.setResults = function () {
            _this.searchkit.setResults({
                aggregations: {
                    categories: {
                        lvl1: { lvl1: { buckets: [
                                    { key: "Red", doc_count: 10 },
                                    { key: "Green", doc_count: 20 }
                                ] } },
                        lvl2: { lvl2: { buckets: [
                                    { key: "Crimson", doc_count: 10 },
                                    { key: "Maroon", doc_count: 12 }
                                ] } }
                    }
                }
            });
        };
    });
    it("should set the correct accessor options", function () {
        expect(_this.accessor.key).toBe("categories");
        expect(_this.accessor.options).toEqual({
            id: 'categories', title: 'Categories',
            fields: ['lvl1', 'lvl2'], size: 20,
            orderKey: "_term", orderDirection: "asc"
        });
    });
    it("should render first level correctly", function () {
        _this.setResults();
        expect(_this.wrapper).toMatchSnapshot();
    });
    it("should render 2nd level correctly with selected 3rd level", function () {
        _this.accessor.state = _this.accessor.state.setValue([
            ["Red"], ["Maroon"]
        ]);
        _this.setResults();
        expect(_this.wrapper).toMatchSnapshot();
    });
    it("should handle selecting an option", function () {
        _this.setResults();
        var redOption = _this.wrapper.find(".sk-hierarchical-menu-list__hierarchical-options")
            .children().at(0).find(".sk-hierarchical-menu-option");
        TestHelpers_1.fastClick(redOption);
        expect(_this.accessor.state.getValue()).toEqual([["Red"]]);
    });
});
//# sourceMappingURL=HierarchicalMenuFilterSpec.js.map