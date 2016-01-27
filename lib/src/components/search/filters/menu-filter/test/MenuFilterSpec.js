var _this = this;
var React = require("react");
var enzyme_1 = require("enzyme");
var MenuFilter_tsx_1 = require("../src/MenuFilter.tsx");
var core_1 = require("../../../../../core");
var bem = require("bem-cn");
var _ = require("lodash");
var TestHelpers_1 = require("../../../../__test__/TestHelpers");
describe("MenuFilter tests", function () {
    beforeEach(function () {
        _this.searchkit = core_1.SearchkitManager.mock();
        spyOn(_this.searchkit, "performSearch");
        _this.wrapper = enzyme_1.mount(React.createElement(MenuFilter_tsx_1.MenuFilter, {"searchkit": _this.searchkit, "translations": { "Red": "Red Translated" }, "field": "color", "title": "Color", "id": "color", "size": 10}));
        _this.getOptionAt = function (at) {
            return _this.wrapper.find(".menu-list__options")
                .children().at(at);
        };
        _this.accessor = _this.searchkit.accessors.accessors[0];
        _this.setResults = function () {
            _this.searchkit.setResults({
                aggregations: {
                    color: {
                        color: {
                            buckets: [
                                { key: "Red", doc_count: 10 },
                                { key: "Blue", doc_count: 11 },
                                { key: "Green", doc_count: 12 }
                            ]
                        }
                    }
                }
            });
        };
    });
    it("expect accessor options to be correct", function () {
        expect(_this.accessor.options).toEqual({
            id: "color", title: "Color", operator: "OR",
            size: 10, facetsPerPage: 50
        });
    });
    it("render correctly", function () {
        _this.setResults();
        expect(_this.wrapper.html()).toEqual(TestHelpers_1.jsxToHTML(React.createElement("div", {"className": "menu-list filter--color"}, React.createElement("div", {"className": "menu-list__header"}, "Color"), React.createElement("div", {"className": "menu-list__options"}, React.createElement("div", {"className": "menu-list-option menu-list__item is-selected"}, React.createElement("div", {"className": "menu-list-option__text"}, "All"), React.createElement("div", {"className": "menu-list-option__count"})), React.createElement("div", {"className": "menu-list-option menu-list__item"}, React.createElement("div", {"className": "menu-list-option__text"}, "Red Translated"), React.createElement("div", {"className": "menu-list-option__count"}, "10")), React.createElement("div", {"className": "menu-list-option menu-list__item"}, React.createElement("div", {"className": "menu-list-option__text"}, "Blue"), React.createElement("div", {"className": "menu-list-option__count"}, "11")), React.createElement("div", {"className": "menu-list-option menu-list__item"}, React.createElement("div", {"className": "menu-list-option__text"}, "Green"), React.createElement("div", {"className": "menu-list-option__count"}, "12"))))));
    });
    it("render selected correctly", function () {
        _this.accessor.state = _this.accessor.state.setValue("Blue");
        _this.setResults();
        expect(_this.wrapper.html()).toEqual(TestHelpers_1.jsxToHTML(React.createElement("div", {"className": "menu-list filter--color"}, React.createElement("div", {"className": "menu-list__header"}, "Color"), React.createElement("div", {"className": "menu-list__options"}, React.createElement("div", {"className": "menu-list-option menu-list__item"}, React.createElement("div", {"className": "menu-list-option__text"}, "All"), React.createElement("div", {"className": "menu-list-option__count"})), React.createElement("div", {"className": "menu-list-option menu-list__item"}, React.createElement("div", {"className": "menu-list-option__text"}, "Red Translated"), React.createElement("div", {"className": "menu-list-option__count"}, "10")), React.createElement("div", {"className": "menu-list-option menu-list__item is-selected"}, React.createElement("div", {"className": "menu-list-option__text"}, "Blue"), React.createElement("div", {"className": "menu-list-option__count"}, "11")), React.createElement("div", {"className": "menu-list-option menu-list__item"}, React.createElement("div", {"className": "menu-list-option__text"}, "Green"), React.createElement("div", {"className": "menu-list-option__count"}, "12"))))));
    });
    it("should handle selection correctly", function () {
        _this.setResults();
        var blue = _this.getOptionAt(2);
        var green = _this.getOptionAt(3);
        TestHelpers_1.fastClick(blue);
        expect(_this.accessor.state.getValue()).toEqual(["Blue"]);
        TestHelpers_1.fastClick(green);
        expect(_this.accessor.state.getValue()).toEqual(["Green"]);
        expect(_this.searchkit.performSearch).toHaveBeenCalled();
        //should clear if button clicked
        TestHelpers_1.fastClick(green);
        expect(_this.accessor.state.getValue()).toEqual([]);
    });
});
//# sourceMappingURL=MenuFilterSpec.js.map