var _this = this;
var React = require("react");
var enzyme_1 = require("enzyme");
var HierarchicalMenuFilter_1 = require("../src/HierarchicalMenuFilter");
var TestHelpers_1 = require("../../../../__test__/TestHelpers");
var core_1 = require("../../../../../core");
var bem = require("bem-cn");
var _ = require("lodash");
describe("MenuFilter tests", function () {
    beforeEach(function () {
        _this.searchkit = core_1.SearchkitManager.mock();
        spyOn(_this.searchkit, "performSearch");
        _this.wrapper = enzyme_1.mount(React.createElement(HierarchicalMenuFilter_1.HierarchicalMenuFilter, {"searchkit": _this.searchkit, "title": "Categories", "id": "categories", "fields": ["lvl1", "lvl2"]}));
        _this.accessor = _this.searchkit.accessors.accessors[0];
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
            fields: ['lvl1', 'lvl2'], size: 0
        });
    });
    it("should render first level correctly", function () {
        _this.setResults();
        expect(_this.wrapper.html()).toEqual(TestHelpers_1.jsxToHTML(React.createElement("div", {"className": "hierarchical-menu-list filter--categories"}, React.createElement("div", {"className": "hierarchical-menu-list__header"}, "Categories"), React.createElement("div", {"className": "hierarchical-menu-list__root"}, React.createElement("div", {"className": "hierarchical-menu-list__hierarchical-options"}, React.createElement("div", null, React.createElement("div", {"className": "hierarchical-menu-option"}, React.createElement("div", {"className": "hierarchical-menu-option__text"}, "Red"), React.createElement("div", {"className": "hierarchical-menu-option__count"}, "10"))), React.createElement("div", null, React.createElement("div", {"className": "hierarchical-menu-option"}, React.createElement("div", {"className": "hierarchical-menu-option__text"}, "Green"), React.createElement("div", {"className": "hierarchical-menu-option__count"}, "20"))))))));
    });
    it("should render 2nd level correctly with selected 3rd level", function () {
        _this.accessor.state = _this.accessor.state.setValue([
            ["Red"], ["Maroon"]
        ]);
        _this.setResults();
        expect(_this.wrapper.html()).toEqual(TestHelpers_1.jsxToHTML(React.createElement("div", {"className": "hierarchical-menu-list filter--categories"}, React.createElement("div", {"className": "hierarchical-menu-list__header"}, "Categories"), React.createElement("div", {"className": "hierarchical-menu-list__root"}, React.createElement("div", {"className": "hierarchical-menu-list__hierarchical-options"}, React.createElement("div", null, React.createElement("div", {"className": "hierarchical-menu-option is-selected"}, React.createElement("div", {"className": "hierarchical-menu-option__text"}, "Red"), React.createElement("div", {"className": "hierarchical-menu-option__count"}, "10")), React.createElement("div", {"className": "hierarchical-menu-list__hierarchical-options"}, React.createElement("div", null, React.createElement("div", {"className": "hierarchical-menu-option"}, React.createElement("div", {"className": "hierarchical-menu-option__text"}, "Crimson"), React.createElement("div", {"className": "hierarchical-menu-option__count"}, "10"))), React.createElement("div", null, React.createElement("div", {"className": "hierarchical-menu-option is-selected"}, React.createElement("div", {"className": "hierarchical-menu-option__text"}, "Maroon"), React.createElement("div", {"className": "hierarchical-menu-option__count"}, "12")), React.createElement("div", {"className": "hierarchical-menu-list__hierarchical-options"})))), React.createElement("div", null, React.createElement("div", {"className": "hierarchical-menu-option"}, React.createElement("div", {"className": "hierarchical-menu-option__text"}, "Green"), React.createElement("div", {"className": "hierarchical-menu-option__count"}, "20"))))))));
    });
    it("should handle selecting an option", function () {
        _this.setResults();
        var redOption = _this.wrapper.find(".hierarchical-menu-list__hierarchical-options")
            .children().at(0).find(".hierarchical-menu-option");
        TestHelpers_1.fastClick(redOption);
        expect(_this.accessor.state.getValue()).toEqual([["Red"]]);
    });
});
//# sourceMappingURL=HierarchicalMenuFilterSpec.js.map