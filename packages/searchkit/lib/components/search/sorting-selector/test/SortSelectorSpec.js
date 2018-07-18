var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var enzyme_1 = require("enzyme");
var SortingSelector_1 = require("../src/SortingSelector");
var core_1 = require("../../../../core");
var ui_1 = require("../../../ui");
describe("SortingSelector tests", function () {
    beforeEach(function () {
        _this.searchkit = core_1.SearchkitManager.mock();
        spyOn(_this.searchkit, "performSearch");
        _this.setWrapper = function () {
            _this.wrapper = enzyme_1.mount(React.createElement(SortingSelector_1.SortingSelector, { searchkit: _this.searchkit, options: [
                    { label: "Relevance" },
                    { label: "Latest Releases", field: "released", order: "desc" },
                    { label: "Earliest Releases", field: "released", order: "asc", key: "earliest" }
                ], translations: { "Relevance": "Relevance translated" } }));
        };
        _this.setWrapper();
        _this.accessor = _this.searchkit.getAccessorByType(core_1.SortingAccessor);
        _this.setResults = function () {
            _this.searchkit.setResults({
                hits: {
                    hits: [1, 2],
                    total: 2
                }
            });
        };
    });
    it("is disabled when no results", function () {
        expect(_this.wrapper.children().length).toBe(1);
        expect(_this.wrapper.html()).toMatchSnapshot();
    });
    it("renders with results", function () {
        _this.setResults();
        expect(_this.wrapper.children().length).toBe(1);
        expect(_this.wrapper.html()).toMatchSnapshot();
    });
    it("renders with selected value", function () {
        _this.accessor.state = _this.accessor.state.setValue("released_desc");
        _this.setResults();
        _this.setWrapper();
        expect(_this.wrapper.html()).toMatchSnapshot();
    });
    it("renders with defaultOption", function () {
        _this.accessor.options.options[2].defaultOption = true;
        _this.setResults();
        _this.setWrapper();
        expect(_this.wrapper.html()).toMatchSnapshot();
    });
    it("select new sort option", function () {
        _this.accessor.state = _this.accessor.state.setValue("released_desc");
        _this.setResults();
        var earlyOption = _this.wrapper.find("select").children().at(2);
        earlyOption.simulate("change");
        expect(_this.accessor.state.getValue()).toBe("earliest");
        expect(_this.searchkit.performSearch).toHaveBeenCalled();
    });
    it("handle prop reload without breaking computed keys", function () {
        _this.wrapper.setProps({ options: [
                { label: "Relevance" },
                { label: "Latest Releases", field: "released", order: "desc" },
                { label: "Earliest Releases", field: "released", order: "asc", key: "earliest" }
            ] });
        _this.setResults();
        expect(_this.wrapper.html()).toMatchSnapshot();
    });
    it("custom mod, className, listComponent", function () {
        _this.wrapper = enzyme_1.mount(React.createElement(SortingSelector_1.SortingSelector, { searchkit: _this.searchkit, mod: "my-select", className: "custom-class", listComponent: ui_1.Toggle, options: [
                { label: "Relevance" },
                { label: "Latest Releases", field: "released", order: "desc" },
                { label: "Earliest Releases", field: "released", order: "asc", key: "earliest" }
            ] }));
        expect(_this.wrapper.html()).toMatchSnapshot();
    });
});
//# sourceMappingURL=SortSelectorSpec.js.map