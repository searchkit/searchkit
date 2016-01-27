var _this = this;
var React = require("react");
var enzyme_1 = require("enzyme");
var SortingSelector_tsx_1 = require("../src/SortingSelector.tsx");
var core_1 = require("../../../../core");
var bem = require("bem-cn");
var _ = require("lodash");
var jsxToHTML = require('react-dom/server').renderToStaticMarkup;
describe("SortingSelector tests", function () {
    beforeEach(function () {
        _this.searchkit = core_1.SearchkitManager.mock();
        spyOn(_this.searchkit, "performSearch");
        _this.wrapper = enzyme_1.mount(React.createElement(SortingSelector_tsx_1.SortingSelector, {"searchkit": _this.searchkit, "options": [
            { label: "Relevance", field: "_score", order: "desc" },
            { label: "Latest Releases", field: "released", order: "desc" },
            { label: "Earliest Releases", field: "released", order: "asc" }
        ]}));
        _this.accessor = _this.searchkit.accessors.accessors[0];
        _this.setResults = function () {
            _this.searchkit.setResults({
                hits: {
                    hits: [1, 2],
                    total: 2
                }
            });
        };
    });
    it("does not render with no results", function () {
        expect(_this.wrapper.children().length).toBe(0);
    });
    it("renders with results", function () {
        _this.setResults();
        expect(_this.wrapper.children().length).toBe(1);
        expect(_this.wrapper.html()).toEqual(jsxToHTML(React.createElement("div", {"className": "sorting-selector"}, React.createElement("select", null, React.createElement("option", {"value": "Relevance"}, "Relevance"), React.createElement("option", {"value": "Latest Releases"}, "Latest Releases"), React.createElement("option", {"value": "Earliest Releases"}, "Earliest Releases")))));
    });
    it("renders with selected value", function () {
        _this.accessor.state = _this.accessor.state.setValue("Latest Releases");
        _this.setResults();
        expect(_this.wrapper.html()).toEqual(jsxToHTML(React.createElement("div", {"className": "sorting-selector"}, React.createElement("select", {"value": "Latest Releases", "onChange": _.identity}, React.createElement("option", {"value": "Relevance"}, "Relevance"), React.createElement("option", {"value": "Latest Releases"}, "Latest Releases"), React.createElement("option", {"value": "Earliest Releases"}, "Earliest Releases")))));
    });
    it("select new sort option", function () {
        _this.accessor.state = _this.accessor.state.setValue("Latest Releases");
        _this.setResults();
        var earlyOption = _this.wrapper.find("select").children().at(2);
        earlyOption.simulate("change");
        expect(_this.accessor.state.getValue()).toBe("Earliest Releases");
        expect(_this.searchkit.performSearch).toHaveBeenCalled();
    });
});
//# sourceMappingURL=SortSelectorSpec.js.map