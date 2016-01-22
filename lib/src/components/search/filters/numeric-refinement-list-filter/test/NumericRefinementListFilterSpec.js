var _this = this;
var React = require("react");
var enzyme_1 = require("enzyme");
var NumericRefinementListFilter_1 = require("../src/NumericRefinementListFilter");
var TestHelpers_1 = require("../../../../__test__/TestHelpers");
var core_1 = require("../../../../../core");
var bem = require("bem-cn");
var _ = require("lodash");
describe("MenuFilter tests", function () {
    beforeEach(function () {
        _this.searchkit = core_1.SearchkitManager.mock();
        spyOn(_this.searchkit, "performSearch");
        _this.wrapper = enzyme_1.mount(React.createElement(NumericRefinementListFilter_1.NumericRefinementListFilter, {"searchkit": _this.searchkit, "id": "score", "title": "Score", "field": "score", "options": [
            { title: "All" },
            { title: "up to 20", from: 0, to: 21 },
            { title: "21 to 40", from: 21, to: 41 }
        ]}));
        _this.accessor = _this.searchkit.accessors.accessors[0];
        _this.setResults = function () {
            _this.searchkit.setResults({
                aggregations: {
                    score: {
                        score: {
                            buckets: [
                                { key: "All", doc_count: 30 },
                                { key: "up to 20", doc_count: 10 },
                                { key: "21 to 40", doc_count: 20 }
                            ]
                        }
                    }
                }
            });
        };
    });
    it("should set accessor options correctly", function () {
        expect(_this.accessor.key).toBe("score");
        expect(_this.accessor.options).toEqual({
            id: 'score', field: "score", title: "Score", options: [
                { title: "All" },
                { title: "up to 20", from: 0, to: 21 },
                { title: "21 to 40", from: 21, to: 41 }
            ]
        });
    });
    it("should render correctly()", function () {
        _this.setResults();
        expect(_this.wrapper.html()).toEqual(TestHelpers_1.jsxToHTML(React.createElement("div", {"className": "numeric-refinement-list filter--score"}, React.createElement("div", {"className": "numeric-refinement-list__header"}, "Score"), React.createElement("div", {"className": "numeric-refinement-list__options"}, React.createElement("div", {"className": "numeric-refinement-list-option numeric-refinement-list__item"}, React.createElement("div", {"className": "numeric-refinement-list-option__text"}, "All"), React.createElement("div", {"className": "numeric-refinement-list-option__count"}, "30")), React.createElement("div", {"className": "numeric-refinement-list-option numeric-refinement-list__item"}, React.createElement("div", {"className": "numeric-refinement-list-option__text"}, "up to 20"), React.createElement("div", {"className": "numeric-refinement-list-option__count"}, "10")), React.createElement("div", {"className": "numeric-refinement-list-option numeric-refinement-list__item"}, React.createElement("div", {"className": "numeric-refinement-list-option__text"}, "21 to 40"), React.createElement("div", {"className": "numeric-refinement-list-option__count"}, "20"))))));
    });
    it("should select correctly", function () {
        _this.accessor.state = _this.accessor.state.setValue("21 to 40");
        _this.setResults();
        var lastOption = _this.wrapper.find(".numeric-refinement-list__options")
            .children().at(2);
        expect(TestHelpers_1.hasClass(lastOption, "is-selected")).toBe(true);
    });
    it("should handle clicking an option", function () {
        _this.setResults();
        var secondOption = _this.wrapper.find(".numeric-refinement-list__options")
            .children().at(1);
        secondOption.simulate("mouseDown", { button: 0 });
        expect(_this.accessor.state.getValue()).toBe("up to 20");
        expect(_this.searchkit.performSearch).toHaveBeenCalled();
    });
});
//# sourceMappingURL=NumericRefinementListFilterSpec.js.map